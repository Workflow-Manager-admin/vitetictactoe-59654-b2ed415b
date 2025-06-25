import './style.css';

const COLORS = {
  primary: '#1976d2',
  secondary: '#424242',
  accent: '#e53935',
};

const PLAYER_X = 'X';
const PLAYER_O = 'O';

function createInitialBoard() {
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(''));
}

function checkWinner(board) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] &&
      board[i][0] === board[i][1] &&
      board[i][1] === board[i][2]
    ) {
      return board[i][0];
    }
    if (
      board[0][i] &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      return board[0][i];
    }
  }
  if (
    board[0][0] &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }
  if (
    board[0][2] &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }
  return null;
}

function isBoardFull(board) {
  return board.flat().every(cell => cell);
}

function getStatusText(winner, board, currentPlayer) {
  if (winner) {
    return `Winner: ${winner}`;
  } else if (isBoardFull(board)) {
    return "It's a tie!";
  } else {
    return `Turn: ${currentPlayer}`;
  }
}

function getNewScore(score, winner) {
  if (winner === PLAYER_X) return { ...score, X: score.X + 1 };
  if (winner === PLAYER_O) return { ...score, O: score.O + 1 };
  return score;
}

// PUBLIC_INTERFACE
function renderApp() {
  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="ttt-root">
      <div class="ttt-score-panel" id="score-panel">
        <span class="ttt-score-x">X: <span id="score-x">0</span></span>
        <span class="ttt-score-o">O: <span id="score-o">0</span></span>
      </div>
      <div class="ttt-status" id="game-status"></div>
      <div class="ttt-board" id="board"></div>
      <div class="ttt-controls">
        <button class="ttt-btn" id="reset-btn" aria-label="Reset game">Reset Game</button>
      </div>
    </div>
  `;
}

function updateScorePanel(score) {
  document.getElementById('score-x').textContent = score.X;
  document.getElementById('score-o').textContent = score.O;
}

function updateBoard(board, onCellClick, winner, isDisabled) {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  boardDiv.style.pointerEvents = isDisabled ? 'none' : 'auto';

  for (let row = 0; row < 3; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'ttt-row';
    for (let col = 0; col < 3; col++) {
      const cellBtn = document.createElement('button');
      cellBtn.className = 'ttt-cell';
      cellBtn.textContent = board[row][col];
      cellBtn.setAttribute('aria-label', `row ${row + 1}, col ${col + 1}`);
      cellBtn.disabled = !!board[row][col] || winner;
      cellBtn.style.transition = 'background 0.2s';

      if (!cellBtn.disabled) {
        cellBtn.onclick = () => onCellClick(row, col);
      }
      rowDiv.appendChild(cellBtn);
    }
    boardDiv.appendChild(rowDiv);
  }
}

function updateStatus(status) {
  document.getElementById('game-status').textContent = status;
}

// PUBLIC_INTERFACE
function startTicTacToeGame() {
  let board = createInitialBoard();
  let currentPlayer = PLAYER_X;
  let winner = null;
  let score = { X: 0, O: 0 };

  renderApp();
  updateScorePanel(score);
  updateBoard(board, onCellClick, winner, false);
  updateStatus(getStatusText(winner, board, currentPlayer));

  function onCellClick(row, col) {
    if (board[row][col] || winner) return;
    board[row][col] = currentPlayer;
    winner = checkWinner(board);
    if (winner || isBoardFull(board)) {
      score = getNewScore(score, winner);
      updateScorePanel(score);
      updateStatus(getStatusText(winner, board, currentPlayer));
      updateBoard(board, onCellClick, winner, true);
      return;
    }
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    updateStatus(getStatusText(winner, board, currentPlayer));
    updateBoard(board, onCellClick, winner, false);
  }

  document.getElementById('reset-btn').onclick = () => {
    board = createInitialBoard();
    winner = null;
    currentPlayer =
      (score.X + score.O) % 2 === 0 ? PLAYER_X : PLAYER_O; // Alternate starter
    updateStatus(getStatusText(winner, board, currentPlayer));
    updateBoard(board, onCellClick, winner, false);
  };
}

startTicTacToeGame();
