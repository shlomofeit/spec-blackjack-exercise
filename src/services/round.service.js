import { cardCalculator, errCreator } from "../utils.js";
import { playerRepo } from "../repositories/player.repo.js";
import { roundRepo } from "../repositories/round.repo.js";
import { ObjectId } from "mongodb";

function getRandomCard() {
  // prettier-ignore
  const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suits = ["hearts", "diamonds", "clubs", "spades"];

  const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];
  return { rank: randomRank, suit: randomSuit };
}

async function createRoundService(bet, playerId) {
  const player = await playerRepo.getById(playerId);
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

export async function hitService(playerId) {
  const activeRound = await roundRepo.getActiveRoundByPlayerId(playerId);

  if (!activeRound) {
    throw errCreator(404, "There is no round with 'in progress' status");
  }
  const newCard = getRandomCard();
  let updatedRound = await roundRepo.addCard(
    activeRound._id,
    "playerCards",
    newCard,
  );

  const totalHand = cardCalculator(updatedRound.playerCards);

  if (totalHand > 21) {
    updatedRound = await roundRepo.statusUpdate(activeRound._id, "player_bust");
    const player = await playerRepo.getById(playerId);
    return {
      playerCards: updatedRound.playerCards,
      playerTotal: totalHand,
      status: updatedRound.status,
      chips: player.chips,
    };
  }

  const player = await playerRepo.getById(playerId);
  return {
    playerCards: updatedRound.playerCards,
    playerTotal: totalHand,
    status: updatedRound.status,
    chips: player.chips,
  };
}

export async function standService(playerId) {
  const activeRound = await roundRepo.getActiveRoundByPlayerId(playerId);

  if (!activeRound) {
    throw errCreator(404, "There is no round with 'in progress' status");
  }
  const totalPlayerHand = cardCalculator(activeRound.playerCards);
  let totalHand = cardCalculator(activeRound.dealerCards);
  let updatedRound;
  while (totalHand < 17) {
    const newCard = getRandomCard();
    updatedRound = await roundRepo.addCard(
      activeRound._id,
      "dealerCards",
      newCard,
    );
    totalHand = cardCalculator(updatedRound.dealerCards);
  }
  let status;
  if (totalHand > 21) {
    status = "dealer_bust";
  } else {
    if (totalPlayerHand > totalHand) {
      status = "player_win";
    } else if (totalPlayerHand < totalHand) {
      status = "dealer_win";
    } else {
      status = "push";
    }
  }
  updatedRound = await roundRepo.statusUpdate(activeRound._id, status);
  let chipsPayout = 0;
  if (status === "player_win" || status === "dealer_bust") {
    chipsPayout = activeRound.bet * 2;
  } else if (status === "push") {
    chipsPayout = activeRound.bet;
  }

  if (chipsPayout > 0) {
    await playerRepo.chipsUpdate(playerId, -chipsPayout);
  }
  const player = await playerRepo.getById(playerId);
  return {
    playerCards: updatedRound.playerCards,
    dealerCards: updatedRound.dealerCards,
    playerTotal: totalPlayerHand,
    dealerTotal: totalHand,
    status: updatedRound.status,
    chips: player.chips,
  };
}

export const roundService = { createRoundService, hitService, standService };
