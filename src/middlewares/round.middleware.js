import { playerRepo } from "../repositories/player.repo.js";
import { errCreator } from "../utils.js";

export async function getPlayerByHeader(req, res, next) {
  try {
    const playerIdFromHeader = req.headers["x-player-id"];
    req.playerId = playerIdFromHeader;
    const result = await playerRepo.getById(playerIdFromHeader);
    if (!result) throw errCreator(401, "player not found");
    next();
  } catch (error) {
    next(error);
  }
}
