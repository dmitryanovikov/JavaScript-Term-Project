const canvas = document.getElementById("boardCanvas");
const ctx = canvas.getContext("2d");

const turnText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const redWinsEl = document.getElementById("redWins");
const blackWinsEl = document.getElementById("blackWins");

let redWins = 0;
let blackWins = 0;

const tileSize = 50;

function drawBoard() {
    for (let row = 0; row < 8; row++) {
        for (let col=0; col<8; col++) {
            if ((row + col) % 2 ===0) {
                ctx.fillStyle = "#f0d9b5"; // light
            }
            else {
                ctx.fillStyle = "#b58863"; // dark
            }
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
    }
}

let board = [
  ["", "b", "", "b", "", "b", "", "b"],
  ["b", "", "b", "", "b", "", "b", ""],
  ["", "b", "", "b", "", "b", "", "b"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["r", "", "r", "", "r", "", "r", ""],
  ["", "r", "", "r", "", "r", "", "r"],
  ["r", "", "r", "", "r", "", "r", ""]
];

function clearBoard() {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            board[r][c] = "";
        }
    }
    drawGame();
}

function testWin(player) {
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c].toLowerCase() !== player) {
                board[r][c] = "";
            }
        }
    }

    drawGame();
    turnText.textContent = checkWin();
}

function drawPieces() {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = board[row][col];
            if (piece !== "") {
                ctx.beginPath();
                ctx.arc(col * tileSize + 25, row * tileSize + 25, 20, 0, Math.PI * 2); 
                ctx.fillStyle = piece.toLowerCase() === "r" ? "red" : "black";
                ctx.fill();

                // draw crown
                if (piece === "R" || piece === "B") {
                    ctx.beginPath();
                    ctx.arc(col * tileSize + 25, row * tileSize + 25, 10, 0, Math.PI * 2);
                    ctx.fillStyle = "gold";
                    ctx.fill();
                }
            }
        }
    }
}

let selected = null;
let currentPlayer = "r"; // red starts

function isPlayersPiece(piece, player) {
    return piece.toLowerCase() === player;
}

function isValidMove(fr, fc, tr, tc) {
    const piece = board[fr][fc];
    const target = board[tr][tc];

    if (target !== "") return false; // cannot land on occipied square

    let dr = tr - fr;
    let dc = tc - fc;

    // move diagonally
    if (Math.abs(dc) !== Math.abs(dr)) return false;

    // normal move (1 step)
    if (Math.abs(dr) === 1) {
        if (piece === "r" && dr === -1) return true;
        if (piece === "b" && dr === 1) return true;

        // kings can move both directions
        if (piece === "R" || piece === "B") return true;
    }

    // capture move (2 steps)
    if (Math.abs(dr) === 2) {
        let midRow = (fr + tr) / 2;
        let midCol = (fc + tc) / 2;

        let middlePiece = board[midRow][midCol];
        if (middlePiece === "") return false;

        const pieceType = piece.toLowerCase();
        const enemyType = middlePiece.toLowerCase();

        if (pieceType === "r" && enemyType === "b") return true;
        if (pieceType === "b" && enemyType === "r") return true;
    }

    return false;
}

function checkWin() {
    let redCount = 0;
    let blackCount = 0;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            let piece = board[row][col];

            if (piece && piece.toLowerCase() === "r") redCount++;
            if (piece && piece.toLowerCase() === "b") blackCount++;
        }
    }

    if (redCount === 0) return "Black wins!";
    if (blackCount === 0) return "Red wins!";

    return null;
}

function resetGame() {
    board = [
        ["", "b", "", "b", "", "b", "", "b"],
        ["b", "", "b", "", "b", "", "b", ""],
        ["", "b", "", "b", "", "b", "", "b"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["r", "", "r", "", "r", "", "r", ""],
        ["", "r", "", "r", "", "r", "", "r"],
        ["r", "", "r", "", "r", "", "r", ""]
    ];

    selected = null;
    currentPlayer = "r";

    turnText.textContent = "Red Player's Turn";
    canvas.style.pointerEvents = "auto";

    drawGame();
}

restartBtn.addEventListener("click", resetGame);

canvas.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);

    let clickedPiece = board[row][col];

    // If nothing selected yet → select a piece
    if (!selected) {
        if (isPlayersPiece(clickedPiece, currentPlayer)) {
            selected = { row, col };
            console.log("Selected", selected);
        }
        return; // stops the code from continuing into move logic on the same click
    }
    // If already selected → move piece
    else {
        const fr = selected.row;
        const fc = selected.col;

        if (isValidMove(fr, fc, row, col)) {
            board[row][col] = board[fr][fc];
            board[fr][fc] = "";

            // if it is a capture move, remove middle piece
            if (Math.abs(row - fr) === 2) {
                let midRow = (fr + row) / 2;
                let midCol = (fc + col) / 2;

                board[midRow][midCol] = "";
            }

            // promotion
            if (row === 0 && board[row][col] === "r") {
                board[row][col] = "R";
            }

            if (row === 7 && board[row][col] === "b") {
                board[row][col] = "B";
            }

            // win check
            const result = checkWin();

            if (result) {
                turnText.textContent = result;
                canvas.style.pointerEvents = "none";

                if (result === "Red wins!") {
                    redWins++;
                    redWinsEl.textContent = redWins;
                }

                if (result === "Black wins!") {
                    blackWins++;
                    blackWinsEl.textContent = blackWins;
                }

                drawGame();
                return;
            }

            // switch turns
            currentPlayer = currentPlayer === "r" ? "b" : "r";
            turnText.textContent = 
                currentPlayer === "r" ? "Red Player's Turn" : "Black Player's Turn";
            console.log("Current player:", currentPlayer);
        } else {
            console.log("INVALID MOVE");
        }

        selected = null;
        drawGame();
    }

    console.log("Clicked", row, col);
});

function drawGame() {
    drawBoard();
    drawPieces();
}

drawGame();