/**
 * Desktop framing (wide canvas) uses zoom 1.1. On tall/narrow canvases
 * (phones in portrait) the horizontal field of view shrinks, so we zoom out
 * in proportion to keep the character's shoulders in frame.
 */
export const DESKTOP_ZOOM = 1.1;

export const getCameraZoom = (aspect: number) => {
  if (aspect >= 1) return DESKTOP_ZOOM;
  const k = Math.max(0.42, aspect / 1.0);
  return DESKTOP_ZOOM * k;
};
