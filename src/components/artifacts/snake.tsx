"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 20;
const COLS = 22;
const ROWS = 18;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
const OPP: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

function randomFood(snake: Point[]): Point {
  let pos: Point;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const lastTimeRef = useRef(0);

  const gameRef = useRef({
    snake: [{ x: 11, y: 9 }] as Point[],
    dir: "RIGHT" as Dir,
    nextDir: "RIGHT" as Dir,
    food: { x: 16, y: 9 } as Point,
    score: 0,
    alive: true,
  });

  const reset = useCallback(() => {
    gameRef.current = {
      snake: [{ x: 11, y: 9 }],
      dir: "RIGHT",
      nextDir: "RIGHT",
      food: { x: 16, y: 9 },
      score: 0,
      alive: true,
    };
    lastTimeRef.current = 0;
    setScore(0);
    setDead(false);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = COLS * CELL;
    canvas.height = ROWS * CELL;

    let rafId: number;

    const draw = () => {
      const g = gameRef.current;

      ctx.fillStyle = "#0a0a12";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // grid dots
      ctx.fillStyle = "#1a1a2e";
      for (let x = 0; x < COLS; x++)
        for (let y = 0; y < ROWS; y++)
          ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);

      // food
      ctx.fillStyle = "#ff4455";
      ctx.beginPath();
      ctx.arc(
        g.food.x * CELL + CELL / 2,
        g.food.y * CELL + CELL / 2,
        CELL / 2 - 3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // snake
      g.snake.forEach((seg, i) => {
        const t = (g.snake.length - i) / g.snake.length;
        ctx.fillStyle =
          i === 0 ? "#4a90e2" : `rgba(74,144,226,${0.3 + 0.7 * t})`;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 4);
        ctx.fill();
      });
    };

    const tick = (now: number) => {
      const g = gameRef.current;

      if (g.alive && now - lastTimeRef.current >= 120) {
        lastTimeRef.current = now;
        g.dir = g.nextDir;
        const head = g.snake[0];
        const next: Point = {
          x: (head.x + (g.dir === "RIGHT" ? 1 : g.dir === "LEFT" ? -1 : 0) + COLS) % COLS,
          y: (head.y + (g.dir === "DOWN" ? 1 : g.dir === "UP" ? -1 : 0) + ROWS) % ROWS,
        };

        if (g.snake.some((s) => s.x === next.x && s.y === next.y)) {
          g.alive = false;
          setDead(true);
        } else {
          g.snake.unshift(next);
          if (next.x === g.food.x && next.y === g.food.y) {
            g.score++;
            setScore(g.score);
            g.food = randomFood(g.snake);
          } else {
            g.snake.pop();
          }
        }
      }

      draw();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (!g.alive) return;
      const map: Record<string, Dir> = {
        ArrowUp: "UP", w: "UP",
        ArrowDown: "DOWN", s: "DOWN",
        ArrowLeft: "LEFT", a: "LEFT",
        ArrowRight: "RIGHT", d: "RIGHT",
      };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      if (dir !== OPP[g.dir]) g.nextDir = dir;
    };

    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-57px)] gap-6 select-none">
      <div className="text-center">
        <h2 className="text-2xl font-bold neon-accent mb-1">snake</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          arrow keys or WASD to move
        </p>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border rounded-sm"
          style={{ borderColor: "var(--border-color)" }}
        />
        {dead && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
          >
            <div className="text-2xl font-bold" style={{ color: "var(--demon-red)" }}>
              game over
            </div>
            <div className="text-lg neon-accent">score: {score}</div>
            <button
              onClick={reset}
              className="text-sm px-4 py-2 border transition-colors"
              style={{ borderColor: "var(--water-blue)", color: "var(--water-blue)" }}
            >
              play again
            </button>
          </div>
        )}
      </div>

      <div className="text-sm neon-accent">score: {score}</div>
    </div>
  );
}
