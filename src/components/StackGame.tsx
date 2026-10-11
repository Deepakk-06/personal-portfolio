import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/StackGame.css";

const W = 320;
const H = 420;
const BH = 22; // block height
const BW0 = 150; // starting block width
const PERFECT = 5; // px of slack that still counts as a perfect drop
const BEST_KEY = "dk-stack-best";

type Status = "idle" | "playing" | "paused" | "over";
type Block = { x: number; w: number };
type Cur = { x: number; w: number; dir: number };
type Piece = { x: number; w: number; b: number; vy: number; hue: number };
type Star = { x: number; y: number; r: number; d: number; sp: number; ph: number; tint: string };

const pad = (n: number) => String(n).padStart(3, "0");
const hueOf = (i: number) => (80 + i * 11) % 360;
// screen y of a block whose bottom edge sits `b` px above the base
const sy = (b: number, cam: number) => H - b - BH + cam;

const TINTS = ["255,255,255", "255,255,255", "190,235,255", "198,255,0", "255,150,210"];
const makeStars = (): Star[] =>
  Array.from({ length: 70 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() < 0.18 ? 2 : 1,
    d: 0.08 + Math.random() * 0.32, // parallax depth: far stars drift slower
    sp: 1.2 + Math.random() * 2.8, // twinkle speed
    ph: Math.random() * Math.PI * 2,
    tint: TINTS[Math.floor(Math.random() * TINTS.length)],
  }));

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

const StackGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const lastT = useRef(0);
  const overAt = useRef(0);
  const statusRef = useRef<Status>("idle");
  const scoreRef = useRef(0);
  const bestRef = useRef(readBest());
  const stack = useRef<Block[]>([{ x: (W - BW0) / 2, w: BW0 }]);
  const cur = useRef<Cur>({ x: 0, w: BW0, dir: 1 });
  const showCur = useRef(true);
  const cam = useRef(0);
  const falling = useRef<Piece[]>([]);
  const combo = useRef(0);
  const flash = useRef({ t: 0, x: 0, b: 0 });
  const stars = useRef<Star[]>(makeStars());

  const [status, setStatusState] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(bestRef.current);

  const setStatus = useCallback((s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  }, []);

  const stopLoop = useCallback(() => {
    if (raf.current !== null) {
      cancelAnimationFrame(raf.current);
      raf.current = null;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const camY = cam.current;

    ctx.clearRect(0, 0, W, H);

    // night sky: deep black at the top, a faint blue haze toward the horizon
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#04060a");
    sky.addColorStop(1, "#0b1224");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // twinkling stars behind the tower, drifting down slowly as it grows
    const now = performance.now() / 1000;
    stars.current.forEach((st) => {
      const y = (((st.y + camY * st.d) % H) + H) % H;
      const a = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(now * st.sp + st.ph));
      ctx.fillStyle = `rgba(${st.tint},${a.toFixed(2)})`;
      const x = Math.round(st.x);
      const yy = Math.round(y);
      if (st.r === 2) {
        // the bigger ones sparkle as a little cross
        ctx.fillRect(x - 1, yy, 3, 1);
        ctx.fillRect(x, yy - 1, 1, 3);
      } else {
        ctx.fillRect(x, yy, 1.5, 1.5);
      }
    });

    // placed blocks
    stack.current.forEach((blk, i) => {
      const y = sy(i * BH, camY);
      if (y > H || y < -BH) return;
      ctx.fillStyle = `hsl(${hueOf(i)}, 85%, 58%)`;
      ctx.fillRect(blk.x, y, blk.w, BH - 2);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(blk.x, y, blk.w, 2);
    });

    // the sliding block
    if (showCur.current) {
      const n = stack.current.length;
      const c = cur.current;
      const y = sy(n * BH, camY);
      ctx.save();
      ctx.shadowColor = `hsl(${hueOf(n)}, 85%, 58%)`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `hsl(${hueOf(n)}, 85%, 58%)`;
      ctx.fillRect(c.x, y, c.w, BH - 2);
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(c.x, y, c.w, 2);
    }

    // sliced-off pieces falling away
    falling.current.forEach((p) => {
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = `hsl(${p.hue}, 85%, 58%)`;
      ctx.fillRect(p.x, sy(p.b, camY), p.w, BH - 2);
      ctx.globalAlpha = 1;
    });

    // perfect flash
    if (flash.current.t > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, flash.current.t / 30);
      ctx.fillStyle = "#c6ff00";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PERFECT", flash.current.x, sy(flash.current.b, camY) - 8);
      ctx.restore();
    }
  }, []);

  const frame = useCallback(
    (t: number) => {
      const f = Math.min(t - lastT.current, 50) / 16.667;
      lastT.current = t;

      if (statusRef.current === "playing") {
        const n = stack.current.length;
        const v = Math.min(6.2, 2.4 + n * 0.08);
        const c = cur.current;
        c.x += c.dir * v * f;
        if (c.x <= 0) {
          c.x = 0;
          c.dir = 1;
        } else if (c.x + c.w >= W) {
          c.x = W - c.w;
          c.dir = -1;
        }
      }

      const target = Math.max(0, (stack.current.length + 1) * BH - H * 0.55);
      cam.current += (target - cam.current) * 0.1 * f;

      falling.current.forEach((p) => {
        p.vy += 0.55 * f;
        p.b -= p.vy * f;
      });
      falling.current = falling.current.filter((p) => sy(p.b, cam.current) < H + 60);
      if (flash.current.t > 0) flash.current.t -= f;

      draw();
      if (statusRef.current === "playing" || falling.current.length > 0) {
        raf.current = requestAnimationFrame(frame);
      } else {
        raf.current = null;
      }
    },
    [draw]
  );

  const endGame = useCallback(() => {
    overAt.current = performance.now();
    setStatus("over");
    setScore(scoreRef.current);
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(bestRef.current);
      writeBest(bestRef.current);
    }
    draw();
    if (raf.current === null && falling.current.length > 0) {
      lastT.current = performance.now();
      raf.current = requestAnimationFrame(frame);
    }
  }, [draw, frame, setStatus]);

  const reset = useCallback(() => {
    stack.current = [{ x: (W - BW0) / 2, w: BW0 }];
    cur.current = { x: 0, w: BW0, dir: 1 };
    showCur.current = true;
    cam.current = 0;
    falling.current = [];
    combo.current = 0;
    flash.current = { t: 0, x: 0, b: 0 };
    scoreRef.current = 0;
    setScore(0);
  }, []);

  const start = useCallback(() => {
    stopLoop();
    reset();
    setStatus("playing");
    lastT.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  }, [frame, reset, setStatus, stopLoop]);

  const pause = useCallback(() => {
    if (statusRef.current !== "playing") return;
    stopLoop();
    setStatus("paused");
  }, [setStatus, stopLoop]);

  const resume = useCallback(() => {
    if (statusRef.current !== "paused") return;
    setStatus("playing");
    lastT.current = performance.now();
    raf.current = requestAnimationFrame(frame);
  }, [frame, setStatus]);

  const drop = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const st = stack.current;
    const n = st.length;
    const top = st[n - 1];
    const c = cur.current;
    const left = Math.max(c.x, top.x);
    const right = Math.min(c.x + c.w, top.x + top.w);
    const overlap = right - left;

    // missed the tower completely
    if (overlap <= 0) {
      falling.current.push({ x: c.x, w: c.w, b: n * BH, vy: 0, hue: hueOf(n) });
      showCur.current = false;
      endGame();
      return;
    }

    let nb: Block;
    if (Math.abs(c.x - top.x) <= PERFECT) {
      // clean drop: keep the width, and after a streak give a little back
      combo.current += 1;
      nb = { x: top.x, w: top.w };
      if (combo.current >= 3 && nb.w < BW0) {
        const grow = Math.min(6, BW0 - nb.w);
        nb = { x: Math.max(0, Math.min(W - (nb.w + grow), nb.x - grow / 2)), w: nb.w + grow };
      }
      flash.current = { t: 45, x: nb.x + nb.w / 2, b: n * BH };
    } else {
      combo.current = 0;
      nb = { x: left, w: overlap };
      const cutX = c.x < top.x ? c.x : right;
      falling.current.push({ x: cutX, w: c.w - overlap, b: n * BH, vy: 0, hue: hueOf(n) });
    }

    st.push(nb);
    scoreRef.current = st.length - 1;
    setScore(scoreRef.current);
    const fromLeft = st.length % 2 === 0;
    cur.current = { x: fromLeft ? 0 : W - nb.w, w: nb.w, dir: fromLeft ? 1 : -1 };
  }, [endGame]);

  // canvas setup + first frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    reset();
    draw();
    return stopLoop;
  }, [draw, reset, stopLoop]);

  // auto-pause when scrolled away or tab hidden
  useEffect(() => {
    const el = panelRef.current;
    const io = el
      ? new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) pause();
          },
          { threshold: 0.3 }
        )
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

  const onPointerDown = () => drop();

  const onPointerUp = () => {
    if (performance.now() - overAt.current < 500) return;
    const s = statusRef.current;
    if (s === "idle" || s === "over") start();
    else if (s === "paused") resume();
  };

  return (
    <div
      className={`stackgame ${status === "playing" ? "is-playing" : ""}`}
      ref={panelRef}
      role="application"
      aria-label="STACK.EXE, a small stacking game. Tap to drop the block."
      data-cursor="disable"
    >
      <div className="stackgame-bar">
        <span className="stackgame-title">&gt; STACK.EXE</span>
        <span className="stackgame-score">
          SCORE {pad(score)} · BEST {pad(best)}
        </span>
      </div>
      <div className="stackgame-screen" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <canvas ref={canvasRef} className="stackgame-canvas" />
        {status !== "playing" && (
          <div className="stackgame-overlay">
            {status === "idle" && (
              <>
                <b>STACK THE CHIPS</b>
                <span className="stackgame-blink">TAP TO START</span>
              </>
            )}
            {status === "paused" && (
              <>
                <b>PAUSED</b>
                <span className="stackgame-blink">TAP TO RESUME</span>
              </>
            )}
            {status === "over" && (
              <>
                <b>TOWER DOWN · {pad(score)}</b>
                <span className="stackgame-blink">TAP TO RETRY</span>
              </>
            )}
          </div>
        )}
        <div className="stackgame-scan" aria-hidden="true" />
      </div>
      <p className="stackgame-hint">TAP TO DROP · LAND IT CLEAN</p>
    </div>
  );
};

export default StackGame;
