import { CanvasResizer } from './CanvasResizer.js';
import { detectBrowserZoom } from './ZoomDetector.js';

export class ResizeHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.pending = false;
        this.lastZoom = detectBrowserZoom();
    }

    setupResizeListener() {
        window.addEventListener("resize", () => {
            if (!this.pending) {
                this.pending = true;
                requestAnimationFrame(() => {
                    CanvasResizer.resize(this.canvas, this.ctx);
                    this.pending = false;
                });
            }
        });
    }

    setupZoomListener() {
        window.addEventListener("scroll", () => {
            const currentZoom = detectBrowserZoom();
            if (Math.abs(currentZoom - this.lastZoom) > 0.05) {
                this.lastZoom = currentZoom;
                CanvasResizer.resize(this.canvas, this.ctx);
            }
        });
    }

    setupAllListeners() {
        this.setupResizeListener();
        this.setupZoomListener();
    }
}