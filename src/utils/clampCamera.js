// Camera clamping
export function clampCamera(offsetX, offsetY, worldWidth, worldHeight, canvas) {
  return {
    x: Math.max(0, Math.min(offsetX, worldWidth - canvas.width)),
    y: Math.max(0, Math.min(offsetY, worldHeight - canvas.height))
  };
}