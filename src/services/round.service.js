export function getRandomCard() {
  // prettier-ignore
  const rank = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const suit = ["hearts", "diamonds", "clubs", "spades"];

  const randomRank = rank[Math.floor(Math.random() * rank.length)];
  const randomSuit = suit[Math.floor(Math.random() * suit.length)];
  return { randomRank, randomSuit };
}
