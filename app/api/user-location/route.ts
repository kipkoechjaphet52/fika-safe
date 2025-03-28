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

    // Get user ID from session
    const email = session.user?.email;
    if (!email) {
      return new Response(JSON.stringify({ error: "User email not found" }), { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const newLocation = await prisma.userLocation.create({
      data: {
        latitude,
        longitude,
        user: { connect: { id: user.id } },
      },
    });

    return new Response(JSON.stringify(newLocation), { status: 201 });
  } catch (error) {
    console.error("Error saving location:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
