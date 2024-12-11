import { Db, MongoClient } from "mongodb";
import logger from "../logger";

export const url = process.env.MONGO_URI || "mongodb://localhost:27017";
export const DBNAME = process.env.DB_NAME || "game";
const client = new MongoClient(url);

let db: Db;

declare global {
  namespace Express {
    interface User {
      id: string;
      user: IUser;
    }
  }
}

export async function ensureIndexes() {
  await getWordsCollection().createIndex(
    { word: 1 },
    {
      unique: true,
    }
  );
}

export async function connect() {
  logger.loading("Connecting to MongoDB");
  try {
    await client.connect();
    db = client.db(DBNAME);

    await ensureIndexes();
  } catch (e) {
    logger.error("Failed to connect to MongoDB");
    logger.error(e);

    process.exit(1);
    return;
  }
  logger.success("Connected to MongoDB");
}

export async function disconnect() {
  logger.loading("Disconnecting from MongoDB");
  await client.close();
  logger.success("Disconnected from MongoDB");
}

export function getWordsCollection() {
  return db.collection<{
    word: string;
    lang: number;
    tags: string[];
  }>("words", {});
}

export type IUser = {
  provider: string;
  id: string;
  email: string;
  username: string;

  permissions: string[];
  banned?: Date;
};

export function getAuthCollection() {
  return db.collection<IUser>("auth", {});
}

export default client;
