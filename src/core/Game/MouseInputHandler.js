export class MouseInputHandler {
    constructor(canvas, camera, bases) {
        this.canvas = canvas;
        this.camera = camera;
        this.bases = bases;
    }

    getMouseCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const renderInfo = this.camera.getRenderingInfo();
        
        let mouseX = event.clientX - rect.left;
        let mouseY = event.clientY - rect.top;
        
        // Adjust for black bars if present
        if (renderInfo.useBlackBars) {
            mouseX = (mouseX - renderInfo.offsetX) * (this.camera.viewW / renderInfo.renderWidth);
            mouseY = (mouseY - renderInfo.offsetY) * (this.camera.viewH / renderInfo.renderHeight);
        }
        
        return {
            x: mouseX + (this.camera.offsetX || 0),
            y: mouseY + (this.camera.offsetY || 0)
        };
    }

    forEachCompositeBase(method, ...args) {
        return this.bases.map(base => base.compositeBase?.[method]?.(...args));
    }

    handleMouseMove(event) {
        const { x, y } = this.getMouseCoordinates(event);
        this.forEachCompositeBase('handleMouseMove', x, y);
    }

    handleClick(event) {
        const { x, y } = this.getMouseCoordinates(event);
        this.forEachCompositeBase('handleClick', x, y);
    }
}