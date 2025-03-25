import { Server } from "socket.io";

// Extend globalThis to include io
declare global {
  interface Global {
    io?: Server;
  }
}

const globalAny = global as unknown as Global;

if (!globalAny.io) {
  console.log("Initializing Socket.IO server...");

  globalAny.io = new Server(49160, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  globalAny.io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their alert room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

export const io = globalAny.io;
