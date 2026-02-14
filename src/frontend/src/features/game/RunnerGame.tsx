import { useState, useRef, useEffect, useCallback } from 'react';
import { useGameLoop } from './useGameLoop';
import { useRunnerControls } from './useRunnerControls';
import {
  DEFAULT_CONFIG,
  createInitialRunnerState,
  updateRunnerPhysics,
  jump,
  switchLane,
  updateObstacles,
  checkCollision,
  calculateSpeed,
  calculateSpawnInterval,
} from './gamePhysics';
import type { RunnerState, Obstacle, GameConfig } from './types';
import Hud from '../ui/Hud';

interface RunnerGameProps {
  onGameOver: (score: number) => void;
}

export default function RunnerGame({ onGameOver }: RunnerGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [config] = useState<GameConfig>(DEFAULT_CONFIG);
  const [runner, setRunner] = useState<RunnerState>(() =>
    createInitialRunnerState(config)
  );
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const frameCountRef = useRef(0);
  const nextObstacleIdRef = useRef(0);
  const lastSpawnFrameRef = useRef(0);

  const handleJump = useCallback(() => {
    setRunner((prev) => jump(prev, config));
  }, [config]);

  const handleLaneUp = useCallback(() => {
    setRunner((prev) => switchLane(prev, 'up', config));
  }, [config]);

  const handleLaneDown = useCallback(() => {
    setRunner((prev) => switchLane(prev, 'down', config));
  }, [config]);

  useRunnerControls(isPlaying, {
    onJump: handleJump,
    onLaneUp: handleLaneUp,
    onLaneDown: handleLaneDown,
  });

  const onFrame = useCallback(() => {
    if (!isPlaying) return;

    frameCountRef.current++;
    const currentSpeed = calculateSpeed(
      config.baseSpeed,
      frameCountRef.current,
      config.speedIncrement
    );

    setRunner((prev) => updateRunnerPhysics(prev, config));

    setObstacles((prev) => {
      const updated = updateObstacles(prev, currentSpeed);

      const spawnInterval = calculateSpawnInterval(
        config.obstacleSpawnInterval,
        config.minObstacleSpawnInterval,
        frameCountRef.current
      );

      if (
        frameCountRef.current - lastSpawnFrameRef.current >=
        spawnInterval
      ) {
        lastSpawnFrameRef.current = frameCountRef.current;
        const newObstacle: Obstacle = {
          id: nextObstacleIdRef.current++,
          x: config.canvasWidth,
          lane: Math.floor(Math.random() * config.laneCount),
          type: Math.random() > 0.5 ? 'low' : 'high',
        };
        return [...updated, newObstacle];
      }

      return updated;
    });

    setScore((prev) => prev + 1);
  }, [isPlaying, config]);

  useGameLoop(isPlaying, onFrame);

  useEffect(() => {
    if (checkCollision(runner, obstacles, config)) {
      setIsPlaying(false);
      onGameOver(Math.floor(score / 10));
    }
  }, [runner, obstacles, config, score, onGameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Draw lanes
    ctx.strokeStyle = 'oklch(0.88 0.04 50)';
    ctx.lineWidth = 2;
    for (let i = 1; i < config.laneCount; i++) {
      ctx.beginPath();
      ctx.moveTo(0, config.laneHeight * i);
      ctx.lineTo(config.canvasWidth, config.laneHeight * i);
      ctx.stroke();
    }

    // Draw obstacles
    obstacles.forEach((obs) => {
      const height =
        obs.type === 'low' ? config.obstacleLowHeight : config.obstacleHighHeight;
      const y = config.laneHeight * (obs.lane + 1) - height;

      ctx.fillStyle = 'oklch(0.55 0.22 15)';
      ctx.fillRect(obs.x, y, config.obstacleWidth, height);

      ctx.strokeStyle = 'oklch(0.45 0.20 15)';
      ctx.lineWidth = 2;
      ctx.strokeRect(obs.x, y, config.obstacleWidth, height);
    });

    // Draw runner
    ctx.fillStyle = 'oklch(0.58 0.18 35)';
    ctx.fillRect(runner.x, runner.y, config.runnerWidth, config.runnerHeight);

    ctx.strokeStyle = 'oklch(0.48 0.16 35)';
    ctx.lineWidth = 3;
    ctx.strokeRect(runner.x, runner.y, config.runnerWidth, config.runnerHeight);

    // Runner details
    ctx.fillStyle = 'oklch(0.98 0.01 45)';
    ctx.fillRect(runner.x + 10, runner.y + 10, 8, 8);
    ctx.fillRect(runner.x + 22, runner.y + 10, 8, 8);
  }, [runner, obstacles, config]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
      <Hud score={Math.floor(score / 10)} />
      <div className="relative mt-4">
        <canvas
          ref={canvasRef}
          width={config.canvasWidth}
          height={config.canvasHeight}
          className="border-4 border-primary rounded-lg shadow-2xl bg-card"
        />
      </div>
      <div className="mt-6 text-center text-sm text-muted-foreground max-w-md">
        <p className="font-medium">Controls:</p>
        <p className="mt-1">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Space</kbd> or{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">↑</kbd> to jump
        </p>
        <p className="mt-1">
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">←</kbd> /{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">→</kbd> to switch lanes
        </p>
      </div>
    </div>
  );
}
