import { MongoClient } from "mongodb";
import logger from "../logger";

const url = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(url);

export async function connect() {
  logger.loading("Connecting to MongoDB");
  try {
    await client.connect();
  } catch (e) {
    logger.error("Failed to connect to MongoDB");
    logger.error(e);

    process.exit(1);
    return;
  }
  logger.success("Connected to MongoDB");
}

export default client;
