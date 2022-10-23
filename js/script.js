// Game parameters
const MAX_GUESSES = 8;

// Page elements
const message = document.querySelector("p.message");
const wordInProgress = document.querySelector("p.word-in-progress");
const remaining = document.querySelector(".remaining span");
const guessedLetters = document.querySelector("ul.guessed-letters");
const guessFormDiv = document.querySelector(".form-div");
const letterInput = document.querySelector(".letter");
const guessButton = document.querySelector("button.guess");
const playAgainButton = document.querySelector("button.play-again");

// Game data
const game = {
    secretWord: "magnolia",
    guessesRemaining: 8,
    guessedLetters: "",
    gameOver: true,
    win: false
};

// Event listeners
guessButton.addEventListener("click", function (e) {
    // Prevent page from reloading when Guess button is clicked
    // Game won't work without this!
    e.preventDefault();
    guess();
});
document.addEventListener("keypress", function (e) {
    // When game is running, Enter key acts like Guess button click
    if (e && e.key == "Enter" && !game.gameOver) {
        guess();
    }
});
playAgainButton.addEventListener("click", function () {
    startGame();
});


// Start a new game
const startGame = function () {
    console.debug("startGame");

    // initialize game data
    game.secretWord = selectAWord().toUpperCase();
    guessesRemaining(MAX_GUESSES);
    clearGuessedLetters();
    game.gameOver = false;
    game.win = false;

    // initialize the display
    letterInput.value = "";
    displayWordInProgress();
    hidePlayAgain();
   
    /* The game is driven by the Guess button hereafter */
};

// Guess button event handler
const guess = function () {
    // Get new letter from the input
    let newLetter = letterInput.value;
    //console.debug("guess:", `${newLetter}`);
    
    // validate
    if (newLetter.length === 0) {
        console.debug("guess", "no input");
        ;// ignore it - I think I'm getting extra button click events
    } else if (newLetter.length > 1) {
        console.debug("guess", "more than one character");
        message.innerText = "Please enter only one letter"; 
    } else if  (newLetter.match(/[A-Za-z]/) === null) {
        console.debug("guess", "not a letter");
        message.innerText = "That's not a letter!"; 
    } else {
        // Valid letter - uppercase it before continuing
        newLetter = newLetter.toUpperCase();

        if (game.guessedLetters.includes(newLetter)) {
            console.debug("guess", "reused letter");
            message.innerText = "You already tried that letter!";
        } else {
            // valid guess -- handle it
            console.debug("guess", "valid input");
            message.innerText = "";
            addGuessedLetter(newLetter);
            guessesRemaining(-1);
            displayWordInProgress();    
        
            if (game.gameOver) {
                endGame();
            }
        }
    }
    // clear the input
    letterInput.value = "";
};

const selectAWord = function () {
    return "secret";
    // TODO Get random word from an API
};

/* guessesRemaining()
 *  numGuesses:  if -1, decrement guesses remaining
 *               otherwise, set guesses remaining
 */
const guessesRemaining = function (numGuesses) {
    if (numGuesses === -1) {
        game.guessesRemaining--;
    } else {
        game.guessesRemaining = numGuesses;
    }
    // update display
    remaining.innerText = `${game.guessesRemaining} guesses `;

    // if no guesses remain, the game is over
    if (game.guessesRemaining === 0) {
        game.gameOver = true;
    }
};

// Clear guessed letters in game object and display
const clearGuessedLetters = function () {
    game.guessedLetters = "";
    guessedLetters.innerHTML = "";
};

  // Add guessed letter to game object and display
const addGuessedLetter = function (letter) {
    const li = document.createElement("li");
    li.innerText = letter;
    guessedLetters.append(li);

    game.guessedLetters += letter;
};

// Update word-in-progress display and test for win
const displayWordInProgress = function () {
    console.debug("displayWordInProgress");
    const UNGUESSED = "●";
    const letters = game.secretWord.split("");
    //console.debug("updateWIP", letters);
    
    // Create display concealing unguessed letters
    let displayWord = letters.map(function (letter) {
        return (game.guessedLetters.includes(letter)) ? letter : UNGUESSED;
    });
    displayWord = displayWord.join("");

    // update the display
    wordInProgress.innerText = displayWord;
    
    // if all letters have been guessed, the player wins and the game is over
    if (displayWord === game.secretWord) {
        game.win = true;
        game.gameOver = true;
    }
};

// Make Enter key act like Guess button clicked
const handleKeyPress = function (e) {
    if (e && e.key == "Enter") {
        guess();
    }
};

// Show Play Again button and hide guess form
const showPlayAgain = function () {
    console.debug("showPlayAgain");
    if (!guessFormDiv.classList.contains("hide")) {
        guessFormDiv.classList.add("hide");
    }
    playAgainButton.classList.remove("hide");
};

// Hide Play Again button and show guess form
const hidePlayAgain = function () {
    console.debug("hidePlayAgain");
    guessFormDiv.classList.remove("hide");
    if (!playAgainButton.classList.contains("hide")) {
        playAgainButton.classList.add("hide");
    };
};

// Handle end-of-game
const endGame = function () {
    console.debug("endGame");

    if (game.win) {
        message.innerText = "You win! Good job!";
    } else {
        message.innerText = `You ran out of guesses. The word is "${game.secretWord}".`;
    }

    showPlayAgain();
};


startGame();
