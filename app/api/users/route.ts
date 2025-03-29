import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server"; // ✅ Import NextRequest for type safety

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, secondName, phoneNumber, email, password, profilePic, userRole } = body;

    // Validate required fields
    if (!firstName || !secondName || !phoneNumber || !email || !password) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Check if email or phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or phone number already exists." }, { status: 400 });
    }

    // Create user
    const newUser = await prisma.user.create({
      data: { firstName, secondName, phoneNumber, email, password, profilePic, userRole },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
