import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, name: "John Mwangi", email: "john@example.com", phone: "1234567890", role: "Admin", status: "Active" },
    { id: 2, name: "Japheth Bet", email: "japheth@example.com", phone: "0987654321", role: "User", status: "Inactive" },
  ]);
}
