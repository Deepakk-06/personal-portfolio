export const PONG_W = 120;
export const PONG_H = 72;
export const PADDLE_W = 3;
export const PADDLE_H = 14;
export const BALL = 4;
export const PADDLE_X = 6;

export interface PongState {
  bx: number;
  by: number;
  vx: number;
  vy: number;
  p1: number;
  p2: number;
  s1: number;
  s2: number;
  err1: number;
  err2: number;
  speed: number;
  wait: number; // frames left before the next serve
}

const BASE_SPEED = 1.5;
const MAX_SPEED = 2.5;
const PADDLE_SPEED = 1.05;

export function createPong(): PongState {
  const s: PongState = {
    bx: PONG_W / 2,
    by: PONG_H / 2,
    vx: 0,
    vy: 0,
    p1: PONG_H / 2,
    p2: PONG_H / 2,
    s1: 0,
    s2: 0,
    err1: 0,
    err2: 0,
    speed: BASE_SPEED,
    wait: 30,
  };
  return s;
}

function serve(s: PongState, dir: number) {
  s.bx = PONG_W / 2;
  s.by = PONG_H / 2 + (Math.random() - 0.5) * 20;
  s.speed = BASE_SPEED;
  s.vx = dir * s.speed;
  s.vy = (Math.random() - 0.5) * 1.2;
  s.wait = 0;
}

function movePaddle(cur: number, target: number, step: number) {
  const d = target - cur;
  const m = Math.max(-PADDLE_SPEED * step, Math.min(PADDLE_SPEED * step, d));
  const half = PADDLE_H / 2;
  return Math.max(half, Math.min(PONG_H - half, cur + m));
}

/** Advance the game by `frames` (1 frame = 1/60 s). Sub-steps so the ball can never skip a paddle. */
export function stepPong(s: PongState, frames: number) {
  let left = Math.min(frames, 3);
  while (left > 0) {
    const f = Math.min(1, left);
    left -= f;
    tick(s, f);
  }
}

function tick(s: PongState, f: number) {
  const half = BALL / 2;

  if (s.wait > 0) {
    s.wait -= f;
    s.p1 = movePaddle(s.p1, PONG_H / 2, f * 0.6);
    s.p2 = movePaddle(s.p2, PONG_H / 2, f * 0.6);
    if (s.wait <= 0) serve(s, Math.random() < 0.5 ? -1 : 1);
    return;
  }

  s.bx += s.vx * f;
  s.by += s.vy * f;

  // top / bottom walls
  if (s.by < half) {
    s.by = half;
    s.vy = Math.abs(s.vy);
  } else if (s.by > PONG_H - half) {
    s.by = PONG_H - half;
    s.vy = -Math.abs(s.vy);
  }

  // paddles follow the ball only while it is coming towards them
  s.p1 = movePaddle(s.p1, s.vx < 0 ? s.by + s.err1 : PONG_H / 2, f * (s.vx < 0 ? 1 : 0.5));
  s.p2 = movePaddle(s.p2, s.vx > 0 ? s.by + s.err2 : PONG_H / 2, f * (s.vx > 0 ? 1 : 0.5));

  const leftFace = PADDLE_X + PADDLE_W;
  const rightFace = PONG_W - PADDLE_X - PADDLE_W;

  if (s.vx < 0 && s.bx - half <= leftFace && s.bx + half >= PADDLE_X && Math.abs(s.by - s.p1) <= PADDLE_H / 2 + half) {
    bounce(s, s.p1, 1);
    s.bx = leftFace + half;
    s.err2 = (Math.random() - 0.5) * 20;
  } else if (s.vx > 0 && s.bx + half >= rightFace && s.bx - half <= PONG_W - PADDLE_X && Math.abs(s.by - s.p2) <= PADDLE_H / 2 + half) {
    bounce(s, s.p2, -1);
    s.bx = rightFace - half;
    s.err1 = (Math.random() - 0.5) * 20;
  }

  // goals
  if (s.bx < -half) {
    s.s2 += 1;
    afterGoal(s);
  } else if (s.bx > PONG_W + half) {
    s.s1 += 1;
    afterGoal(s);
  }
}

function bounce(s: PongState, paddleY: number, dir: number) {
  s.speed = Math.min(MAX_SPEED, s.speed * 1.05);
  const rel = Math.max(-1, Math.min(1, (s.by - paddleY) / (PADDLE_H / 2 + BALL / 2)));
  s.vy = rel * s.speed * 0.8;
  s.vx = dir * Math.sqrt(Math.max(0.5, s.speed * s.speed - s.vy * s.vy));
}

function afterGoal(s: PongState) {
  s.vx = 0;
  s.vy = 0;
  s.bx = PONG_W / 2;
  s.by = PONG_H / 2;
  s.wait = 40;
  if (s.s1 > 9 || s.s2 > 9) {
    s.s1 = 0;
    s.s2 = 0;
  }
}
