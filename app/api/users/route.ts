import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs"; // Added bcrypt for password hashing

const prisma = new PrismaClient();

// ✅ GET: Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Fetch users
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, secondName, phoneNumber, email, password, profilePic, userRole } = body;

    // Log userRole to debug incoming value
    console.log("Received userRole:", userRole);

    // Validate required fields
    if (!firstName || !secondName || !phoneNumber || !email || !password || !userRole) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Validate userRole to ensure it's a valid enum value
    const validRoles = ["USER", "ADMIN", "POLICE", "AMBULANCE", "CARRIER"];
    if (!validRoles.includes(userRole)) {
      return NextResponse.json({ message: "Invalid user role." }, { status: 400 });
    }

    // Check if email or phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phoneNumber }] },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User with this email or phone number already exists." }, { status: 400 });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password using bcrypt

    // Create user
    const newUser = await prisma.user.create({
      data: {
        firstName,
        secondName,
        phoneNumber,
        email,
        password: hashedPassword, // Store the hashed password
        profilePic, // Optional: Include this if required
        userRole, // The role of the user
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
