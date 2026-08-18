import { getMongo } from "../db/mongo.js";
import { Collection } from "mongodb";

export async function getCollection() {
  const db = await getMongo();
  /** @type {Collection} */

  const collection = db.collection("players");
  return collection;
}

export async function newUser() {
  const collection = await getCollection();
  const result = await collection.insertOne();

  return result.insertedId;
}

async function getById(id) {
  const collection = await getCollection();
  const result = await collection.findOne({ _id: new ObjectId(id) });
  return result;
}

async function updateById(id, chips) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { chips: -chips } },
  );
  return result;
}

async function chipsUpdate(id, chips) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { chips: -chips } },
  );
  return result;
}

export const playerRepo = {
  getCollection,
  newUser,
  getById,
  updateById,
  chipsUpdate,
};
