import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

let db, client;

export async function mongoConn(uri) {
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("blackjack");
    console.log("mongo is connected...");
    return db;
  } catch (error) {
    console.error(error);
  }
}

export async function getMongo() {
  if (db) return db;

  const mongoDb = await mongoConn(uri);
  return mongoDb;
}
