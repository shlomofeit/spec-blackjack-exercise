export function errCreator(status = 500, message = "Internal server error") {
  const error = new Error();
  error.status = Number(status);
  error.message = {
    success: false,
    message: message,
  };

  return error;
}

export function cardCalculator(cardHand) {
  let total = 0;
  let acaCards = 0;

  for (const card of cardHand) {
    if (card.rank === "A") {
      total += 11;
      acaCards++;
    } else if (["J", "Q", "K"].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }

  while (total > 21 && acaCards > 0) {
    total -= 10;
    acaCards--;
  }

  return total;
}
