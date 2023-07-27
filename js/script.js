// Game setings
const MAX_GUESSES = 8;

// Page elements
const message = document.querySelector("p.message");
const wordInProgress = document.querySelector("p.word-in-progress");
const gamePlayDiv = document.querySelector("#playing");
const remainingP = document.querySelector(".remaining");
const remainingSpan = document.querySelector(".remaining span");
const guessedLetters = document.querySelector("ul.guessed-letters");
const letterInput = document.querySelector(".letter");
const guessButton = document.querySelector("button.guess");
const playAgainButton = document.querySelector("button.play-again");

// Game data
const game = {
    wordList: getWords(),
    word: null,
    guessesRemaining: null,
    guessedLetters: null
};

// Fetch a list of words from a file
async function getWords() {
    const response = await fetch(
        "https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt"
    );
    const content = await response.text();
    game.wordList = content.split("\n");
    console.log(`Loaded ${game.wordList.length} words`);

    // don't start game until word list has been received
    startGame();
}

// Guess button click
guessButton.addEventListener("click", function (e) {
    // Prevent page from reloading when Guess button is clicked
    // Game won't work without this!
    e.preventDefault();

    const guess = validatedInput();
    if (guess) {
        makeGuess(guess);
    }
});

/*
 * Get a letter from input, validate it, return it as uppercase.
 * If input is invalid, set message appropriately.
 * Clear the letter input.
 */
function validatedInput() {
    const oneLetter = /[a-zA-Z]/;

    const input = letterInput.value;
    letterInput.value = "";

    if (input.length === 0) {
        message.innerText = "Please enter a letter";
    }
    else if (input.length > 1) {
        message.innerText = "Please enter only one letter at a time.";
    }
    else if (input.match(oneLetter) === null) {
        message.innerText = "Please enter a letter from A-Z.";
    }
    else {
        return input.toUpperCase();
    }
}

// Test a single letter
function makeGuess(letter) {
    if (game.guessedLetters.includes(letter)) {
        message.innerText = "You already tried that letter!";
    } else {
        // valid guess
        addGuessedLetter(letter);

        if (game.word.includes(letter)) {
            message.innerText = `Good guess! The word has the letter ${letter}.`;
        } else {
            message.innerText = `The word does not have the letter ${letter}.`;
            guessesRemaining(-1);
        }
        
        updateWordInProgress();
    }
    clearLetterInput()
}

// Add guessed letter to game object and display
function addGuessedLetter(letter) {
    game.guessedLetters += letter;

    const li = document.createElement("li");
    li.innerText = letter;
    guessedLetters.append(li);
}

/* guessesRemaining()
    *  numGuesses:  if -1, decrement guesses remaining
    *               otherwise, set guesses remaining
    */
function guessesRemaining(numGuesses) {
    if (numGuesses === -1) {
        game.guessesRemaining--;
    } else {
        game.guessesRemaining = numGuesses;
    }

    // update display and check for game over
    if (game.guessesRemaining === 0) {
        message.innerText = `Game over -- the word was "${game.word}".`;
        gameOver();
    } else if (game.guessesRemaining === 1) {
        remainingSpan.innerText = "1 wrong guess";
    } else {
        remainingSpan.innerText = `${game.guessesRemaining} wrong guesses`;
    }
}

// Update word-in-progress display and test for win
function updateWordInProgress() {
    const UNGUESSED = "●";
    const word = game.word.split("");

    // Create display concealing unguessed letters
    let displayWord = word.map(function (letter) {
        return (game.guessedLetters.includes(letter)) ? letter : UNGUESSED;
    });
    displayWord = displayWord.join("");

    // update the display
    wordInProgress.innerText = displayWord;

    checkForWin(displayWord);
}

// If all letters have been guessed, the player wins and the game is over
function checkForWin(guessedWord) {
    if (guessedWord === game.word) {
        message.classList.add("win");
        message.innerHTML = '<p class="highlight">You guessed the correct word!</p>';
        gameOver();
    }
}

// Hide game play elements and show Play Again button
function gameOver() {
    // hide game elements
    gamePlayDiv.classList.add("hide");

    // show Play Again button
    playAgainButton.classList.remove("hide");
}

// Play Again button click
playAgainButton.addEventListener("click", function () {
    startGame();
});

// Start a new game
function startGame() {
    // initialize game data and display
    selectWord();
    clearLetterInput();
    guessesRemaining(MAX_GUESSES);
    clearGuessedLetters();
    updateWordInProgress();
    
    showGame();
    /* The game is driven by the Guess button hereafter */
}

// Select a random word, then remove it from the word list.
function selectWord() {
    const index = Math.floor(Math.random() * game.wordList.length);
    game.word = game.wordList[index].trim().toUpperCase();
    game.wordList.splice(index, 1);
}

// Clear guessed letters in game object and display
function clearGuessedLetters() {
    game.guessedLetters = "";
    guessedLetters.innerHTML = "";
}

// Clear the letter input
function clearLetterInput() {
    letterInput.value = "";
}

// Hide the Play Again button, clear message, and show game controls
function showGame() {
    if (!playAgainButton.classList.contains("hide")) {
        playAgainButton.classList.add("hide");
    }
    message.innerHTML = ""
    if (message.classList.contains('win')) {
        message.classList.remove('win');
    }
    gamePlayDiv.classList.remove("hide");
}
