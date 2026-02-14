import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetBestScore } from '../leaderboard/queries';

interface HudProps {
  score: number;
}

export default function Hud({ score }: HudProps) {
  const { identity } = useInternetIdentity();
  const { data: bestScore, isLoading } = useGetBestScore();

  return (
    <div className="w-full max-w-4xl flex justify-between items-start gap-4">
      <Card className="px-6 py-3 bg-card/95 backdrop-blur border-2 border-primary/20">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Score
            </p>
            <p className="text-3xl font-bold text-primary tabular-nums">
              {score}
            </p>
          </div>
        </div>
      </Card>

      {identity && (
        <Card className="px-6 py-3 bg-card/95 backdrop-blur border-2 border-accent/20">
          <div className="flex items-center gap-3">
            <Trophy className="h-5 w-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Best Score
              </p>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold text-accent tabular-nums">
                  {bestScore !== undefined ? Number(bestScore) : 0}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      {!identity && (
        <Card className="px-6 py-3 bg-muted/50 backdrop-blur border-2 border-muted">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Sign in to track your best score
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
