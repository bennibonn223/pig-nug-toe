document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".tile");
  const PLAYER_X = "X";
  const PLAYER_O = "O";
  let turn = null;

  const boardState = Array(tiles.length).fill(null);

  const strike = document.getElementById("strike");
  const gameOverArea = document.getElementById("game-over-area");
  const gameOverText = document.getElementById("game-over-text");
  const playAgain = document.getElementById("play-again");

  const startSelection = document.getElementById("start-selection");
  const startPig = document.getElementById("start-pig");
  const startNug = document.getElementById("start-nug");

  startPig.addEventListener("click", () => startGame(PLAYER_X));
  startNug.addEventListener("click", () => startGame(PLAYER_O));
  playAgain.addEventListener("click", resetGame);

  function startGame(player) {
    turn = player;

    // ✅ Aggiunge il listener solo dopo la selezione
    tiles.forEach((tile) => {
      tile.addEventListener("click", tileClick);
    });

    // Nasconde il pannello di selezione
    startSelection.classList.add("hidden");
    setTimeout(() => {
      startSelection.style.display = "none";
    }, 300);

    setHoverText();
  }

  function tileClick(event) {
    if (gameOverArea.classList.contains("visible") || turn === null) {
      return;
    }

    const tile = event.target;

    // ✅ Blocca la casella se è già stata usata
    if (tile.querySelector("img") || boardState[tile.dataset.index - 1] !== null) {
      return;
    }

    const tileNumber = tile.dataset.index;

    if (turn === PLAYER_X) {
      tile.innerHTML = `<img src="images/x.png" alt="Pig" class="symbol" />`;
      boardState[tileNumber - 1] = PLAYER_X;
      turn = PLAYER_O;
    } else {
      tile.innerHTML = `<img src="images/o.png" alt="Nug" class="symbol" />`;
      boardState[tileNumber - 1] = PLAYER_O;
      turn = PLAYER_X;
    }

    setHoverText();
    checkWinner();
  }

  function checkWinner() {
    const winningCombinations = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        boardState[a - 1] &&
        boardState[a - 1] === boardState[b - 1] &&
        boardState[a - 1] === boardState[c - 1]
      ) {
        gameOverScreen(boardState[a - 1]);
        return;
      }
    }

    // Pareggio
    if (boardState.every((tile) => tile !== null)) {
      gameOverScreen(null);
    }
  }

  function gameOverScreen(winnerText) {
    let text = "Draw!";
    if (winnerText != null) {
      text = winnerText === PLAYER_X
        ? "Winner of Pig Nug Toe is Pig! 🐷"
        : "Winner of Pig Nug Toe is Nug! 🍗";
    }
    gameOverArea.classList.add("visible");
    gameOverText.innerText = text;
  }

  function resetGame() {
    strike.className = "strike";
    gameOverArea.classList.remove("visible");
    boardState.fill(null);

    // ✅ Rimuove le immagini dalle caselle e i listener per evitare conflitti
    tiles.forEach((tile) => {
      tile.innerHTML = "";
      tile.removeEventListener("click", tileClick);
    });

    // ✅ Rende visibile di nuovo la selezione iniziale
    startSelection.classList.remove("hidden");
    startSelection.style.display = "block";
    turn = null;
  }

  function setHoverText() {
    tiles.forEach((tile) => {
      tile.classList.remove("x-hover");
      tile.classList.remove("o-hover");
    });

    if (turn === PLAYER_X) {
      tiles.forEach((tile) => {
        if (!tile.querySelector("img")) {
          tile.classList.add("x-hover");
        }
      });
    } else if (turn === PLAYER_O) {
      tiles.forEach((tile) => {
        if (!tile.querySelector("img")) {
          tile.classList.add("o-hover");
        }
      });
    }
  }
});
