import { getMongo } from "../db/mongo.js";
import { Collection } from "mongodb";

export async function getCollection() {
  const db = await getMongo();
  /** @type {Collection} */

  const collection = db.collection("players");
  return collection;
}

export async function newUser(obj) {
  const collection = await getCollection();
  const result = await collection.insertOne(obj);

  return result.insertedId;
}

async function getById(id) {
  const collection = await getCollection();
  const result = await collection.findOne({ _id: id });
  return result;
}

async function updateById(id, chips) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $inc: { chips: -chips } },
  );
  return result;
}

async function chipsUpdate(id, chips) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: id },
    { $set: { chips: -chips } },
  );
  return result;
}

export const baseRepo = {
  getCollection,
  newUser,
  getById,
  updateById,
  chipsUpdate,
};
