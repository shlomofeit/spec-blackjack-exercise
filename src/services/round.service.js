import { errCreator } from "../utils.js";
import { playerRepo } from "../repositories/player.repo.js";
import { roundRepo } from "../repositories/round.repo.js";
import { ObjectId } from "mongodb";

function getRandomCard() {
  // prettier-ignore
  const rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suit = ["hearts", "diamonds", "clubs", "spades"];

  const randomRank = rank[Math.floor(Math.random() * rank.length)];
  const randomSuit = suit[Math.floor(Math.random() * suit.length)];
  return { randomRank, randomSuit };
}

async function createRoundService(bet, player) {
  if (bet <= 0 || player.chips < bet) {
    throw errCreator(400, "Not enogh chips or incorrect bet");
  }

  const activeRound = await roundRepo.getActiveRoundByPlayerId(player._id);

  if (activeRound) {
    throw errCreator(409, "There are already round with 'in progress' status");
  }
  const card1 = getRandomCard();
  const card2 = getRandomCard();
  const card3 = getRandomCard();
  const card4 = getRandomCard();

  const newRound = {
    playerId: player._id,
    bet,
    playerCards: [card1, card2],
    dealerCards: [card3, card4],
    status: "in_progress",
    createdAt: new Date().toISOString(),
  };

  const roundId = await roundRepo.newRound(newRound);
  const round = await roundRepo.getRoundById(roundId);
  if (!round) {
    throw errCreator(
      500,
      "round not found (new round was created! pls check it.)",
    );
  }
  const updatedPlayer = await playerRepo.chipsUpdate(player._id, bet);
  const res = {
    id: roundId,
    playerCards: newRound.playerCards,
    dealerUpCard: newRound.dealerCards[0],
    chips: updatedPlayer,
  };
  return res;
}

export const roundService = { createRoundService };
