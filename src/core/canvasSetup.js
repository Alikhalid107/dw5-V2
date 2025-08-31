export function setupCanvas(canvas) {
  if (!canvas) throw new Error("setupCanvas: canvas element required");
  
  const ctx = canvas.getContext('2d', { alpha: false });

  function resize() {
    const cssW = Math.max(1, Math.floor(window.innerWidth));
    const cssH = Math.max(1, Math.floor(window.innerHeight));
    const dpr = window.devicePixelRatio || 1;

    // Set CSS and backing store sizes
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    // Reset and scale context
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Save metadata
    canvas._dpr = dpr;
    canvas._cssWidth = cssW;
    canvas._cssHeight = cssH;

    // Disable image smoothing
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) {
      ctx.webkitImageSmoothingEnabled = false;
    }
  }

  resize();

  // Throttled resize handler
  let pending = false;
  window.addEventListener("resize", () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(() => {
        resize();
        pending = false;
      });
    }
  });

  return ctx;
}