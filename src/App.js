import React, { useState, useEffect } from 'react'
import './Hangman.css';
import Home from './Home'
import MPHands from './components/MPHands'
// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  // eslint-disable-next-line no-use-before-define
  const [guessWord, setGuessWord] = useState('');
  const [wordBoard, setWordBoard] = useState([]);
  const [chancesLeft, setChancesLeft] = useState(8);
  // const [inputLetter, setInputLetter] = useState('');
  const [restart, setRestart] = useState(false);
  const [outputLetter, setOutputLetter] = React.useState('');

  // Initialize the board
  const board = (guessWord) => {
    const numOfLetter = guessWord.length;
    const newBoard = new Array(numOfLetter).fill('_');
    return newBoard;
  }

  // Helper function to get a new game word randomly from a word list
  useEffect(() => {
    async function fetchWord() {
      const response = await fetch('/words.txt');
      const text = await response.text();
      const words = text.split(/\s+/);
      const randomIndex = Math.floor(Math.random() * words.length);
      const randomWord = words[randomIndex];
      setGuessWord(randomWord);
    }
    fetchWord();
  }, [restart]);

  useEffect(() => {
    if (guessWord) {
      setWordBoard(board(guessWord));
    }
  }, [guessWord])

 // Handle input letter and update word board and chances left accordingly
 function handleOutputLetter() {
  if (isGameOver()) {
    return;
  }
   
  if (outputLetter.length > 1 || outputLetter.length === 0) {
    // setChancesLeft(chancesLeft - 1);
    // setInputLetter('');
    return;
  }
  const lowercaseL = outputLetter.toLowerCase();
  if (wordBoard.includes(lowercaseL)) {
    setOutputLetter('');
    return;
  }
  let count = 0;
  const newBoard = [...wordBoard];
  for (let i = 0; i < guessWord.length; i++) {
    if (guessWord[i] === lowercaseL) {
      newBoard[i] = lowercaseL;
      count += 1;
    }
  }
  if (count === 0) {
    setChancesLeft(chancesLeft - 1);
  }
  setWordBoard(newBoard);
   setOutputLetter('');
}
  

// Check if game is over
function isGameOver() {
  if (chancesLeft === 0) {
    return true;
  }
  for (const letter of wordBoard) {
    if (letter === '_') {
      return false;
    }
  }
  return true;
}

// Check if player wins
function getWinOrNot() {
  for (const letter of wordBoard) {
    if (letter === '_') {
      return false;
    }
  }
  return true;
}

function handleLetterOutput(letter) {
  setOutputLetter(letter);
}
const [isStart, setIsStart] = useState(false);
const startCamera = () => {
    // console.log("enle!")
    setIsStart(true)
  };
  return (
    <div className="Hangman">
      <div className="Hangman-image">
        {isGameOver() && getWinOrNot() ? <img src="/9.jpeg" class="my-image" alt="hangman" /> : <img src={`/${chancesLeft}.jpeg`} class="my-image" alt="hangman" />}
      </div>
      <div className="Hangman-word">
        <div>
          {/* <Home /> */}
         
        </div>
        <div className="Hangman-wordBoard">
          {wordBoard.map((letter, index) => (
            <span key={index} className="Hangman-letter">{letter} </span>
          ))}
        </div>
        <div>Hint: {guessWord}, just for testing</div>
        <div className="Hangman-chancesLeft">Chances left: {chancesLeft}</div>
        <button onClick={startCamera}>Start camera</button>
        <div className="Hangman-input">
        {isStart? 
      (<MPHands onLetterOutput={handleLetterOutput} />):
      <div></div>
      }
          {/* <MPHands onLetterOutput={handleLetterOutput} /> */}
          {outputLetter ? handleOutputLetter(): null}
            {/* <input type="text" maxLength="1" value={inputLetter} onChange={(event) => setInputLetter(event.target.value)} />
            <button onClick={handleInputLetter}>Submit</button> */}
        </div>
        {isGameOver() &&
          <div className="Hangman-gameOverMessage">
            {getWinOrNot() ? "Congratulations! You won!" : "Game over! The word is: " + guessWord}
            <button onClick={e => { setRestart(!restart); setChancesLeft(8); }}>Play again!</button>
          </div>
          }
      </div>
    </div>
  );
}
