import { useState, useEffect, useCallback } from 'react';
import Card from './Card';
import { FiRefreshCw } from 'react-icons/fi';
import useSound from 'use-sound';

const DIFFICULTIES = {
  EASY: { grid: 4, name: 'Easy' },
  MEDIUM: { grid: 6, name: 'Medium' },
};

const SYMBOLS = ['🌟', '🎈', '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🎸', '🎺', '🎨', '🎭', '🎪', '🦄', '🌈', '🍦', '🍭', '🎠'];

const GameBoard = () => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.EASY);
  const [highScores, setHighScores] = useState(() => 
    JSON.parse(localStorage.getItem('memoryGameHighScores')) || {}
  );

  const [playFlip] = useSound('/flip.mp3');
  const [playMatch] = useSound('/match.mp3');
  const [playWin] = useSound('/win.mp3');

  const shuffleCards = useCallback(() => {
    const gridSize = difficulty.grid;
    const totalPairs = (gridSize * gridSize) / 2;
    const selectedSymbols = SYMBOLS.slice(0, totalPairs);
    const shuffledCards = [...selectedSymbols, ...selectedSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));
    setCards(shuffledCards);
  }, [difficulty]);

  const startGame = () => {
    shuffleCards();
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setTime(0);
    setIsPlaying(true);
  };

  const handleCardClick = (index) => {
    if (!isPlaying) return;
    if (flippedIndices.includes(index) || matchedPairs.includes(index)) return;
    if (flippedIndices.length === 2) return;

    playFlip();
    setFlippedIndices([...flippedIndices, index]);
    
    if (flippedIndices.length === 1) {
      setMoves(m => m + 1);
      const firstCard = cards[flippedIndices[0]];
      const secondCard = cards[index];

      if (firstCard.symbol === secondCard.symbol) {
        playMatch();
        setMatchedPairs([...matchedPairs, flippedIndices[0], index]);
        setFlippedIndices([]);
      } else {
        setTimeout(() => setFlippedIndices([]), 1000);
      }
    }
  };

  useEffect(() => {
    startGame();
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    if (matchedPairs.length && matchedPairs.length === cards.length) {
      setIsPlaying(false);
      playWin();
      const score = Math.round(10000 * (cards.length / (moves * time)));
      const newHighScores = {
        ...highScores,
        [difficulty.name]: Math.max(score, highScores[difficulty.name] || 0)
      };
      setHighScores(newHighScores);
      localStorage.setItem('memoryGameHighScores', JSON.stringify(newHighScores));
    }
  }, [matchedPairs.length, cards.length, moves, time]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiRefreshCw /> Reset
        </button>
        <select
          value={difficulty.name}
          onChange={(e) => setDifficulty(
            Object.values(DIFFICULTIES).find(d => d.name === e.target.value)
          )}
          className="px-4 py-2 rounded-lg border-2 border-indigo-600"
        >
          {Object.values(DIFFICULTIES).map(d => (
            <option key={d.name} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-8 text-lg">
        <div>Moves: {moves}</div>
        <div>Time: {time}s</div>
        <div>High Score: {highScores[difficulty.name] || 0}</div>
      </div>

      <div className={`grid gap-4 ${difficulty.grid === 4 ? 'grid-cols-4' : 'grid-cols-6'}`}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            symbol={card.symbol}
            isFlipped={flippedIndices.includes(index) || matchedPairs.includes(index)}
            isMatched={matchedPairs.includes(index)}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;