import { ZoomDetector } from "../CameraController/ZoomDetector.js";

export class ZoomMonitor {
    constructor(camera) {
        this.camera = camera;
        this.lastZoom = camera.currentZoom;
    }

    startMonitoring() {
        const checkZoom = () => {
            const currentZoom = ZoomDetector.detectZoomLevel(this.camera.baseWidth);
            if (Math.abs(currentZoom - this.lastZoom) > 0.05) {
                this.lastZoom = currentZoom;
                this.camera.updateViewSize();
            }
            requestAnimationFrame(checkZoom);
        };
        checkZoom();
    }
}