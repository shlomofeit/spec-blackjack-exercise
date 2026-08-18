import { getMongo } from "../db/mongo.js";
import { Collection } from "mongodb";

export async function getCollection() {
  const db = await getMongo();
  /** @type {Collection} */

  const collection = db.collection("rounds");
  return collection;
}

export async function newRound(obj) {
  const collection = await getCollection();
  const result = await collection.insertOne(obj);

  return result.insertedId;
}

async function getActiveRoundByPlayerId(playerId) {
  const collection = await getCollection();
  const result = await collection.findOne({
    playerId: new ObjectId(playerId),
    status: "in_progress",
  });
  return result;
}

async function statusUpdate(id, status) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status } },
  );
  return result;
}

async function addCard(id, hand, cardObj) {
  const collection = await getCollection();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $push: { [hand]: cardObj } },
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
