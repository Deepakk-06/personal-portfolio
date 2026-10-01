/** Phones and tablets (matches the 1024px breakpoint used across the site). */
export const isCompactView = () => window.innerWidth <= 1024;

/**
 * Can this device run the 3D character?
 * Needs WebGL and more than ~2 GB of RAM (deviceMemory is Chromium-only;
 * browsers that don't report it are assumed capable).
 */
export const canRenderCharacter = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return false;
  }
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 2) return false;
  return true;
};
