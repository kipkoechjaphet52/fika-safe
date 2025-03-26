import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this import path is correct

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Incoming request for user ID:", params.id);

  try {
    if (!params.id) {
      console.error("❌ No user ID provided!");
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    console.log("Fetched user:", user);

    if (!user) {
      console.warn("⚠️ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("🔥 Internal Server Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
