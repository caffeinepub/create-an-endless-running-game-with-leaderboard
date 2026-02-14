import { useEffect, useRef, useCallback } from 'react';

export function useGameLoop(
  isActive: boolean,
  onFrame: (deltaTime: number) => void
) {
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  const loop = useCallback(
    (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      onFrame(deltaTime);

      if (isActive) {
        frameRef.current = requestAnimationFrame(loop);
      }
    },
    [isActive, onFrame]
  );

  useEffect(() => {
    if (isActive) {
      lastTimeRef.current = 0;
      frameRef.current = requestAnimationFrame(loop);
    }

    return () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isActive, loop]);
}
