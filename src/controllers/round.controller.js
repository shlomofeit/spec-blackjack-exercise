import { roundService } from "../services/round.service.js";
import express from "express";

export async function createRoundController(req, res, next) {
  try {
    const result = await roundService.createRoundService(
      req.body.bet,
      req.body.player,
    );
    console.log(result);

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}
