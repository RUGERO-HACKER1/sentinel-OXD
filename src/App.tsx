import { GameProvider, useGame } from './context/GameContext';
import { GameLayout } from './components/GameLayout';
import { ModeSelector } from './components/ModeSelector';

function GameContent() {
  const { isPlaying, selectGameMode } = useGame();

  // Show mode selector if game hasn't started yet
  if (!isPlaying) {
    return <ModeSelector onSelectMode={selectGameMode} />;
  }

  return <GameLayout />;
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
