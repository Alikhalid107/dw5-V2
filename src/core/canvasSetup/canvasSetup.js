import { CanvasResizer } from './CanvasResizer.js';
import { ResizeHandler } from './ResizeHandler.js';
import { ZoomAwareRenderer } from './ZoomAwareRenderer.js';

export function setupCanvas(canvas) {
    if (!canvas) throw new Error("setupCanvas: canvas element required");
    
    const ctx = canvas.getContext('2d', { alpha: false });

    // Initial resize
    CanvasResizer.resize(canvas, ctx);

    // Setup event listeners
    const resizeHandler = new ResizeHandler(canvas, ctx);
    resizeHandler.setupAllListeners();

    return ctx;
}

export function drawWithZoomAware(ctx, camera, drawCallback) {
    ZoomAwareRenderer.draw(ctx, camera, drawCallback);
}