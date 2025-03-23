import { Server as SocketIOServer } from "socket.io";
import { NextRequest } from "next/server";
import { createServer } from "http";
import { Server as HTTPServer } from "http";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/utils/authOptions";
import { checkNewAlerts } from "@/app/lib/action";

const prisma = new PrismaClient();

let io: SocketIOServer | null = null;

export async function GET() {
  if (!io) {
    // Create an HTTP server
    const httpServer: HTTPServer = createServer();
    io = new SocketIOServer(httpServer, {
      path: "/api/location-socket",
      cors: { origin: "*" },
    });

    // Authenticate the user
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const userId = user.id;

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("locationUpdate", async (data) => {
        const { latitude, longitude } = data;

        if (!userId || !latitude || !longitude) return new Response(JSON.stringify("Missing required fields"), { status: 400 });

        try {
          await prisma.userLocation.create({
            data: { latitude, longitude, user: { connect: { id: userId } } },
          });

          if (io) {
            io.emit("updateLocation", data);
          }
        } catch (error) {
          console.error("Error saving location:", error);
        }

        await checkNewAlerts();
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    console.log("WebSocket server initialized.");
  }

  return new Response(JSON.stringify({ message: "WebSocket Server Running" }), {
    status: 200,
  });
}
