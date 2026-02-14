import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import StartScreen from './features/ui/StartScreen';
import RunnerGame from './features/game/RunnerGame';
import GameOverScreen from './features/ui/GameOverScreen';
import LeaderboardSection from './features/leaderboard/LeaderboardSection';
import { Toaster } from '@/components/ui/sonner';

type GameState = 'start' | 'playing' | 'gameOver' | 'leaderboard';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [finalScore, setFinalScore] = useState(0);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setGameState('playing');
  };

  const handleShowLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleBackToStart = () => {
    setGameState('start');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background">
        {gameState === 'start' && (
          <StartScreen
            onStartGame={handleStartGame}
            onShowLeaderboard={handleShowLeaderboard}
          />
        )}
        {gameState === 'playing' && <RunnerGame onGameOver={handleGameOver} />}
        {gameState === 'gameOver' && (
          <GameOverScreen
            score={finalScore}
            onRestart={handleRestart}
            onShowLeaderboard={handleShowLeaderboard}
            onBackToStart={handleBackToStart}
          />
        )}
        {gameState === 'leaderboard' && (
          <LeaderboardSection onBack={handleBackToStart} />
        )}
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
