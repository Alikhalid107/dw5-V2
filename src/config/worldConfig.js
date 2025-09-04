// config/worldConfig.js
export const worldConfig = {
  width: 4000, // 110400 future one final
  height: 3000, //  // 31200 future one final
  minDistance: 100,
  baseCount: 2,   // can extend later
  grassTileSize: 400
};

// Camera clamping
export function clampCamera(offsetX, offsetY, worldWidth, worldHeight, canvas) {
  return {
    x: Math.max(0, Math.min(offsetX, worldWidth - canvas.width)),
    y: Math.max(0, Math.min(offsetY, worldHeight - canvas.height))
  };
}

// Convert screen → world coordinates
export function screenToWorld(x, y, offsetX, offsetY) {
  return { x: x + offsetX, y: y + offsetY };
}
