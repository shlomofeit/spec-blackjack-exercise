import { playerRepo } from "../repositories/player.repo.js";

async function createPlayerService() {
  const playerId = await playerRepo.newPlayer();
  const res = { playerId, chips: 1000 };
  return res;
}

export const playerService = { createPlayerService };
