"strict mode";
const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const highScoreText = document.querySelector("#highscore");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = 0;
let snake = [
  {
    x: unitSize * 3,
    y: 0,
  },
  {
    x: unitSize * 2,
    y: 0,
  },
  {
    x: unitSize,
    y: 0,
  },
  {
    x: 0,
    y: 0,
  },
];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function updateScoreDisplay() {
  scoreText.textContent = "Score: " + score;
  highScoreText.textContent = "Highscore: " + highScore;
}

function gameStart() {
  running = true;
  updateScoreDisplay();
  createFood();
  drawFood();
  nextTick();
  // Remove existing event listeners before adding new ones
  window.removeEventListener("keydown", changeDirection);
  window.addEventListener("keydown", changeDirection);
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75);
  } else {
    displayGameOver();
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
  if (score > highScore) {
    highScore = score;
    updateScoreDisplay();
  }
}

function createFood() {
  function randomFood(min, max) {
    const randNum =
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    return randNum;
  }

  let foodIsOnSnake = true;
  while (foodIsOnSnake) {
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);

    // Check if food coordinates overlap with snake's body
    foodIsOnSnake = snake.some((part) => part.x === foodX && part.y === foodY);
  }
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };

  snake.unshift(head);
  // if food is eaten
  if (snake[0].x == foodX && snake[0].y == foodY) {
    score += 1;
    updateScoreDisplay();
    createFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const goingUp = yVelocity == -unitSize;
  const goingDown = yVelocity == unitSize;
  const goingRight = xVelocity == unitSize;
  const goingLeft = xVelocity == -unitSize;

  switch (true) {
    case keyPressed == LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed == UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed == RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed == DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameWidth:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i += 1) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) running = false;
  }
}

function displayGameOver() {
  ctx.font = "50px MV Boli";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", gameWidth / 2, gameHeight / 2);
  running = false;
  showModal();
}

function resetGame() {
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    {
      x: unitSize * 3,
      y: 0,
    },
    {
      x: unitSize * 2,
      y: 0,
    },
    {
      x: unitSize,
      y: 0,
    },
    {
      x: 0,
      y: 0,
    },
  ];
  gameStart();
}

// Select modal elements
const modal = document.getElementById("myModal");
const closeBtn = document.getElementsByClassName("close")[0];
const submitBtn = document.getElementById("submitName");
const playerNameInput = document.getElementById("playerName");

// Function to show modal
function showModal() {
  playerNameInput.value = "";
  modal.style.display = "block";
}

// Event listener for close button click
closeBtn.addEventListener("click", () => {
  modal.style.display = "none"; // Hide modal when close button is clicked
});

function updateLeaderboard(data) {
  leaderboardTable.innerHTML = ""; // Clear previous leaderboard data
  top5Entries = data.slice(0, 5);
  top5Entries.forEach((item, index) => {
    const newRow = leaderboardTable.insertRow();
    const rankCell = newRow.insertCell(0);
    const nameCell = newRow.insertCell(1);
    const scoreCell = newRow.insertCell(2);
    rankCell.textContent = index + 1; // Rank starts from 1
    nameCell.textContent = item.name;
    scoreCell.textContent = item.score;
  });
}

// Event listener for submit button click
submitBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim(); // Get player's name from input field
  if (playerName !== "") {
    // Check if name is not empty
    // Retrieve leaderboard data from local storage
    const leaderboardData =
      JSON.parse(localStorage.getItem("leaderboard")) || [];
    // Add current player's name and score to leaderboard data
    leaderboardData.push({ name: playerName, score: score });
    // Sort leaderboard data in descending order based on score
    leaderboardData.sort((a, b) => b.score - a.score);
    // Truncate leaderboard data to top 10 scores
    const updatedLeaderboard = leaderboardData.slice(0, 10);
    // Update local storage with updated leaderboard data
    localStorage.setItem("leaderboard", JSON.stringify(updatedLeaderboard));
    // Close modal
    modal.style.display = "none";
    // Update leaderboard
    updateLeaderboard(updatedLeaderboard);
  } else {
    // Display an error message or handle empty input case
    // For simplicity, I'm alerting here
    alert("Please enter your name.");
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Retrieve leaderboard data from local storage or initialize empty array
  let leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Function to update the leaderboard table with provided data
  function updateLeaderboard(data) {
    // Clear previous leaderboard data
    leaderboardTable.innerHTML = "";
    // Display top 5 entries
    const top5Entries = data.slice(0, 5);
    top5Entries.forEach((item, index) => {
      const newRow = leaderboardTable.insertRow();
      const rankCell = newRow.insertCell(0);
      const nameCell = newRow.insertCell(1);
      const scoreCell = newRow.insertCell(2);
      rankCell.textContent = index + 1; // Rank starts from 1
      nameCell.textContent = item.name;
      scoreCell.textContent = item.score;
    });
  }

  // Function to update local storage with provided data
  function updateLocalStorage(data) {
    localStorage.setItem("leaderboard", JSON.stringify(data));
  }

  // Function to handle player submission
  function handlePlayerSubmission(playerName, score) {
    leaderboardData.push({ name: playerName, score: score });
    leaderboardData.sort((a, b) => b.score - a.score);
    updateLeaderboard(leaderboardData);
    updateLocalStorage(leaderboardData);
  }

  // Event listener for player submission
  const submitBtn = document.getElementById("submitName");
  submitBtn.addEventListener("click", () => {
    const playerNameInput = document.getElementById("playerName");
    const playerName = playerNameInput.value.trim();
    if (playerName !== "") {
      if (typeof score !== "undefined") {
        // Ensure score is defined
        handlePlayerSubmission(playerName, score); // Use score in handlePlayerSubmission
        playerNameInput.value = ""; // Clear input field after submission
      } else {
        alert("Error: Score is undefined."); // Handle error if score is undefined
      }
    } else {
      alert("Please enter your name.");
    }
  });

  // Update leaderboard with initial data on page load
  updateLeaderboard(leaderboardData);

  // Optional: Implement logic for reset button
  const resetBtn = document.querySelector("#resetBtn");
  resetBtn.addEventListener("click", resetGame);

  function resetGame() {
    // Implement game reset logic here
    // Optionally, clear local storage if needed
  }
});
