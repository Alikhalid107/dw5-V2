import { EventBus } from "../../events/EventBus.js";
import { CANVAS_EVENTS } from "../../events/EventTypes.js";

export class ZoomMonitor {
    constructor(camera) {
        this.camera = camera;
    }

    startMonitoring() {
        EventBus.on(CANVAS_EVENTS.ZOOM_CHANGED, () => {
            this.camera.updateViewSize();
        });
    }
}