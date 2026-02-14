import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Trophy } from 'lucide-react';
import AuthControls from '../auth/AuthControls';

interface StartScreenProps {
  onStartGame: () => void;
  onShowLeaderboard: () => void;
}

export default function StartScreen({
  onStartGame,
  onShowLeaderboard,
}: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="absolute top-4 right-4">
        <AuthControls />
      </div>

      <div className="max-w-2xl w-full space-y-8 animate-slide-in">
        <div className="text-center space-y-4">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Endless Runner
          </h1>
          <p className="text-xl text-muted-foreground">
            How far can you go?
          </p>
        </div>

        <Card className="border-2 border-primary/20 shadow-glow">
          <CardHeader>
            <CardTitle className="text-2xl">How to Play</CardTitle>
            <CardDescription className="text-base">
              Master the controls and survive as long as possible
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 rounded-md p-2 mt-0.5">
                  <kbd className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-mono font-semibold">
                    SPACE
                  </kbd>
                </div>
                <div>
                  <p className="font-medium">Jump</p>
                  <p className="text-muted-foreground">
                    Press Space or Arrow Up to jump over obstacles
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-accent/10 rounded-md p-2 mt-0.5">
                  <kbd className="px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-mono font-semibold">
                    ← →
                  </kbd>
                </div>
                <div>
                  <p className="font-medium">Switch Lanes</p>
                  <p className="text-muted-foreground">
                    Use Arrow Left/Right to move between three lanes
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                💡 <span className="font-medium">Tip:</span> The game gets faster as you progress. Stay alert!
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="flex-1 text-lg h-14 shadow-lg hover:shadow-glow transition-all"
            onClick={onStartGame}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Game
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 text-lg h-14 border-2"
            onClick={onShowLeaderboard}
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} · Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
