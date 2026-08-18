import * as playerController from "../controllers/player.controller.js";
import express from "express";

const router = express.Router();

router.post("/", playerController.createPlayerController);

export default router;
