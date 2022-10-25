// Page elements
const guessedList = document.querySelector("ul.guessed-letters");
const guessButton = document.querySelector("button.guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector("p.word-in-progress");
const remaining = document.querySelector(".remaining");
const remainingSpan = document.querySelector(".remaining span");
const message = document.querySelector("p.message");
const playAgainButton = document.querySelector("button.play-again");

// Settings
const MAX_GUESSES = 8;

// Global data
let word = "magnolia";
let guessedLetters = [];
let remainingGuesses = MAX_GUESSES;

const getWord = async function () {
    const response = await fetch(
        "https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt"
    );
    const content = await response.text();
    const wordArray = content.split("\n");
    const index = Math.floor(Math.random() * wordArray.length);
    word = wordArray[index].trim();
    placeholder(word);
};

// Get a random word to guess
getWord();

const placeholder = function (word) {
    const display = [];
    for (let _ of word) {
        display.push("●");
    }
    wordInProgress.innerText = display.join("");
};

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    const guess = letterInput.value;
    console.log(guess);
    letterInput.value = "";

    message.innerText = "";
    const validGuess = validateInput(guess);
    console.log(validGuess);
    if (validGuess) {
        makeGuess(guess);
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
    // Uppercase the guess to simplify comparisons
    letter = letter.toUpperCase();
    if (guessedLetters.includes(letter)) {
        message.innerText = "You already guessed that letter. Try again.";
    }
    else {
        guessedLetters.push(letter);
        showGuessedLetters();
        handleGuess(letter);
        updateWordInProgress(guessedLetters);
    }
    //console.log(guessedLetters);
};

const showGuessedLetters = function () {
    guessedList.innerHTML = "";
    for (let letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedList.append(li);
    }
};

const updateWordInProgress = function (usedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    //console.log(wordArray);

    const display = [];
    for (let letter of wordArray) {
        if (usedLetters.includes(letter)) {
            display.push(letter);
        } else {
            display.push("●");
        }
    }
    const newWIP = display.join("");
    wordInProgress.innerText = newWIP;
    checkIfWon(wordUpper, newWIP);
};

const handleGuess = function (guess) {
    const wordUpper = word.toUpperCase();
    if (wordUpper.includes(guess)) {
        message.innerText = `Good guess! The word has the letter ${guess}.`;
    } else {
        message.innerText = `The word does not have the letter ${guess}.`;
        remainingGuesses--;
    }
    // update remaining guesses on screen
    if (remainingGuesses === 0) {
        message.innerText = `Game over -- the word was "${word}".`;
    } else if (remainingGuesses === 1) {
        remainingSpan.innerText = "1 guess";
    } else {
        remainingSpan.innerText = `${remainingGuesses} guesses`;
    }
};

const checkIfWon = function (secretWord, guessedWord) {
    if (secretWord === guessedWord) {
        message.classList.add("win");
        message.innerHTML = '<p class="highlight">You guessed the correct word! Congrats!</p>';
    }
};
