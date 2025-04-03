import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { latitude, longitude } = await req.json();
    if (!latitude || !longitude) {
      return new Response(JSON.stringify({ error: "Invalid location data" }), { status: 400 });
    }

    // Get user email from session
    const email = session.user?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "User email not found" }), { status: 400 });
    }

    // Check if the email belongs to a User
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    // Check if the email belongs to a Staff member
    const staff = await prisma.staff.findUnique({
      where: { email },
    });

    // If user exists, update User's location
    if (user) {
      const newLocation = await prisma.userLocation.create({
        data: {
          latitude,
          longitude,
          user: { connect: { id: user.id } },
        },
      });
      return new Response(JSON.stringify(newLocation), { status: 201 });
    }

    // If staff exists, update Staff's location, but only if they are not a USER and are a CARRIER
    if (staff && staff.userRole !== "USER" && staff.userRole === "CARRIER" ) {
      const newLocation = await prisma.staffLocation.create({
        data: {
          latitude,
          longitude,
          staff: { connect: { id: staff.id } },
        },
      });
      return new Response(JSON.stringify(newLocation), { status: 201 });
    }

    // If neither user nor staff exists
    return new Response(JSON.stringify({ error: "User or Staff not found" }), { status: 404 });

  } catch (error) {
    console.error("Error saving location:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
