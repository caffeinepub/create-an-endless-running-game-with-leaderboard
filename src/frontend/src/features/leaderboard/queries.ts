import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import type { Score } from '../../backend';

export function useGetBestScore() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Score>({
    queryKey: ['bestScore', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getBestScore();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useGetLeaderboard(n: number = 10) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['leaderboard', n],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard(BigInt(n));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitScore() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (score: Score) => {
      if (!actor) throw new Error('Actor not initialized');
      if (!identity) throw new Error('Not authenticated');
      return actor.submitScore(score);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bestScore'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
}
