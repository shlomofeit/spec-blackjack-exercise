import * as roundController from "../controllers/round.controller.js";
import express from "express";
import { getPlayerByHeader } from "../middlewares/round.middleware.js";

const router = express.Router();

router.post(
  "/start-round",
  getPlayerByHeader,
  roundController.createRoundController,
);
router.post("/hit", getPlayerByHeader, roundController.hitRound);
router.post("/stand", getPlayerByHeader, roundController.standRound);
router.get("/my-round", getPlayerByHeader, roundController.getRound);

export default router;
