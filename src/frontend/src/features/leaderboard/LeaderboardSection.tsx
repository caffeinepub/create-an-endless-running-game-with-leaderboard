import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useGetLeaderboard } from './queries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import AuthControls from '../auth/AuthControls';

interface LeaderboardSectionProps {
  onBack: () => void;
}

function formatPrincipal(principal: string): string {
  if (principal.length <= 12) return principal;
  return `${principal.slice(0, 6)}...${principal.slice(-4)}`;
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return null;
  }
}

export default function LeaderboardSection({ onBack }: LeaderboardSectionProps) {
  const { data: leaderboard, isLoading, isError } = useGetLeaderboard(10);
  const { identity } = useInternetIdentity();

  const currentUserPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background via-background to-accent/10">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="absolute top-4 right-4">
        <AuthControls />
      </div>

      <div className="max-w-3xl w-full space-y-6 animate-slide-in mt-16">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-10 w-10 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-muted-foreground">Top runners of all time</p>
        </div>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Top 10 Scores</CardTitle>
            <CardDescription>
              Compete with players around the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <div className="text-center py-8 text-destructive">
                <p className="font-medium">Failed to load leaderboard</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please try again later
                </p>
              </div>
            )}

            {!isLoading && !isError && leaderboard && leaderboard.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="font-medium">No scores yet</p>
                <p className="text-sm mt-1">Be the first to set a record!</p>
              </div>
            )}

            {!isLoading && !isError && leaderboard && leaderboard.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map(([principal, score], index) => {
                    const rank = index + 1;
                    const principalStr = principal.toString();
                    const isCurrentUser = principalStr === currentUserPrincipal;

                    return (
                      <TableRow
                        key={principalStr}
                        className={isCurrentUser ? 'bg-primary/5' : ''}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getRankIcon(rank)}
                            <span>{rank}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center gap-2">
                            {formatPrincipal(principalStr)}
                            {isCurrentUser && (
                              <Badge variant="secondary" className="text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg tabular-nums">
                          {Number(score)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {!identity && (
          <Card className="border-2 border-muted bg-muted/20">
            <CardContent className="pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                🔒 Sign in to see your ranking and save your scores
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
