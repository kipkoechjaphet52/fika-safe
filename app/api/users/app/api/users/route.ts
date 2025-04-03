import { NextResponse } from "next/server";

let users = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: "2", name: "Jane Doe", email: "jane@example.com", role: "User" },
];

// GET Users
export async function GET() {
  return NextResponse.json(users);
}

// ADD User
export async function POST(req: Request) {
  const newUser = await req.json();
  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}

// DELETE User
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  users = users.filter((user) => user.id !== userId);
  return NextResponse.json({ message: "User deleted", users });
}
