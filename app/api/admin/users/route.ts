import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check if there are any users in the database
    const existingUsers = await prisma.user.findMany();

    // If no users exist, insert a test user
    if (existingUsers.length === 0) {
      await prisma.user.create({
        data: {
          firstName: "John",
          secondName: "Doe",
          email: "johndoe@example.com",
          phoneNumber: "123456789",
          password: "defaultPassword123", // Ensure password hashing in real applications
          userRole: "ADMIN",
        },
      });
    }

    // Fetch updated user list
    const users = await prisma.user.findMany();

    // Format user data for the frontend
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: `${user.firstName} ${user.secondName}`,
      email: user.email,
      phone: user.phoneNumber,
      role: user.userRole,
      status: "Active",
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        firstName: body.firstName || "New",
        secondName: body.secondName || "User",
        email: body.email,
        phoneNumber: body.phone,
        password: "defaultPassword123", // Hash this before saving in real applications
        userRole: body.role || "USER",
      },
    });

    return NextResponse.json({
      id: newUser.id,
      name: `${newUser.firstName} ${newUser.secondName}`,
      email: newUser.email,
      phone: newUser.phoneNumber,
      role: newUser.userRole,
      status: "Active",
    });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
