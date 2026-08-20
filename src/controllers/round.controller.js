import { playerRepo } from "../repositories/player.repo.js";
import { roundRepo } from "../repositories/round.repo.js";
import { roundService } from "../services/round.service.js";
import express from "express";
import { errCreator } from "../utils.js";

export async function createRoundController(req, res, next) {
  try {
    const result = await roundService.createRoundService(
      req.body.bet,
      req.playerId,
    );
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function hitRound(req, res, next) {
  try {
    const playerId = req.playerId;

    const result = await roundService.hitService(playerId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function standRound(req, res, next) {
  try {
    const playerId = req.playerId;

    const result = await roundService.standService(playerId);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getRound(req, res, next) {
  try {
    const playerId = req.playerId;
    const player = await playerRepo.getById(playerId);
    const result = await roundRepo.getActiveRoundByPlayerId(playerId);
    const myRoundRes = result
      ? {
          roundId: result._id,
          playerCards: result.playerCards,
          dealerUpCard: result.dealerCards[0],
          bet: result.bet,
          status: result.status,
          chips: player.chips,
        }
      : { round: null };
    return res.status(200).json(myRoundRes);
  } catch (error) {
    next(error);
  }
}
