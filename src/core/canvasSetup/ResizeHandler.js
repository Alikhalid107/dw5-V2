import { CanvasResizer } from './CanvasResizer.js';
import { ZoomDetector } from '../CameraController/ZoomDetector.js';
import { EventBus } from "../../events/EventBus.js";
import { CANVAS_EVENTS } from "../../events/EventTypes.js";

export class ResizeHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.pending = false;
        this.lastZoom = ZoomDetector.detectBrowserZoom();
    }

    setupResizeListener() {
    window.addEventListener("resize", () => {
        if (!this.pending) {
            this.pending = true;
            requestAnimationFrame(() => {
                CanvasResizer.resize(this.canvas, this.ctx);
                EventBus.emit(CANVAS_EVENTS.RESIZED, {
                    width: this.canvas.width,
                    height: this.canvas.height,
                    dpr: this.canvas._dpr
                });
                this.pending = false;
            });
        }
    });
}

    setupZoomListener() {
    window.addEventListener("scroll", () => {
        const currentZoom = ZoomDetector.detectBrowserZoom();
        if (Math.abs(currentZoom - this.lastZoom) > 0.05) {
            this.lastZoom = currentZoom;
            CanvasResizer.resize(this.canvas, this.ctx);
            EventBus.emit(CANVAS_EVENTS.ZOOM_CHANGED, { // ← CORRECT EVENT
                zoom: currentZoom,
                dpr: this.canvas._dpr
            });
        }
    });
}

    setupAllListeners() {
        this.setupResizeListener();
        this.setupZoomListener();
    }
}