import { roundRepo } from "../repositories/round.repo.js";
import { roundService } from "../services/round.service.js";
import express from "express";

export async function createRoundController(req, res, next) {
  try {
    const result = await roundService.createRoundService(
      req.body.bet,
      req.body.player,
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getRound(req, res, next) {
  try {
    const roundId = req.params.roundId;
    const result = await roundRepo.getRoundById(roundId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
