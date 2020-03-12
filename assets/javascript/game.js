// Start button calls mainObject.start()

var mainObject = {
  DOMElements: {
    game: document.getElementById("game"),
    wordHeader: document.getElementById("wordHeader"),
    theWord: document.getElementById("theWord"),
    revealed: document.getElementById("revealed"),
    points: document.getElementById("points"),
    yourGuesses: document.getElementById("yourGuesses"),
    clues: document.getElementById("clues"),
    smallClueButton: document.getElementById("clue1"),
    bigClueButton: document.getElementById("clue2"),
    wins: document.getElementById("wins"),
    losses: document.getElementById("losses")
  },
  currentWord: {},
  guesses: { correct: [], incorrect: [] },
  points,
  wins: 0,
  losses: 0,
  losePoints(amount) {
    // one place to subtract points
    this.points = this.points - amount;
    if (this.points < 1) {
      this.lose();
    }
    // disable clue buttons if not enough points
    if (this.points < 3) {
      this.DOMElements.smallClueButton.disabled = true;
    }
    if (this.points < 6) {
      this.DOMElements.bigClueButton.disabled = true;
    }
  },
  checkGuess(key) {
    // Only check if entered key is a 1 letter
    if (key.match(/[a-z]/i) && key.length === 1) {
      if (
        // return if letter has already been guessed
        this.guesses.correct.includes(key) ||
        this.guesses.incorrect.includes(key)
      ) {
        return;
      } else if (this.currentWord.word.includes(key)) {
        // add to correct or incorrect array
        this.guesses.correct.push(key);
      } else {
        this.guesses.incorrect.push(key);
        this.losePoints(1);
      }
    }
  },
  showClue(t) {
    // invoked by button click
    // t = 's' for small clue, t = 'b' for big clue
    let clues;
    if (t === "s") {
      clues = this.currentWord.smallClues;
      // Hide button after use
      this.DOMElements.smallClueButton.disabled = true;
      this.losePoints(2);
    } else {
      clues = this.currentWord.bigClues;
      this.DOMElements.bigClueButton.disabled = true;
      this.losePoints(5);
    }
    // show progress to refresh points
    this.showProgress();
    // pick and display random clue
    let i = Math.floor(Math.random() * clues.length);
    this.DOMElements.clues.textContent += clues[i];
  },
  get currentProgress() {
    // returns an array of correctly guessed answers, "_" for unguessed letters,
    // and any symbols / spaces.
    let ret = [];
    for (let i = 0; i < this.currentWord.word.length; i++) {
      const e = this.currentWord.word[i];
      if (this.guesses.correct.includes(e)) {
        ret.push(e);
      } else if (e.match(/[a-z]/i)) {
        ret.push("_");
      } else {
        ret.push(e);
      }
    }
    return ret;
  },
  showProgress() {
    this.DOMElements.theWord.textContent = "";
    this.currentProgress.forEach(e => {
      this.DOMElements.theWord.textContent += " " + e;
    });
    // User wins if there are no unguessed letters
    if (!this.currentProgress.includes("_")) {
      this.win();
      return;
    }
    // displays points/incorrect letters
    this.DOMElements.points.textContent = this.points;
    this.DOMElements.yourGuesses.innerText = this.guesses.incorrect.toString();
  },
  win() {
    // increment wins, wait for user to click enter or start to replay
    this.wins++;
    this.DOMElements.wins.textContent = "Wins: " + this.wins;
    document.onkeyup = e => {
      if (e.key === "Enter") {
        this.start();
      }
    };
  },
  lose() {
    // increment losses, reveal answer, wait to restart game
    this.losses++;
    this.DOMElements.losses.textContent = "Losses: " + this.losses;
    this.DOMElements.revealed.textContent = this.currentWord.word;
    document.onkeyup = e => {
      if (e.key === "Enter") {
        this.start();
      }
    };
  },
  reset() {
    this.DOMElements.game.style = "display: flex";
    this.DOMElements.clues.textContent = "Clues: ";
    this.DOMElements.revealed.textContent = "";
    this.points = 8;
    this.guesses = { correct: [], incorrect: [] };
    this.DOMElements.bigClueButton.disabled = false;
    this.DOMElements.smallClueButton.disabled = false;
  },
  start() {
    this.reset();
    // pick random word
    let i = Math.floor(Math.random() * allData.length);
    this.currentWord = allData[i];
    // display word type
    this.DOMElements.wordHeader.textContent =
      "Current Word: " + (i > 194 ? "Spell" : "Character");
    this.currentWord.word = this.currentWord.word.toUpperCase();
    // remove bad clues
    this.currentWord.bigClues = this.currentWord.bigClues.filter(
      e => !e.includes("undefined")
    );
    // hide button if no clues
    if (this.currentWord.bigClues.length === 0) {
      this.DOMElements.bigClueButton.disabled = true;
    }
    // run game
    this.showProgress();
    document.onkeyup = event => {
      this.checkGuess(event.key.toUpperCase());
      this.showProgress();
    };
  }
};
