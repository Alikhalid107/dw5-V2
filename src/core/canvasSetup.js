export function setupCanvas(canvas) {
  if (!canvas) throw new Error("setupCanvas: canvas element required");
  
  const ctx = canvas.getContext('2d', { alpha: false });

  function resize() {
    const cssW = Math.max(1, Math.floor(window.innerWidth));
    const cssH = Math.max(1, Math.floor(window.innerHeight));
<<<<<<< HEAD
    
    // Enhanced DPR calculation for better zoom handling
    let dpr = window.devicePixelRatio || 1;
    
    // Detect if we're dealing with browser zoom vs actual high-DPI display
    const zoom = detectBrowserZoom();
    
    // For zoom levels, we want to maintain sharpness
    // Adjust DPR to compensate for browser zoom
    if (zoom !== 1) {
      dpr = Math.max(1, dpr * zoom);
    }
    
    // Ensure DPR doesn't get too high (performance vs quality balance)
    dpr = Math.min(dpr, 3);

    // Set CSS size
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    
    // Set backing store size with adjusted DPR
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    // Scale context to match DPR
=======
    const dpr = window.devicePixelRatio || 1;

    // Set CSS and backing store sizes
    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    // Reset and scale context
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Save metadata
    canvas._dpr = dpr;
    canvas._cssWidth = cssW;
    canvas._cssHeight = cssH;
<<<<<<< HEAD
    canvas._zoom = zoom;

    // Enhanced image smoothing settings
=======

    // Disable image smoothing
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.imageSmoothingEnabled = false;
    if (ctx.webkitImageSmoothingEnabled !== undefined) {
      ctx.webkitImageSmoothingEnabled = false;
    }
<<<<<<< HEAD
    if (ctx.mozImageSmoothingEnabled !== undefined) {
      ctx.mozImageSmoothingEnabled = false;
    }
    if (ctx.msImageSmoothingEnabled !== undefined) {
      ctx.msImageSmoothingEnabled = false;
    }
  }

  function detectBrowserZoom() {
    // Multiple methods to detect zoom for better accuracy
    const zoom1 = window.outerWidth / window.innerWidth;
    const zoom2 = window.devicePixelRatio;
    const zoom3 = screen.width / window.innerWidth;
    
    // Use the most reliable method
    if (Math.abs(zoom1 - 1) > 0.1) return zoom1;
    if (Math.abs(zoom2 - 1) > 0.1) return zoom2;
    return 1;
=======
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
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

<<<<<<< HEAD
  // Add zoom detection listener
  let lastZoom = detectBrowserZoom();
  window.addEventListener("scroll", () => {
    const currentZoom = detectBrowserZoom();
    if (Math.abs(currentZoom - lastZoom) > 0.05) {
      lastZoom = currentZoom;
      resize();
    }
  });

  return ctx;
}

// Enhanced drawing helper for zoom-aware rendering
export function drawWithZoomAware(ctx, camera, drawCallback) {
  const renderInfo = camera.getRenderingInfo();
  
  if (renderInfo.useBlackBars) {
    // Clear entire canvas first
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
    
    // Set up clipping region for game content
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      renderInfo.offsetX,
      renderInfo.offsetY,
      renderInfo.renderWidth,
      renderInfo.renderHeight
    );
    ctx.clip();
    
    // Translate for black bar offset
    ctx.translate(renderInfo.offsetX, renderInfo.offsetY);
  }
  
  // Apply quality scaling if needed
  if (renderInfo.qualityMultiplier !== 1) {
    ctx.save();
    ctx.scale(renderInfo.qualityMultiplier, renderInfo.qualityMultiplier);
  }
  
  // Execute the drawing callback
  drawCallback(ctx, renderInfo);
  
  // Restore transformations
  if (renderInfo.qualityMultiplier !== 1) {
    ctx.restore();
  }
  
  if (renderInfo.useBlackBars) {
    ctx.restore();
  }
=======
  return ctx;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
}