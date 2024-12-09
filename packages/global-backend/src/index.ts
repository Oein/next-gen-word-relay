import express from "express";
import { createServer } from "http";
import "dotenv/config";
import CFG from "./config/config";

import cookieParser from "cookie-parser";
import session from "express-session";
import MDBSession from "connect-mongodb-session";

// Components
import applyChannelManager from "./components/channelManager";

// Common Libraries
import logger from "@logger";
import { connect as connectDB, url as DBURL } from "@common/db";

// Main
await connectDB();

const app = express();

app.use(
  express.json({
    limit: "1mb",
  })
);
app.use(cookieParser());

const MongoDBStore = MDBSession(session);
const store = new MongoDBStore({
  uri: DBURL,
  collection: "sessions",
});
store.on("error", function (error) {
  logger.error(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "SuperS3cr3t 5e55i0n K3y",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);

// ====================

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
