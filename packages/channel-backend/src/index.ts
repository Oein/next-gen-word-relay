import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

import session from "express-session";
import MDBSession from "connect-mongodb-session";

// Components
import applyWS from "./components/ws";
import applyGlobalBackend from "./components/global";
import applyAuth from "./components/auth";

// Common Libraries
import logger from "@logger";
import { connect as connectDB, DBNAME, url as DBURL } from "@common/db";

// Main
await connectDB();

const app = express();
app.use(
  express.json({
    limit: "1mb",
  })
);
const MongoDBStore = MDBSession(session);
const store = new MongoDBStore({
  uri: DBURL,
  databaseName: DBNAME,
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

applyGlobalBackend(app);
applyAuth(app);

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
