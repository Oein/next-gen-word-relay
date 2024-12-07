import { Router } from "express";
import type { Express } from "express";
import CFG from "../../config/config";

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
}
