import { detectBrowserZoom } from '../../utils/ZoomDetector.js';

export class CanvasResizer {
    static resize(canvas, ctx) {
        const cssW = Math.max(1, Math.floor(window.innerWidth));
        const cssH = Math.max(1, Math.floor(window.innerHeight));
        
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
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Save metadata
        canvas._dpr = dpr;
        canvas._cssWidth = cssW;
        canvas._cssHeight = cssH;
        canvas._zoom = zoom;

        // Enhanced image smoothing settings
        CanvasResizer.setImageSmoothing(ctx, false);
    }

    static setImageSmoothing(ctx, enabled) {
        ctx.imageSmoothingEnabled = enabled;
        if (ctx.webkitImageSmoothingEnabled !== undefined) {
            ctx.webkitImageSmoothingEnabled = enabled;
        }
        if (ctx.mozImageSmoothingEnabled !== undefined) {
            ctx.mozImageSmoothingEnabled = enabled;
        }
        if (ctx.msImageSmoothingEnabled !== undefined) {
            ctx.msImageSmoothingEnabled = enabled;
        }
    }
}