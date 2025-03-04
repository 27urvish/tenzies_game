import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { Die } from "./Die.jsx"; 

export function App() {
  const [dice, setDice] = useState(generateAllDice);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    if (dice.length > 0 && dice.every(die => die.isHeld && die.value === dice[0].value)) {
      setGameWon(true);
    }
  }, [dice]);

  function generateAllDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({ 
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid() 
      }));
  }

  function rollDice() {
    if (!gameWon) {
      setDice(oldDice => oldDice.map(die => 
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      ));
    } else {
      setGameWon(false);
      setDice(generateAllDice());
    }
  }

  function hold(id) {
    setDice(oldDice => oldDice.map(die => 
      die.id === id ? { ...die, isHeld: !die.isHeld } : die
    ));
  }

  const diceElement = dice.map(diceobj => (
    <Die 
      key={diceobj.id} 
      value={diceobj.value} 
      isHeld={diceobj.isHeld} 
      hold={() => hold(diceobj.id)}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />} 

      <h1 className="title">🎲 Tenzies Game 🎲</h1>
      <p className="instructions">
        Roll the dice until all of them show the same number. 
        Click on a die to **hold** its value between rolls.
      </p>

      <div className="dice-container">{diceElement}</div>

      <button onClick={rollDice} className="roll-dice">
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
