import { useEffect } from 'react';

export interface ControlActions {
  onJump: () => void;
  onLaneUp: () => void;
  onLaneDown: () => void;
}

export function useRunnerControls(
  isActive: boolean,
  actions: ControlActions
) {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          actions.onJump();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          actions.onLaneUp();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          actions.onLaneDown();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, actions]);
}
