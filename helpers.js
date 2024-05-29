export const isLetter = (letter) => /^[a-zA-Z]$/.test(letter);

export const setLoading = (isLoading, loadingDiv) => {
    loadingDiv.classList.toggle("hidden", !isLoading)
}

export const addLetterToGuess = (letter, currentRow, currentGuess, letters, ANSWER_LENGTH) => {
    currentGuess.length < ANSWER_LENGTH ? currentGuess += letter : currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;

    letters[currentRow * ANSWER_LENGTH + currentGuess.length - 1].innerText =
      letter;
    return currentGuess
  }

export const submitGuess = async(word, currentRow, currentGuess, ANSWER_LENGTH, loadingDiv, ROUNDS, letters, done) => {
    if (currentGuess.length !== ANSWER_LENGTH) return;
    const wordParts = word.toUpperCase().split("");

    setLoading(true, loadingDiv);

    const res = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });

    const { validWord } = await res.json();
    setLoading(false, loadingDiv);

    if (!validWord) {
      markInvalidWord(currentRow, ANSWER_LENGTH, letters);
      return;
    }

    const guessParts = currentGuess.split("");
    const map = mapFrequencyOfLettersInSolution(wordParts);
    let allRight = true;

    markCorrectLetters(guessParts, letters, wordParts, ANSWER_LENGTH, map, currentRow)

    allRight = markCloseLetters(guessParts, letters, wordParts, ANSWER_LENGTH, map, currentRow, allRight)

    ++currentRow;
    currentGuess = "";
    done = isWin(allRight, currentRow, ROUNDS)
    return {currentRow, currentGuess, done}
  }

export const backspace = (currentRow, currentGuess, letters, ANSWER_LENGTH) => {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * ANSWER_LENGTH + currentGuess.length].innerText = "";
    return currentGuess
  }

const markInvalidWord = (currentRow, ANSWER_LENGTH, letters) => {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      letters[currentRow * ANSWER_LENGTH + i].classList.remove("invalid");
      setTimeout(
        () => letters[currentRow * ANSWER_LENGTH + i].classList.add("invalid"),
        10
      );
    }

  }

const markCorrectLetters = (guessParts, letters, wordParts, ANSWER_LENGTH, map, currentRow) => {
    guessParts.map((value, index) => {
        if (value === wordParts[index]) {
          letters[currentRow * ANSWER_LENGTH + index].classList.add("correct");
          map[value]--;
        }
  
      })
}

const markCloseLetters = (guessParts, letters, wordParts, ANSWER_LENGTH, map, currentRow, allRight) => {
    guessParts.map((value, index) => {
        if (value === wordParts[index]) return
        if (map[value] && map[value] > 0) {
          allRight = false;
          letters[currentRow * ANSWER_LENGTH + index].classList.add("close");
          map[value]--;
        } else {
          allRight = false;
          letters[currentRow * ANSWER_LENGTH + index].classList.add("wrong");
        }
      })
      return allRight
}

const isWin = (allRight, currentRow, ROUNDS) => {
    if (allRight) {
        alert("You Win!")
        return true
    }
    if (currentRow === ROUNDS) alert(`You Lose! The word was ${word}`)
    return false
}

const mapFrequencyOfLettersInSolution = (array) => {
    const mappedArray = array.reduce((obj, item) => {
      obj[item] = (obj[item] || 0) + 1;
      return obj;
    }, {});
    return mappedArray
  }