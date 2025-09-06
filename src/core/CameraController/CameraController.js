import { clampCamera } from "../../config/worldConfig.js";
import { ZoomDetector } from "./ZoomDetector.js";
import { RenderingInfoCalculator } from "./RenderingInfoCalculator.js";
import { CameraEventHandlers } from "./CameraEventHandlers.js";

export class CameraController {
    constructor(canvas, worldWidth, worldHeight, viewW, viewH) {
        this.canvas = canvas;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.viewW = viewW || canvas?._cssWidth || window.innerWidth;
        this.viewH = viewH || canvas?._cssHeight || window.innerHeight;
        this.offsetX = 0;
        this.offsetY = 0;
        this.dragging = false;
        this.lastMouse = { x: 0, y: 0 };

        // Zoom detection properties
        this.baseWidth = 1600; // Your native resolution
        this.baseHeight = 900;
        this.minZoomForFullScreen = 0.8; // 80%
        this.currentZoom = ZoomDetector.detectZoomLevel(this.baseWidth);

        this.eventHandlers = new CameraEventHandlers(this);
        this.eventHandlers.addEventListeners(this.canvas);
        
        this.clamp();
    }

    updateViewSize(viewW, viewH) {
        this.viewW = viewW || this.canvas?._cssWidth || window.innerWidth;
        this.viewH = viewH || this.canvas?._cssHeight || window.innerHeight;
        this.currentZoom = ZoomDetector.detectZoomLevel(this.baseWidth);
        this.clamp();
    }

    // Get rendering info based on zoom level
    getRenderingInfo() {
        return RenderingInfoCalculator.calculate(
            this.viewW,
            this.viewH,
            this.baseWidth,
            this.baseHeight,
            this.currentZoom,
            this.minZoomForFullScreen
        );
    }

    clamp() {
        const renderInfo = this.getRenderingInfo();
        const clamped = clampCamera(
            this.offsetX,
            this.offsetY,
            this.worldWidth,
            this.worldHeight,
            { width: renderInfo.renderWidth, height: renderInfo.renderHeight }
        );
        this.offsetX = clamped.x;
        this.offsetY = clamped.y;
    }

    detectZoomLevel() {
    return ZoomDetector.detectZoomLevel(this.baseWidth);
}
}