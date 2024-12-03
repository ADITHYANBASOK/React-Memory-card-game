import { memo } from 'react';

const Card = memo(({ symbol, isFlipped, isMatched, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-24 h-24 cursor-pointer transform transition-transform duration-300 hover:scale-105
        ${isFlipped ? 'animate-flip' : ''}`}
    >
      <div className={`absolute w-full h-full rounded-xl shadow-lg transition-all duration-300 transform 
        ${isFlipped ? 'rotate-y-180' : ''} ${isMatched ? 'opacity-50' : ''}`}>
        
        {/* Back of card */}
        <div className={`absolute w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl 
          flex items-center justify-center text-white text-4xl transform 
          ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
          ?
        </div>

        {/* Front of card */}
        <div className={`absolute w-full h-full bg-white rounded-xl flex items-center justify-center 
          text-3xl transform ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
          {symbol}
        </div>
      </div>
    </div>
  );
})

Card.displayName = 'Card';
export default Card;