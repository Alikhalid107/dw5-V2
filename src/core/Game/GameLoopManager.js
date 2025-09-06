import { drawWithZoomAware } from "../canvasSetup/canvasSetup.js";

export class GameLoopManager {
    constructor(ctx, camera, objectManager, uiHandler) {
        this.ctx = ctx;
        this.camera = camera;
        this.objectManager = objectManager;
        this.uiHandler = uiHandler;
        this.lastTime = 0;
    }

    gameLoop(currentTime) {
        const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
        this.lastTime = currentTime;

        this.objectManager.update(deltaTime);
        this.renderFrame();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    renderFrame() {
        // Zoom-aware rendering
        drawWithZoomAware(this.ctx, this.camera, (ctx, renderInfo) => {
            ctx.clearRect(0, 0, renderInfo.renderWidth, renderInfo.renderHeight);

            const drawList = this.objectManager.getDrawObjects();
            
            drawList
                .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
                .forEach(obj => {
                    obj.draw?.(
                        ctx, 
                        this.camera.offsetX, 
                        this.camera.offsetY, 
                        renderInfo.renderWidth, 
                        renderInfo.renderHeight
                    );
                });
        });

        this.uiHandler.drawUI();
    }

    start() {
        requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
    }
}