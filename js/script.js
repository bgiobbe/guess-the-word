// Page elements
const guessedLetters = document.querySelector("ul.guessed-letters");
const guessButton = document.querySelector("button.guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector("p.word-in-progress");
const remaining = document.querySelector(".remaining");
const remainingSpan = document.querySelector(".remaining span");
const message = document.querySelector("p.message");
const playAgainButton = document.querySelector("button.play-again");

// Global data
let word = "magnolia";

const updateWordInProgress = function (word) {
    const display = [];
    for (let letter of word) {
        display.push("●");
    }
    wordInProgress.innerText = display.join("");
};

updateWordInProgress(word);

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    const input = letterInput.value;
    console.log(input);
    letterInput.value = "";
});


