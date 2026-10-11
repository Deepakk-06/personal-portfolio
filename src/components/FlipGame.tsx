import { useCallback, useEffect, useRef, useState } from "react";
import "./styles/StackGame.css";

// FLIP.EXE: a neon wall-runner. Tap to flip to the other wall, dodge the spikes,
// grab chips (the ones floating mid-air need perfect timing), and survive the speed-up.

const W = 320;
const H = 420;
const PY = 330; // the orb's fixed height; the world scrolls past it
const LANE_L = 34;
const LANE_R = W - 34;
const HR = 5; // forgiving hit radius
const SPIKE_HIT = 34; // how far a spike reaches into the corridor
const SPIKE_DRAW = 38;
const FLIP_SPEED = 24; // px per frame while flipping
const BEST_KEY = "dk-flip-best";

type Status = "idle" | "playing" | "paused" | "over";
type Band = { side: 0 | 1; y: number; h: number; close: boolean; done: boolean };
type Chip = { x: number; y: number; mid: boolean; ph: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number; s: number };
type Pop = { x: number; y: number; t: number; text: string; hue: number };
type Streak = { x: number; y: number; l: number; s: number };

const pad = (n: number) => String(n).padStart(3, "0");
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const speedFor = (score: number) => Math.min(10.5, 3.6 + score * 0.06);
const hueFor = (score: number) => (72 + score * 7) % 360; // starts lime, drifts through the theme colours

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

const makeStreaks = (): Streak[] =>
  Array.from({ length: 16 }, () => ({ x: rand(50, W - 50), y: rand(0, H), l: rand(14, 42), s: rand(1.4, 2.6) }));

const FlipGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const lastT = useRef(0);
  const overAt = useRef(-1000);
  const statusRef = useRef<Status>("idle");
  const scoreRef = useRef(0);
  const bestRef = useRef(readBest());

  const px = useRef(LANE_L);
  const lane = useRef<0 | 1>(0);
  const bands = useRef<Band[]>([]);
  const chips = useRef<Chip[]>([]);
  const sparks = useRef<Spark[]>([]);
  const pops = useRef<Pop[]>([]);
  const trail = useRef<number[]>([]);
  const streaks = useRef<Streak[]>(makeStreaks());
  const scroll = useRef(0);
  const shake = useRef(0);
  const flash = useRef(0);
  const dead = useRef(false);

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

  const addScore = useCallback((n: number) => {
    scoreRef.current += n;
    setScore(scoreRef.current);
  }, []);

  const burst = useCallback((x: number, y: number, hue: number, n: number, power: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = rand(0.6, 1) * power;
      sparks.current.push({
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0,
        max: rand(22, 46),
        hue: hue + rand(-25, 25),
        s: Math.random() < 0.25 ? 3 : 2,
      });
    }
  }, []);

  // ---- level generation: bands of spikes on alternating walls, chips in the safe spots ----
  const spawn = useCallback(() => {
    const arr = bands.current;
    const v = speedFor(scoreRef.current);
    const h = rand(56, 140);
    if (arr.length === 0) {
      arr.push({ side: Math.random() < 0.5 ? 0 : 1, y: -h - 90, h, close: false, done: false });
      return;
    }
    const last = arr[arr.length - 1];
    const side: 0 | 1 = Math.random() < 0.58 ? ((1 - last.side) as 0 | 1) : last.side;
    const opposite = side !== last.side;
    // leave enough room to reach the other wall in time, more as it speeds up
    const gap = (opposite ? v * 17 + 44 : 56) + rand(0, 70);
    const y = last.y - gap - h;
    arr.push({ side, y, h, close: false, done: false });

    // a chip hanging in mid-air between the bands: you only catch it by flipping at the right moment
    if (opposite || Math.random() < 0.4) {
      chips.current.push({ x: W / 2, y: last.y - gap / 2, mid: true, ph: Math.random() * 6 });
    }
    // and a chip tucked against the safe wall while the spikes pass
    if (Math.random() < 0.6) {
      chips.current.push({ x: side === 0 ? LANE_R : LANE_L, y: y + h / 2, mid: false, ph: Math.random() * 6 });
    }
  }, []);

  const die = useCallback(() => {
    if (dead.current) return;
    dead.current = true;
    shake.current = 16;
    flash.current = 1;
    burst(px.current, PY, 330, 46, 6.5);
    burst(px.current, PY, hueFor(scoreRef.current), 24, 4);
    overAt.current = performance.now();
    setStatus("over");
    setScore(scoreRef.current);
    if (scoreRef.current > bestRef.current) {
      bestRef.current = scoreRef.current;
      setBest(bestRef.current);
      writeBest(bestRef.current);
    }
  }, [burst, setStatus]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const sc = scoreRef.current;
    const hue = hueFor(sc);
    const main = `hsl(${hue}, 100%, 58%)`;
    const v = speedFor(sc);
    const now = performance.now() / 1000;

    ctx.save();
    ctx.clearRect(0, 0, W, H);
    if (shake.current > 0.3) ctx.translate(rand(-1, 1) * shake.current, rand(-1, 1) * shake.current);

    // backdrop
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#04060a");
    sky.addColorStop(1, `hsl(${hue}, 45%, 9%)`);
    ctx.fillStyle = sky;
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // scrolling grid
    ctx.strokeStyle = `hsla(${hue}, 100%, 60%, 0.07)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let y = -(scroll.current % 40); y < H; y += 40) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    for (let x = 40; x < W; x += 40) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    ctx.stroke();

    // speed streaks, only once things get quick
    if (v > 4.6) {
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(0.2, (v - 4.6) * 0.04).toFixed(2)})`;
      ctx.beginPath();
      streaks.current.forEach((s) => {
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y - s.l);
      });
      ctx.stroke();
    }

    // neon walls
    ctx.save();
    ctx.shadowColor = main;
    ctx.shadowBlur = 14;
    ctx.fillStyle = main;
    ctx.fillRect(0, 0, 2, H);
    ctx.fillRect(W - 2, 0, 2, H);
    ctx.restore();

    // spikes
    bands.current.forEach((b) => {
      if (b.y > H + 10 || b.y + b.h < -10) return;
      const t = 14;
      const n = Math.ceil(b.h / t);
      const dir = b.side === 0 ? 1 : -1;
      const x0 = b.side === 0 ? 0 : W;
      ctx.beginPath();
      ctx.moveTo(x0, b.y);
      for (let i = 0; i < n; i++) {
        const y0 = b.y + i * t;
        const y1 = Math.min(b.y + b.h, y0 + t);
        ctx.lineTo(x0 + dir * SPIKE_DRAW, (y0 + y1) / 2);
        ctx.lineTo(x0, y1);
      }
      ctx.closePath();
      ctx.save();
      ctx.shadowColor = "#ff2d95";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#2a0618";
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#ff2d95";
      ctx.stroke();
      ctx.restore();
    });

    // chips
    chips.current.forEach((c) => {
      if (c.y > H + 20 || c.y < -20) return;
      const w = 7 * Math.abs(Math.cos(now * 3 + c.ph)) + 1.5;
      const bob = Math.sin(now * 4 + c.ph) * 2;
      ctx.save();
      ctx.shadowColor = c.mid ? "#ffffff" : "#00e5ff";
      ctx.shadowBlur = c.mid ? 16 : 10;
      ctx.fillStyle = c.mid ? "#ffffff" : "#00e5ff";
      ctx.beginPath();
      ctx.moveTo(c.x, c.y + bob - 8);
      ctx.lineTo(c.x + w, c.y + bob);
      ctx.lineTo(c.x, c.y + bob + 8);
      ctx.lineTo(c.x - w, c.y + bob);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // orb trail, streaming away below it
    const tr = trail.current;
    for (let i = tr.length - 1; i >= 0; i--) {
      const k = 1 - i / tr.length;
      ctx.fillStyle = `hsla(${hue}, 100%, 62%, ${(k * 0.45).toFixed(2)})`;
      ctx.beginPath();
      ctx.arc(tr[i], PY + (i + 1) * v * 0.9, 7 * k + 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // the orb
    if (!dead.current) {
      const target = lane.current === 0 ? LANE_L : LANE_R;
      const stretch = Math.min(5, Math.abs(target - px.current) / 18);
      ctx.save();
      ctx.shadowColor = main;
      ctx.shadowBlur = 22;
      const g = ctx.createRadialGradient(px.current, PY, 1, px.current, PY, 9 + stretch);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.45, main);
      g.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.6)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(px.current, PY, 8 + stretch, 8 - stretch * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // sparks
    sparks.current.forEach((s) => {
      const a = 1 - s.life / s.max;
      ctx.fillStyle = `hsla(${s.hue}, 100%, 62%, ${a.toFixed(2)})`;
      ctx.fillRect(s.x, s.y, s.s, s.s);
    });

    // floating call-outs
    ctx.textAlign = "center";
    ctx.font = "bold 11px monospace";
    pops.current.forEach((p) => {
      ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${Math.min(1, p.t / 20).toFixed(2)})`;
      ctx.fillText(p.text, p.x, p.y);
    });

    // tiny HUD: speed readout
    ctx.textAlign = "left";
    ctx.font = "10px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText(`SPD ${String(Math.round(v * 10)).padStart(2, "0")}`, 10, 16);

    // death flash
    if (flash.current > 0) {
      ctx.fillStyle = `rgba(255,255,255,${(flash.current * 0.55).toFixed(2)})`;
      ctx.fillRect(-20, -20, W + 40, H + 40);
    }
    ctx.restore();
  }, []);

  const frame = useCallback(
    (t: number) => {
      const f = Math.min(t - lastT.current, 50) / 16.667;
      lastT.current = t;

      if (statusRef.current === "playing") {
        const v = speedFor(scoreRef.current);
        scroll.current += v * f;

        // slide towards the chosen wall
        const target = lane.current === 0 ? LANE_L : LANE_R;
        const d = target - px.current;
        px.current += Math.sign(d) * Math.min(Math.abs(d), FLIP_SPEED * f);

        trail.current.unshift(px.current);
        if (trail.current.length > 14) trail.current.pop();

        // advance the world
        bands.current.forEach((b) => (b.y += v * f));
        chips.current.forEach((c) => (c.y += v * f));
        streaks.current.forEach((s) => {
          s.y += v * s.s * f;
          if (s.y - s.l > H) {
            s.y = -10;
            s.x = rand(50, W - 50);
          }
        });
        while (bands.current.length === 0 || bands.current[bands.current.length - 1].y > -260) spawn();

        // collisions + scoring
        for (const b of bands.current) {
          if (b.y < PY + HR && b.y + b.h > PY - HR) {
            const hit = b.side === 0 ? px.current - HR < SPIKE_HIT : px.current + HR > W - SPIKE_HIT;
            if (hit) {
              die();
              break;
            }
          }
          if (!b.done && b.y > PY + HR + 4) {
            b.done = true;
            addScore(1);
          }
        }
        if (!dead.current) {
          chips.current = chips.current.filter((c) => {
            const r = c.mid ? 22 : 16;
            const dx = c.x - px.current;
            const dy = c.y - PY;
            if (dx * dx + dy * dy < r * r) {
              addScore(1);
              burst(c.x, c.y, c.mid ? 190 : 185, c.mid ? 16 : 10, 3);
              pops.current.push({ x: c.x, y: c.y - 10, t: 30, text: c.mid ? "+1 AIR" : "+1", hue: 185 });
              return false;
            }
            return c.y < H + 30;
          });
          bands.current = bands.current.filter((b) => b.y < H + 20);
        }
      }

      // effects keep animating, even after the run ends
      sparks.current.forEach((s) => {
        s.x += s.vx * f;
        s.y += s.vy * f;
        s.vy += 0.12 * f;
        s.life += f;
      });
      sparks.current = sparks.current.filter((s) => s.life < s.max);
      pops.current.forEach((p) => {
        p.y -= 0.7 * f;
        p.t -= f;
      });
      pops.current = pops.current.filter((p) => p.t > 0);
      if (shake.current > 0) shake.current = Math.max(0, shake.current - 0.9 * f);
      if (flash.current > 0) flash.current = Math.max(0, flash.current - 0.06 * f);

      draw();

      const fx = sparks.current.length > 0 || pops.current.length > 0 || shake.current > 0.3 || flash.current > 0;
      if (statusRef.current === "playing" || fx) {
        raf.current = requestAnimationFrame(frame);
      } else {
        raf.current = null;
      }
    },
    [addScore, burst, die, draw, spawn]
  );

  const reset = useCallback(() => {
    px.current = LANE_L;
    lane.current = 0;
    bands.current = [];
    chips.current = [];
    sparks.current = [];
    pops.current = [];
    trail.current = [];
    scroll.current = 0;
    shake.current = 0;
    flash.current = 0;
    dead.current = false;
    scoreRef.current = 0;
    setScore(0);
    while (bands.current.length === 0 || bands.current[bands.current.length - 1].y > -260) spawn();
  }, [spawn]);

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

  // tap: flip to the other wall
  const flip = useCallback(() => {
    if (statusRef.current !== "playing") return;
    const from = lane.current;
    lane.current = (1 - from) as 0 | 1;
    const x = px.current;
    burst(x, PY, hueFor(scoreRef.current), 8, 2.4);

    // a last-second dodge pays a bonus: leaving a wall just as its spikes arrive
    for (const b of bands.current) {
      if (b.close || b.side !== from) continue;
      const dist = PY - (b.y + b.h);
      if (dist >= -2 && dist < 38) {
        b.close = true;
        addScore(2);
        shake.current = Math.max(shake.current, 5);
        pops.current.push({ x: W / 2, y: PY - 34, t: 34, text: "CLOSE CALL +2", hue: 330 });
        break;
      }
    }
  }, [addScore, burst]);

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

  const onPointerDown = () => flip();

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
      aria-label="FLIP.EXE, a small wall-runner game. Tap to flip to the other wall and dodge the spikes."
      data-cursor="disable"
    >
      <div className="stackgame-bar">
        <span className="stackgame-title">&gt; FLIP.EXE</span>
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
                <b>FLIP THE WALLS</b>
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
                <b>SIGNAL LOST · {pad(score)}</b>
                <span className="stackgame-blink">TAP TO RETRY</span>
              </>
            )}
          </div>
        )}
        <div className="stackgame-scan" aria-hidden="true" />
      </div>
      <p className="stackgame-hint">TAP TO FLIP · CATCH THE AIR CHIPS</p>
    </div>
  );
};

export default FlipGame;
