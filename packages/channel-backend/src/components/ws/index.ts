import type { Express } from "express";
import type { Server } from "socket.io";

let connectionCount = 0;

export function getConnectionCount() {
  return connectionCount;
}

export default function applyWS(app: Express, io: Server) {
  io.on("connection", (socket) => {
    connectionCount++;
    socket.on("disconnect", () => {
      connectionCount--;
    });
  });
}
