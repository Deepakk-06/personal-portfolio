import { useEffect, useRef } from "react";
import {
  BALL,
  PADDLE_H,
  PADDLE_W,
  PADDLE_X,
  PONG_H,
  PONG_W,
  createPong,
  stepPong,
} from "./utils/pongEngine";

const LIME = "#c6ff00";
const PINK = "#ff2d95";
const SCREEN = "#060809";

const LoaderConsole = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    resize();

    const game = createPong();
    let raf = 0;
    let last = performance.now();
    let blink = 0;

    const draw = () => {
      const sx = canvas.width / PONG_W;
      const sy = canvas.height / PONG_H;
      ctx.setTransform(sx, 0, 0, sy, 0, 0);
      ctx.fillStyle = SCREEN;
      ctx.fillRect(0, 0, PONG_W, PONG_H);

      // centre line
      ctx.fillStyle = "rgba(198,255,0,0.25)";
      for (let y = 2; y < PONG_H; y += 8) ctx.fillRect(PONG_W / 2 - 0.75, y, 1.5, 4);

      // scores
      ctx.fillStyle = "rgba(198,255,0,0.8)";
      ctx.font = "bold 11px monospace";
      ctx.textBaseline = "top";
      ctx.textAlign = "right";
      ctx.fillText(String(game.s1), PONG_W / 2 - 8, 4);
      ctx.textAlign = "left";
      ctx.fillText(String(game.s2), PONG_W / 2 + 8, 4);

      // paddles
      ctx.fillStyle = LIME;
      ctx.fillRect(PADDLE_X, game.p1 - PADDLE_H / 2, PADDLE_W, PADDLE_H);
      ctx.fillRect(PONG_W - PADDLE_X - PADDLE_W, game.p2 - PADDLE_H / 2, PADDLE_W, PADDLE_H);

      // ball (blinks while waiting for the next serve)
      if (game.wait <= 0 || Math.floor(blink / 6) % 2 === 0) {
        ctx.fillStyle = PINK;
        ctx.fillRect(game.bx - BALL / 2, game.by - BALL / 2, BALL, BALL);
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      draw();
      return undefined;
    }

    const loop = (now: number) => {
      const frames = (now - last) / 16.667;
      last = now;
      blink += frames;
      stepPong(game, frames);
      draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="loader-console" aria-hidden="true">
      <span className="lc-dpad" />
      <div className="lc-screen">
        <canvas ref={canvasRef} />
      </div>
      <span className="lc-buttons">
        <i />
        <i />
      </span>
    </div>
  );
};

export default LoaderConsole;
