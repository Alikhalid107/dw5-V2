// canvasSetup.js
export function setupCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  
  // HiDPI support
  const dpr = window.devicePixelRatio || 1;
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = innerWidth + "px";
  canvas.style.height = innerHeight + "px";
  ctx.scale(dpr, dpr);

  ctx.imageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  
  return ctx;
}
