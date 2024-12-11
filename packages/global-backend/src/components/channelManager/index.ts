import { Router } from "express";
import type { Express } from "express";
import CFG from "../../config/config";
import { sign } from "jsonwebtoken";

export default function applyChannelManager(app: Express) {
  const router = Router();
  app.use("/channel-manager", router);

  const serverStatus = CFG.channelServers.map((server) => {
    return {
      status: "offline",
      name: server.name,
      url: server.url,

      online: 0,
      max: 0,
    };
  });

  const interval = setInterval(() => {
    serverStatus.forEach((server, i) => {
      fetch(server.url + "/global-backend/ping", {
        headers: {
          Authorization: CFG.channelServers[i].access_key,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            res
              .json()
              .then(
                (data: { ok: boolean; connections: number; mx: number }) => {
                  server.status = "online";
                  server.online = data.connections;
                  server.max = data.mx;
                }
              );
          } else {
            server.status = "offline";
          }
        })
        .catch(() => {
          server.status = "offline";
          server.online = 0;
          server.max = 0;
        });
    });
  }, CFG.PING_INTERVAL);

  router.get("/available-servers", (req, res) => {
    res.send(serverStatus);
  });

  router.get("/access-key", (req, res) => {
    const idxStr = req.query.idx;
    if (idxStr === undefined) {
      res.send({
        status: false,
        error: "Invalid index",
      });
      return;
    }

    const idx = parseInt(idxStr as string);
    const svr = CFG.channelServers[idx];
    if (svr === undefined) {
      res.send({
        status: false,
        error: "Invalid index",
      });
      return;
    }

    if (serverStatus[idx].status === "offline") {
      res.send({
        status: false,
        error: "Server is offline",
      });
      return;
    }

    if (serverStatus[idx].online >= serverStatus[idx].max) {
      res.send({
        status: false,
        error: "Server is full",
      });
      return;
    }

    if (req.user === undefined) {
      res.send({
        status: false,
        error: "Not authenticated",
      });
      return;
    }

    if (req.user.user.banned && req.user.user.banned.getTime() >= Date.now()) {
      res.send({
        status: false,
        error: "You are banned",
      });
      return;
    }

    // @ts-ignore

    res.send({
      status: true,
      sv: CFG.channelServers[idx].url,
      ak: sign(
        {
          id: req.user.id,
          svn: sign({ time: Date.now() }, CFG.channelServers[idx].access_key, {
            expiresIn: "1h",
          }),
        },
        process.env.JWT_SECRET || "SuperS",
        {
          expiresIn: "1h",
        }
      ),
    });
  });

  router.get("/user", (req, res) => {
    res.send({
      status: true,
      user: req.user,
      session: req.session,
    });
  });
}
