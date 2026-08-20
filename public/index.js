const HEARTS_ICON = "https://cdn-icons-png.flaticon.com/512/13481/13481175.png";
const DIAMONDS_ICON = "https://cdn-icons-png.flaticon.com/512/6446/6446503.png";
const CLUBS_ICON = "https://cdn-icons-png.flaticon.com/512/16740/16740022.png";
const SPADES_ICON = "https://cdn-icons-png.flaticon.com/512/1/1438.png";
const SUIT_ICONS = {
  hearts: HEARTS_ICON,
  diamonds: DIAMONDS_ICON,
  clubs: CLUBS_ICON,
  spades: SPADES_ICON,
};

// player
let localPlayerId = localStorage.getItem("playerId");
const chipsDetail = document.querySelector("#chips");
const statusDetail = document.querySelector("#status");
const betDetail = document.querySelector("#bet-p");
const playerCardsDetail = document.querySelector("#player-cards-p");

// round
const gameDetails = document.querySelector("#game-details");
const startRound = document.querySelector("#start-round");
const startRoundBtn = document.querySelector("#start-round-btn");

async function activeCurrentRound(obj) {
  const { roundId, playerCards, dealerUpCard, chips, bet, status } = obj;
  chipsDetail.textContent = `Chips: ${chips}`;
  betDetail.textContent = `BET: ${bet}`;
  playerCardsDetail.textContent = `Player cards: ${playerCards.length}`;
  statusDetail.textContent = `status: ${status}`;
  const playerBox = document.querySelector("#player-box");
  const dealerBox = document.querySelector("#dealer-box");

  playerCards.forEach((card) => {
    const divCard = document.createElement("div");
    const imgCard = document.createElement("img");
    const numCard = document.createElement("h3");

    divCard.classList.add("card");

    imgCard.src = SUIT_ICONS[card.suit];
    imgCard.classList.add("suit");

    numCard.textContent = card.rank;
    numCard.classList.add("rank");

    divCard.appendChild(imgCard);
    divCard.appendChild(numCard);
    playerBox.appendChild(divCard);
  });

  const divCard = document.createElement("div");
  const imgCard = document.createElement("img");
  const numCard = document.createElement("h3");
  divCard.classList.add("card");
  imgCard.src = SUIT_ICONS[dealerUpCard.suit];
  imgCard.classList.add("suit");
  numCard.textContent = dealerUpCard.rank;
  numCard.classList.add("rank");
  divCard.appendChild(imgCard);
  divCard.appendChild(numCard);
  dealerBox.appendChild(divCard);
}

async function loadGame() {
  if (!localPlayerId) {
    localPlayerId = await loadPlayer();
  }

  const call = await fetch("http://localhost:3000/my-round", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      "x-player-id": localPlayerId,
    },
  });
  const activeRound = await call.json();

  if (!activeRound.roundId && activeRound.round === null) {
    gameDetails.style.display = "none";
  } else {
    startRound.style.display = "none";
    await activeCurrentRound(activeRound);
  }
}

async function loadPlayer() {
  if (!localPlayerId) {
    const call = await fetch("http://localhost:3000/start-game", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    const result = await call.json();
    const { playerId, chips } = result;
    localStorage.setItem("playerId", playerId);
    return playerId;
  }
}

startRoundBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const bet = document.querySelector("#bet");
  const call = await fetch("http://localhost:3000/start-round", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      "x-player-id": localPlayerId,
    },
    body: JSON.stringify({ bet: Number(bet.value) }),
  });

  const result = await call.json();
  activeRound(result);
});

document.addEventListener("DOMContentLoaded", loadGame);
