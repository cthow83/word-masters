import { isLetter, setLoading, addLetterToGuess, submitGuess, backspace } from "./helpers.js";

const ANSWER_LENGTH = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");

async function init() {
  let currentRow = 0;
  let currentGuess = "";
  let done = false;

  const res = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
  const { word } = await res.json();
  
  setLoading(false, loadingDiv);
  
  document.addEventListener("keydown", async function handleKeyPress(event) {
    console.log(done)
    if (done) return;

    const action = event.key;

    if (action === "Enter") {
      ({currentRow, currentGuess, done} = await submitGuess(word, currentRow, currentGuess, ANSWER_LENGTH, loadingDiv, ROUNDS, letters, done))
    } else if (action === "Backspace") {
      currentGuess = backspace(currentRow, currentGuess, letters, ANSWER_LENGTH);
    } else if (isLetter(action)) {
      currentGuess = addLetterToGuess(action.toUpperCase(), currentRow, currentGuess, letters, ANSWER_LENGTH, ROUNDS, done);
    } else {
      // do nothing
    }
  });
}



init();
