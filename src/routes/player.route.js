import * as playerController from "../controllers/player.controller.js";
import express from "express";

const router = express.Router();

router.post("/start-game", playerController.createPlayerController);

export default router;
