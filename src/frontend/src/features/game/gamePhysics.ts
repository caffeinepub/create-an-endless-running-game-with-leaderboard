import type { RunnerState, Obstacle, GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 400,
  laneCount: 3,
  laneHeight: 133.33,
  runnerWidth: 40,
  runnerHeight: 50,
  obstacleWidth: 40,
  obstacleLowHeight: 30,
  obstacleHighHeight: 60,
  gravity: 0.8,
  jumpVelocity: -15,
  baseSpeed: 5,
  speedIncrement: 0.0005,
  obstacleSpawnInterval: 120,
  minObstacleSpawnInterval: 60,
};

export function createInitialRunnerState(config: GameConfig): RunnerState {
  return {
    x: 100,
    y: config.laneHeight * 1.5 - config.runnerHeight,
    lane: 1,
    velocityY: 0,
    isJumping: false,
  };
}

export function updateRunnerPhysics(
  runner: RunnerState,
  config: GameConfig
): RunnerState {
  const groundY = config.laneHeight * (runner.lane + 1) - config.runnerHeight;
  let newVelocityY = runner.velocityY;
  let newY = runner.y;
  let newIsJumping = runner.isJumping;

  if (runner.isJumping) {
    newVelocityY += config.gravity;
    newY += newVelocityY;

    if (newY >= groundY) {
      newY = groundY;
      newVelocityY = 0;
      newIsJumping = false;
    }
  } else {
    newY = groundY;
  }

  return {
    ...runner,
    y: newY,
    velocityY: newVelocityY,
    isJumping: newIsJumping,
  };
}

export function jump(runner: RunnerState, config: GameConfig): RunnerState {
  if (!runner.isJumping) {
    return {
      ...runner,
      velocityY: config.jumpVelocity,
      isJumping: true,
    };
  }
  return runner;
}

export function switchLane(
  runner: RunnerState,
  direction: 'up' | 'down',
  config: GameConfig
): RunnerState {
  const newLane =
    direction === 'up'
      ? Math.max(0, runner.lane - 1)
      : Math.min(config.laneCount - 1, runner.lane + 1);

  if (newLane !== runner.lane) {
    const groundY = config.laneHeight * (newLane + 1) - config.runnerHeight;
    return {
      ...runner,
      lane: newLane,
      y: groundY,
      velocityY: 0,
      isJumping: false,
    };
  }
  return runner;
}

export function updateObstacles(
  obstacles: Obstacle[],
  speed: number
): Obstacle[] {
  return obstacles
    .map((obs) => ({
      ...obs,
      x: obs.x - speed,
    }))
    .filter((obs) => obs.x > -100);
}

export function checkCollision(
  runner: RunnerState,
  obstacles: Obstacle[],
  config: GameConfig
): boolean {
  const runnerLeft = runner.x;
  const runnerRight = runner.x + config.runnerWidth;
  const runnerTop = runner.y;
  const runnerBottom = runner.y + config.runnerHeight;

  for (const obs of obstacles) {
    if (obs.lane !== runner.lane) continue;

    const obsLeft = obs.x;
    const obsRight = obs.x + config.obstacleWidth;
    const obsHeight =
      obs.type === 'low' ? config.obstacleLowHeight : config.obstacleHighHeight;
    const obsTop = config.laneHeight * (obs.lane + 1) - obsHeight;
    const obsBottom = config.laneHeight * (obs.lane + 1);

    if (
      runnerRight > obsLeft &&
      runnerLeft < obsRight &&
      runnerBottom > obsTop &&
      runnerTop < obsBottom
    ) {
      return true;
    }
  }

  return false;
}

export function calculateSpeed(
  baseSpeed: number,
  elapsedFrames: number,
  speedIncrement: number
): number {
  return baseSpeed + elapsedFrames * speedIncrement;
}

export function calculateSpawnInterval(
  baseInterval: number,
  minInterval: number,
  elapsedFrames: number
): number {
  const reduction = Math.floor(elapsedFrames / 600);
  return Math.max(minInterval, baseInterval - reduction * 10);
}
