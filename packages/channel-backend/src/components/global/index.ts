import type { Express } from "express";
import { Router } from "express";

import { getConnectionCount } from "./../ws/index";

export default function applyGlobalBackend(app: Express) {
  const router = Router();
  app.use(
    "/global-backend",
    (req, res, next) => {
      const auth = req.headers.authorization;
      if (auth !== process.env.ACSKEY) {
        res.status(401).send("Unauthorized");
        return;
      }
      next();
    },
    router
  );

  router.get("/ping", (req, res) => {
    res.send({
      ok: true,
      connections: getConnectionCount(),
      mx: parseInt(process.env.MAX_CONNECTIONS || "0"),
    });
  });
}
