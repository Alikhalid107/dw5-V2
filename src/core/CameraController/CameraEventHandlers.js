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
        }
    }

    handleMouseUp(e) {
        if (e.button === 2) this.cameraController.dragging = false;
    }

    handleMouseLeave() {
        this.cameraController.dragging = false;
    }

    handleMouseMove(e) {
        if (!this.cameraController.dragging) return;
        
        const dx = e.clientX - this.cameraController.lastMouse.x;
        const dy = e.clientY - this.cameraController.lastMouse.y;
        
        this.cameraController.offsetX -= dx;
        this.cameraController.offsetY -= dy;
        
        this.cameraController.clamp();
        this.cameraController.lastMouse = { x: e.clientX, y: e.clientY };
    }

    handleResize() {
        this.cameraController.updateViewSize();
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