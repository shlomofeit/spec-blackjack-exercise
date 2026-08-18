import { errCreator } from "../utils.js";
import { playerRepo } from "../repositories/player.repo.js";
import { roundRepo } from "../repositories/round.repo.js";

function getRandomCard() {
  // prettier-ignore
  const rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suit = ["hearts", "diamonds", "clubs", "spades"];

  const randomRank = rank[Math.floor(Math.random() * rank.length)];
  const randomSuit = suit[Math.floor(Math.random() * suit.length)];
  return { randomRank, randomSuit };
}

async function createRoundService(bet, player) {
  if (!bet > 0 || !player.chips >= bet) {
    throw errCreator(400, "Not enogh chips or incorrect bet");
  }

  const activeRound = await roundRepo.getActiveRoundByPlayerId(player.id);

  if (!activeRound) {
    throw errCreator(409, "There are already round with 'in progress' status");
  }

  const newRound = {
    ...player,
    playerCards: [getRandomCard(), getRandomCard()],
    dealerCards: [getRandomCard(), getRandomCard()],
    status: "in_prgress",
    createdAt: new Date().toISOString(),
  };
  const roundId = await rounRepo.newRound(newRound);
  const round = await rounRepo.getRoundById(roundId);
  if (!round) {
    throw errCreator();
  }
  const updatedPlayer = await playerRepo.chipsUpdate(player.id, bet);

  const res = {
    id: roundId,
    playerCards: round.playerCards,
    dealerUpCard: round.dealerCards[0],
    chips: updatedPlayer.chips,
  };
  return res;
}

export const roundService = { createRoundService };
