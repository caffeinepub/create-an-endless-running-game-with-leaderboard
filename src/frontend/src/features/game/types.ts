export type GamePhase = 'ready' | 'playing' | 'gameOver';

export interface RunnerState {
  x: number;
  y: number;
  lane: number;
  velocityY: number;
  isJumping: boolean;
}

export interface Obstacle {
  id: number;
  x: number;
  lane: number;
  type: 'low' | 'high';
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  laneCount: number;
  laneHeight: number;
  runnerWidth: number;
  runnerHeight: number;
  obstacleWidth: number;
  obstacleLowHeight: number;
  obstacleHighHeight: number;
  gravity: number;
  jumpVelocity: number;
  baseSpeed: number;
  speedIncrement: number;
  obstacleSpawnInterval: number;
  minObstacleSpawnInterval: number;
}
