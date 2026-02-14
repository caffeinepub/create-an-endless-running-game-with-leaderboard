import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Trophy, Home, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useSubmitScore } from '../leaderboard/queries';
import { toast } from 'sonner';
import AuthControls from '../auth/AuthControls';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onShowLeaderboard: () => void;
  onBackToStart: () => void;
}

export default function GameOverScreen({
  score,
  onRestart,
  onShowLeaderboard,
  onBackToStart,
}: GameOverScreenProps) {
  const { identity } = useInternetIdentity();
  const submitScoreMutation = useSubmitScore();

  useEffect(() => {
    if (identity && score > 0) {
      submitScoreMutation.mutate(BigInt(score), {
        onSuccess: (savedScore) => {
          const saved = Number(savedScore);
          if (saved === score) {
            toast.success('New best score! 🎉', {
              description: `Your score of ${score} has been saved.`,
            });
          } else {
            toast.info('Score submitted', {
              description: `Your best score remains ${saved}.`,
            });
          }
        },
        onError: () => {
          toast.error('Failed to save score', {
            description: 'Please try again.',
          });
        },
      });
    }
  }, [identity, score]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background via-background to-destructive/10">
      <div className="absolute top-4 right-4">
        <AuthControls />
      </div>

      <div className="max-w-lg w-full space-y-6 animate-slide-in">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-destructive">Game Over</h1>
          <p className="text-muted-foreground">Better luck next time!</p>
        </div>

        <Card className="border-2 border-destructive/20 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl">Final Score</CardTitle>
            <div className="pt-4">
              <Badge
                variant="outline"
                className="text-4xl font-bold px-8 py-3 border-2 border-primary"
              >
                {score}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {!identity && (
              <div className="bg-muted/50 rounded-lg p-4 text-center space-y-2">
                <p className="text-sm font-medium">
                  🔒 Sign in to save your score
                </p>
                <p className="text-xs text-muted-foreground">
                  Track your progress and compete on the leaderboard
                </p>
              </div>
            )}

            {identity && submitScoreMutation.isPending && (
              <div className="bg-primary/10 rounded-lg p-4 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-sm font-medium">Saving your score...</p>
                </div>
              </div>
            )}

            {identity && submitScoreMutation.isSuccess && (
              <div className="bg-accent/10 rounded-lg p-4 text-center space-y-2">
                <p className="text-sm font-medium">✓ Score saved successfully!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            size="lg"
            className="text-lg h-12"
            onClick={onRestart}
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-lg h-12 border-2"
            onClick={onShowLeaderboard}
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full"
          onClick={onBackToStart}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Start
        </Button>
      </div>
    </div>
  );
}
