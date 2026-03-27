const cards = $(".card");
const status = $("#status");
const moveCount = $("#moveCount");
const timer = $("#timer");
const winMessage = $("#winMessage");
const restartBtn = $("#restartGame");

let firstCard = null;
let secondCard = null;
let moves = 0;
let matches = 0;
let lockBoard = false;

let seconds = 0;
let timerInterval;
let timerStarted = false;

function shuffleCards() {
    // Randomly rearranges all cards inside the game board each time the game starts
    $("#gameBoard").append(cards.sort(function() {
        return Math.random() - 0.5;
    }));
}

shuffleCards();

cards.on("click", function () {
    if (lockBoard) return;
    // Prevent selecting the same card twice 
    if ($(this)[0] === firstCard?.[0]) return; 

    if (!timerStarted) {
        timerStarted = true;

        timerInterval = setInterval(function() {
            seconds++;
            timer.text(seconds);
        }, 1000);
    }

    $(this).text($(this).data("card"));
    $(this).addClass("flipped");
    
    if (!firstCard) {
        firstCard = $(this);
        return;
    }
    secondCard = $(this);
    moves++;
    moveCount.text(moves);

    if (firstCard.data("card") === secondCard.data("card")) {
        matches++;

        status.text("Match found!");

        firstCard.off("click");
        secondCard.off("click");

        if (matches === 6) {
            winMessage.text("You Win!");
            status.text("All pairs matched!");
            clearInterval(timerInterval);
        }

        firstCard = null;
        secondCard = null;
    } else {
        status.text("Try again!");
        lockBoard = true;
        setTimeout(function() {
            firstCard.text("");
            secondCard.text("");

            firstCard.removeClass("flipped");
            secondCard.removeClass("flipped");

            firstCard = null;
            secondCard = null;

            lockBoard = false;
        }, 1000);
    }
});

restartBtn.on("click", function() {
    clearInterval(timerInterval);
    location.reload();
});