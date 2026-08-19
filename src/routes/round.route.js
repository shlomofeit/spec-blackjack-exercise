import * as roundController from "../controllers/round.controller.js";
import express from "express";

const router = express.Router();

router.post("/", roundController.createRoundController);

// for tests
router.get("/get-round/:roundId", roundController.getRound);

export default router;
