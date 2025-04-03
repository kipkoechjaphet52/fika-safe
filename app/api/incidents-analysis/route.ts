import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch incidents data for analysis
export async function GET() {
  try {
    const incidents = await prisma.incident.findMany({
      select: {
        month: true,
        incidents: true,  // Adjust to fit your schema if necessary
      },
    });

    return NextResponse.json(incidents, { status: 200 });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
