import express from "express";
import { createServer } from "http";
import "dotenv/config";
import CFG from "./config/config";

import applyChannelManager from "./components/channelManager";

const app = express();

applyChannelManager(app);

app.get("/", (req, res) => {
  res.send({
    status: true,
    message: "Made with ❤️ by @Oein",
  });
});

const server = createServer(app);

const PORT = CFG.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
