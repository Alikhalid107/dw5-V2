import { EventBus } from "../../events/EventBus.js";
import { CAMERA_EVENTS } from "../../events/EventTypes.js";

export class CameraEventHandlers {
    constructor(cameraController) {
        this.cameraController = cameraController;
    }

    handleContextMenu(e) {
        e.preventDefault();
    }

    handleMouseDown(e) {
        if (e.button === 2) {
            this.cameraController.dragging = true;
            this.cameraController.lastMouse = { x: e.clientX, y: e.clientY };
            
            // Emit event for mouse down
            EventBus.emit(CAMERA_EVENTS.DRAG_START, {
                x: e.clientX,
                y: e.clientY
            });
        }
    }

    handleMouseUp(e) {
        if (e.button === 2) {
            this.cameraController.dragging = false;
            
            // Emit event for mouse up
            EventBus.emit(CAMERA_EVENTS.DRAG_END);
        }
    }

    handleMouseLeave() {
        if (this.cameraController.dragging) {
            this.cameraController.dragging = false;
            EventBus.emit(CAMERA_EVENTS.DRAG_END);
        }
    }

    handleMouseMove(e) {
        if (!this.cameraController.dragging) return;
        
        const dx = e.clientX - this.cameraController.lastMouse.x;
        const dy = e.clientY - this.cameraController.lastMouse.y;
        
        // Emit drag event instead of direct manipulation
        EventBus.emit(CAMERA_EVENTS.DRAG, { 
            dx, 
            dy,
            mouseX: e.clientX,
            mouseY: e.clientY
        });
        
        this.cameraController.lastMouse = { x: e.clientX, y: e.clientY };
    }

    handleResize() {
        // Emit resize event
        EventBus.emit(CAMERA_EVENTS.RESIZE);
    }

    addEventListeners(canvas) {
        if (!canvas) return;

        canvas.addEventListener("contextmenu", this.handleContextMenu.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        window.addEventListener("resize", this.handleResize.bind(this));
    }
}