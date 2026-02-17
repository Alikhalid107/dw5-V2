export class UIHandler {
    constructor(bases, camera, ctx) {
        this.bases = bases;
        this.camera = camera;
        this.ctx = ctx;
    }

    drawUI() {
    const renderInfo = this.camera.getRenderingInfo();
    let offsetX = this.camera.offsetX;
    let offsetY = this.camera.offsetY;
    
    if (renderInfo.useBlackBars) {
        offsetX = (offsetX - renderInfo.offsetX) * (this.camera.viewW / renderInfo.renderWidth);
        offsetY = (offsetY - renderInfo.offsetY) * (this.camera.viewH / renderInfo.renderHeight);
    }

    // Always draw production timers regardless of hover state
    this.bases.forEach(base => {
        const factoryManager = base.compositeBase?.factoryManager;
        if (factoryManager) {
            Object.values(factoryManager.productionOverlays).forEach(overlay => {
                overlay.draw(this.ctx, offsetX, offsetY);
            });
        }
    });

    // Only draw panels when something is hovered
    const activeBase = this.bases.find(base =>
        base.compositeBase?.garageUI?.showGrid || base.compositeBase?.factoryManager?.showGrid
    );
    if (activeBase) {
        activeBase.compositeBase.drawUI(this.ctx, offsetX, offsetY);
    }

    this.drawMessageDisplays();
}

    drawMessageDisplays() {
        this.bases.forEach(base => {
            const factoryManager = base.compositeBase?.factoryManager;
            if (factoryManager) {
                Object.values(factoryManager.ui?.factoryPanels || {}).forEach(panel => {
                    if (panel.messageDisplay) {
                        panel.messageDisplay.draw(this.ctx);
                    }
                });
            }
        });
    }
}