import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

// Components
import applyWS from "./components/ws";
import applyGlobalBackend from "./components/global";

// Common Libraries
import logger from "@logger";
import { connect as connectDB } from "@common/db";

// Main
await connectDB();

const app = express();
app.use(
  express.json({
    limit: "1mb",
  })
);
applyGlobalBackend(app);

app.get("/", (req, res) => {
  res.send({
    status: true,
    message: "Made with ❤️ by @Oein",
  });
});

const PORT = process.env.PORT || 3005;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

applyWS(app, io);

server.listen(PORT, () => {
  logger.success(`Server is running on port ${PORT}`);
});
