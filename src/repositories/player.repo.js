import { getMongo } from "../db/mongo.js";
import { Collection, ObjectId } from "mongodb";

export async function getCollection() {
  const db = await getMongo();
  /** @type {Collection} */

  const collection = db.collection("players");
  return collection;
}

export async function newPlayer() {
  const collection = await getCollection();

  const result = await collection.insertOne({
    chips: 1000,
    createdAt: new Date().toISOString(),
  });

  return result.insertedId.toString();
}

async function getById(id) {
  const collection = await getCollection();
  const result = await collection.findOne({ _id: new ObjectId(id) });
  result._id = result._id.toString();
  return result;
}

async function updateById(id, obj) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: obj },
  );
  return result;
}

async function chipsUpdate(id, chips) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $inc: { chips: -chips } },
    { returnDocument: "after" },
  );
  return result.chips;
}

export const playerRepo = {
  getCollection,
  newPlayer,
  getById,
  updateById,
  chipsUpdate,
};
