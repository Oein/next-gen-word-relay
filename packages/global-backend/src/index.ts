import express from "express";
import { createServer } from "http";
import "dotenv/config";
import CFG from "./config/config";

// Components
import applyChannelManager from "./components/channelManager";

// Common Libraries
import logger from "@logger";
import { connect as connectDB } from "../../common-backend/src/db/index";

// Main
await connectDB();

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
  logger.success(`Server is running on port ${PORT}`);
});
