import GameBoard from './components/GameBoard';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Memory Game
        </h1>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;