const gameBoard = (() => {
  let gameArray = ["", "", "", "", "", "", "", "", ""];
  const render = () => {
    let boardHTML = "";

    gameArray.forEach((square, index) => {
      boardHTML += `<div class="cell" id="${index}">${square}</div>`;
    });
    document.querySelector(".cell-container").innerHTML = boardHTML;
    const squares = document.querySelectorAll(".cell");
    squares.forEach((square) => {
      square.addEventListener("click", game.handleClick);
    });
  };
  const update = (index, value) => {
    gameArray[index] = value;
    render();
  };

  const getGameBoard = () => gameArray;
  return {
    render,
    update,
    getGameBoard,
  };
})();

const displayController = (() => {
  const renderMessage = (message) => {
    document.querySelector(".status").textContent = message;
  };
  return {
    renderMessage,
  };
})();
const createPlayer = (name, marker) => {
  return {
    name,
    marker,
  };
};
const game = (() => {
  let players = [];
  let currentPlayerIndex;
  let gameOver;

  const start = () => {
    players = [
      createPlayer(document.querySelector("#player1").value, "X"),
      createPlayer(document.querySelector("#player2").value, "O"),
    ];
    currentPlayerIndex = 0;
    gameOver = false;
    gameBoard.render();
    const squares = document.querySelectorAll(".cell");
    squares.forEach((square) => {
      square.addEventListener("click", handleClick);
    });
  };
  const handleClick = (event) => {
    if (gameOver) {
      return;
    }
    let index = parseInt(event.target.id);

    if (gameBoard.getGameBoard()[index] !== "") {
      return;
    }
    gameBoard.update(index, players[currentPlayerIndex].marker);
    if (
      checkForWin(gameBoard.getGameBoard(), players[currentPlayerIndex].marker)
    ) {
      gameOver = true;
      displayController.renderMessage(
        `${players[currentPlayerIndex].name} won!`
      );
    } else if (checkForTie(gameBoard.getGameBoard())) {
      gameOver = true;
      displayController.renderMessage("It's a tie");
    }
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };
  const restart = () => {
    for (let i = 0; i < 9; i++) {
      gameBoard.update(i, "");
    }
    gameBoard.render();
    gameOver = false;
    document.querySelector(".status").innerHTML = "";
  };
  return {
    start,
    handleClick,
    restart,
  };
})();

function checkForTie(board) {
  return board.every((cell) => cell !== "");
}
function checkForWin(board) {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}
const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
  game.restart();
});
const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  game.start();
});
