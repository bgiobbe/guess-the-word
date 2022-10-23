// Page elements
const guessedList = document.querySelector("ul.guessed-letters");
const guessButton = document.querySelector("button.guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector("p.word-in-progress");
const remaining = document.querySelector(".remaining");
const remainingSpan = document.querySelector(".remaining span");
const message = document.querySelector("p.message");
const playAgainButton = document.querySelector("button.play-again");

// Global data
let word = "magnolia";
let guessedLetters = [];

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

    message.innerText = "";
    const letter = validateInput(input);
    console.log(letter);
    if (letter) {
        makeGuess(letter);
    }
});

const validateInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;

    if (input.length === 0) {
        message.innerText = "Please enter a letter";
    }
    else if (input.length > 1) {
        message.innerText = "Please enter only one letter at a time.";
    }
    else if (input.match(acceptedLetter) === null) {
        message.innerText = "Please enter a letter from A-Z.";
    }
    else {
        return input;
    }
};

const makeGuess = function (letter) {
    letter = letter.toUpperCase();
    if (guessedLetters.includes(letter)) {
        message.innerText = "You already guessed that letter. Try again.";
    }
    else {
        guessedLetters.push(letter);
    }
    console.log(guessedLetters);

};

