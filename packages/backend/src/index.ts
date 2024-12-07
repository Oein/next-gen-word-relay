import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";
import applyWS from "./components/ws";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
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
  console.log(`Server is running on port ${PORT}`);
});
