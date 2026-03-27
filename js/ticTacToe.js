const cells = $(".cell");
const status = $("#status");
const restartBtn = $("#restartBtn");

let currentPlayer = "X";
let gameActive = true;

const winningCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const xWins = $("#xWins");
const oWins = $("#oWins");

let xScore = 0;
let oScore = 0;

cells.on("click", function() {
    if ($(this).text() === "" && gameActive) {
        $(this).text(currentPlayer);

        // check winner here
        let winner = checkWinner();
        if (winner) {
            status.text(`Player ${winner.winner} Wins!`)

            // Highlight winning cells by adding the "winner" class
            for (let index of winner.combo) {
                cells.eq(index).addClass("winner");
            }

            if (winner.winner === "X") {
                xScore++;
                xWins.text(xScore);
            } else {
                oScore++;
                oWins.text(oScore);
            }

            gameActive = false;
            return;
        }

        if (checkDraw()) {
            status.text("Draw!");
            gameActive = false;
            return;
        }

        // switch player
        if (currentPlayer === "X") {
            currentPlayer = "O";
        } else {
            currentPlayer = "X";
        }

        status.text(`Player ${currentPlayer}'s Turn`);
    }
});

function checkWinner() {
    let XOarray = [];

    // Collect board values into array
    cells.each(function() {
        XOarray.push($(this).text());
    })

    // Loop through each winning combination
    for (let combo of winningCombos) {
        let firstValue = XOarray[combo[0]];
        let secondValue = XOarray[combo[1]];
        let thirdValue = XOarray[combo[2]];

        // Check if all three match and are not empty
        if (
            firstValue !== "" &&
            firstValue === secondValue &&
            secondValue === thirdValue
        ) {
            return {
                winner: firstValue, // returns "X" or "O"
                combo: combo // returns winning combo
            };
        }
    }

    return null; // no winner yet
}

function checkDraw() {
    let XOarray = [];
    cells.each(function() {
        XOarray.push($(this).text());
    })
    return !XOarray.includes("");
}

restartBtn.on("click", function() {
    cells.text("");
    cells.removeClass("winner");
    currentPlayer = "X";
    gameActive = true;
    status.text("Player X's Turn");
})