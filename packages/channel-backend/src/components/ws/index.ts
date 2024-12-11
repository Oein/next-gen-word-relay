import type { Express } from "express";
import type { Server } from "socket.io";
import { verify, type JwtPayload } from "jsonwebtoken";
import { getAuthCollection } from "@common/db";
import { ObjectId } from "mongodb";

let connectionCount = 0;

export function getConnectionCount() {
  return connectionCount;
}

export default function applyWS(app: Express, io: Server) {
  const authCollection = getAuthCollection();
  io.on("connection", async (socket) => {
    const reqAuth = socket.handshake.headers.authorization;
    if (!reqAuth) {
      socket.disconnect();
      return;
    }

    const promiseVerify = await new Promise<
      | (JwtPayload & {
          id: string;
          svn: string;
        })
      | string
      | undefined
    >((resolve, reject) => {
      verify(reqAuth, process.env.JWT_SECRET || "SuperS", (err, decoded) => {
        if (err) {
          reject(undefined);
        } else {
          resolve(decoded as any);
        }
      });
    });

    if (promiseVerify === undefined) {
      socket.disconnect();
      return;
    }

    const { id, svn } = promiseVerify as {
      id: string;
      svn: string;
    };
    if (typeof id !== "string" || typeof svn !== "string") {
      socket.disconnect();
      return;
    }

    const promiseVerify2 = await new Promise<boolean>((resolve, reject) => {
      verify(svn, process.env.ACSKEY || "SuperS", (err, decoded) => {
        if (err) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });

    if (!promiseVerify2) {
      socket.disconnect();
      return;
    }

    const user = await authCollection.findOne({
      _id: ObjectId.createFromBase64(id),
    });

    if (!user) {
      socket.disconnect();
      return;
    }

    if (user.banned && user.banned.getTime() >= Date.now()) {
      socket.disconnect();
      return;
    }

    if (svn) connectionCount++;
    console.log("Connected", connectionCount, user);
    socket.on("disconnect", () => {
      connectionCount--;
    });
  });
}
