import { playerService } from "../services/player.service.js";
import express from "express";

export async function createPlayerController(req, res, next) {
  try {
    const result = await playerService.createPlayerService();
    console.log(result);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
