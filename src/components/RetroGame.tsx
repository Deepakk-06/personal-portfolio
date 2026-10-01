import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/RetroGame.css";

const COLS = 20;
const ROWS = 14;
const CELL = 22;
const W = COLS * CELL;
const H = ROWS * CELL;
const BEST_KEY = "dk-botexe-best";
const DESKTOP_QUERY = "(min-width: 1100px) and (hover: hover) and (pointer: fine)";

type Pt = { x: number; y: number };
type Status = "idle" | "playing" | "paused" | "over";

const DIRS: Record<string, Pt> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const pad = (n: number) => String(n).padStart(2, "0");

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

const writeBest = (n: number) => {
  try {
    localStorage.setItem(BEST_KEY, String(n));
  } catch {
    /* storage unavailable, ignore */
  }
};

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const snake = useRef<Pt[]>([]);
  const dir = useRef<Pt>({ x: 1, y: 0 });
  const queue = useRef<Pt[]>([]);
  const food = useRef<Pt>({ x: 12, y: 7 });
  const timer = useRef<number | null>(null);
  const statusRef = useRef<Status>("idle");
  const scoreRef = useRef(0);
  const bestRef = useRef(readBest());
  const colors = useRef({ accent: "#c6ff00", pink: "#ff2d95" });

  const [status, setStatusState] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(bestRef.current);
  const [focused, setFocused] = useState(false);

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const draw = useCallback((dead = false) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { accent, pink } = colors.current;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#060809";
    ctx.fillRect(0, 0, W, H);

    // dot-matrix grid
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillRect(x * CELL + CELL / 2 - 1, y * CELL + CELL / 2 - 1, 2, 2);
      }
    }

    // food: a little chip with pins
    const fx = food.current.x * CELL;
    const fy = food.current.y * CELL;
    ctx.save();
    ctx.shadowColor = pink;
    ctx.shadowBlur = 10;
    ctx.fillStyle = pink;
    ctx.fillRect(fx + 6, fy + 6, CELL - 12, CELL - 12);
    ctx.restore();
    ctx.fillStyle = pink;
    for (let i = 0; i < 2; i++) {
      const o = 8 + i * 5;
      ctx.fillRect(fx + o, fy + 2, 2, 4);
      ctx.fillRect(fx + o, fy + CELL - 6, 2, 4);
      ctx.fillRect(fx + 2, fy + o, 4, 2);
      ctx.fillRect(fx + CELL - 6, fy + o, 4, 2);
    }

    // snake / bot
    const body = snake.current;
    body.forEach((s, i) => {
      const fade = Math.max(0.35, 1 - i * 0.045);
      ctx.save();
      if (i === 0) {
        ctx.shadowColor = dead ? pink : accent;
        ctx.shadowBlur = 12;
      }
      ctx.globalAlpha = fade;
      ctx.fillStyle = dead ? pink : accent;
      ctx.fillRect(s.x * CELL + 2, s.y * CELL + 2, CELL - 4, CELL - 4);
      ctx.restore();
    });

    // eyes on the head
    const head = body[0];
    if (head) {
      const hx = head.x * CELL;
      const hy = head.y * CELL;
      const d = dir.current;
      ctx.fillStyle = "#060809";
      if (d.x !== 0) {
        const ex = d.x > 0 ? hx + CELL - 8 : hx + 5;
        ctx.fillRect(ex, hy + 6, 3, 3);
        ctx.fillRect(ex, hy + CELL - 9, 3, 3);
      } else {
        const ey = d.y > 0 ? hy + CELL - 8 : hy + 5;
        ctx.fillRect(hx + 6, ey, 3, 3);
        ctx.fillRect(hx + CELL - 9, ey, 3, 3);
      }
    }
  }, []);

  const placeFood = useCallback(() => {
    const free: Pt[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!snake.current.some((s) => s.x === x && s.y === y)) free.push({ x, y });
      }
    }
    if (free.length) food.current = free[Math.floor(Math.random() * free.length)];
    return free.length > 0;
  }, []);

  const reset = useCallback(() => {
    snake.current = [
      { x: 6, y: 7 },
      { x: 5, y: 7 },
      { x: 4, y: 7 },
    ];
    dir.current = { x: 1, y: 0 };
    queue.current = [];
    scoreRef.current = 0;
    setScore(0);
    placeFood();
  }, [placeFood]);

  const endGame = useCallback(() => {
    clearTimer();
    setStatus("over");
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(bestRef.current);
      writeBest(bestRef.current);
    }
    draw(true);
  }, [clearTimer, draw, setStatus]);

  const tick = useCallback(() => {
    if (queue.current.length) dir.current = queue.current.shift() as Pt;
    const head = snake.current[0];
    const nx = head.x + dir.current.x;
    const ny = head.y + dir.current.y;
    const ate = nx === food.current.x && ny === food.current.y;
    const solid = ate ? snake.current : snake.current.slice(0, -1);

    if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS || solid.some((s) => s.x === nx && s.y === ny)) {
      endGame();
      return;
    }

    snake.current = [{ x: nx, y: ny }, ...snake.current];
    if (ate) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
      if (!placeFood()) {
        endGame();
        return;
      }
    } else {
      snake.current.pop();
    }
    draw();
  }, [draw, endGame, placeFood]);

  const schedule = useCallback(() => {
    clearTimer();
    const delay = Math.max(70, 140 - scoreRef.current * 4);
    timer.current = window.setTimeout(() => {
      tick();
      if (statusRef.current === "playing") schedule();
    }, delay);
  }, [clearTimer, tick]);

  const start = useCallback(() => {
    reset();
    setStatus("playing");
    draw();
    schedule();
  }, [draw, reset, schedule, setStatus]);

  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    clearTimer();
    setStatus("paused");
  }, [clearTimer, setStatus]);

  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    setStatus("playing");
    schedule();
  }, [schedule, setStatus]);

  // canvas setup + first frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    const css = getComputedStyle(document.documentElement);
    colors.current = {
      accent: css.getPropertyValue("--accentColor").trim() || "#c6ff00",
      pink: css.getPropertyValue("--accent2").trim() || "#ff2d95",
    };
    reset();
    draw();
    return clearTimer;
  }, [clearTimer, draw, reset]);

  // auto-pause when scrolled away or tab hidden
  useEffect(() => {
    const el = panelRef.current;
    const io = el
      ? new IntersectionObserver(([entry]) => {
          if (!entry.isIntersecting) pause();
        }, { threshold: 0.3 })
      : null;
    if (el && io) io.observe(el);
    const onVis = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pause]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const s = statusRef.current;
    const move = DIRS[e.key];

    if (move) {
      e.preventDefault();
      if (s === "idle" || s === "over") start();
      else if (s === "paused") resume();
      const last = queue.current.length ? queue.current[queue.current.length - 1] : dir.current;
      const reverse = move.x === -last.x && move.y === -last.y;
      const same = move.x === last.x && move.y === last.y;
      if (!reverse && !same && queue.current.length < 2) queue.current.push(move);
      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (s === "idle" || s === "over") start();
      else if (s === "paused") resume();
      else if (e.key === " ") pause();
      return;
    }

    if (e.key === "Escape") {
      pause();
      panelRef.current?.blur();
    }
  };

  return (
    <div
      className={`retro-game ${focused ? "is-focused" : ""}`}
      ref={panelRef}
      tabIndex={0}
      role="application"
      aria-label="BOT.EXE, a small snake game. Click and use the arrow keys to play."
      data-cursor="disable"
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => {
        setFocused(false);
        pause();
      }}
    >
      <div className="retro-bar">
        <span className="retro-title">&gt; BOT.EXE</span>
        <span className="retro-score">
          SCORE {pad(score)} · BEST {pad(best)}
        </span>
      </div>
      <div className="retro-screen">
        <canvas ref={canvasRef} className="retro-canvas" />
        {status !== "playing" && (
          <div className="retro-overlay">
            {status === "idle" && (
              <>
                <b>COLLECT THE CHIPS</b>
                <span className="retro-blink">{focused ? "PRESS ENTER OR AN ARROW KEY" : "CLICK TO PLAY"}</span>
              </>
            )}
            {status === "paused" && (
              <>
                <b>PAUSED</b>
                <span className="retro-blink">PRESS SPACE OR AN ARROW KEY</span>
              </>
            )}
            {status === "over" && (
              <>
                <b>GAME OVER · {pad(score)}</b>
                <span className="retro-blink">{focused ? "PRESS ENTER TO RETRY" : "CLICK TO RETRY"}</span>
              </>
            )}
          </div>
        )}
        <div className="retro-scan" aria-hidden="true" />
      </div>
      <p className="retro-hint">{focused ? "← ↑ ↓ → MOVE · SPACE PAUSE · ESC EXIT" : "DESKTOP ONLY · ARROW KEYS"}</p>
    </div>
  );
};

const RetroGame = () => {
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return desktop ? <Game /> : null;
};

export default RetroGame;
