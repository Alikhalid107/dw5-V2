export class UIHandler {
    constructor(bases, camera, ctx, positioningTool = null) {
        this.bases = bases;
        this.camera = camera;
        this.ctx = ctx;
        this.positioningTool = positioningTool;
    }

    drawUI() {
        const renderInfo = this.camera.getRenderingInfo();
        let offsetX = this.camera.offsetX;
        let offsetY = this.camera.offsetY;

        if (renderInfo.useBlackBars) {
            offsetX = (offsetX - renderInfo.offsetX) * (this.camera.viewW / renderInfo.renderWidth);
            offsetY = (offsetY - renderInfo.offsetY) * (this.camera.viewH / renderInfo.renderHeight);
        }

        // Draw production timers for all composite bases
        this.bases.forEach(base => {
            base.compositeBases?.forEach(cb => {
                const factoryManager = cb?.factoryManager;
                if (factoryManager) {
                    Object.values(factoryManager.productionOverlays).forEach(overlay => {
                        overlay.draw(this.ctx, offsetX, offsetY);
                    });
                }
            });
        });

        // Find active composite base (the one with an open panel)
        let activeCB = null;
        for (const base of this.bases) {
            for (const cb of base.compositeBases ?? []) {
                if (
                    cb?.garageUI?.showGrid ||
                    cb?.factoryManager?.showGrid ||
                    cb?.towerManager?.showGrid ||
                    cb?.extensionManager?.showGrid ||
                    cb?.commandManager?.showGrid
                ) {
                    activeCB = cb;
                    break;
                }
            }
            if (activeCB) break;
        }

        if (activeCB) {
            activeCB.drawUI(this.ctx, offsetX, offsetY);
        }

        // Draw positioning tool overlay
        if (this.positioningTool) {
            this.positioningTool.draw(this.ctx, offsetX, offsetY);
        }

        this.drawMessageDisplays();
    }

    drawMessageDisplays() {
        this.bases.forEach(base => {
            base.compositeBases?.forEach(cb => {
                const factoryManager = cb?.factoryManager;
                if (factoryManager) {
                    Object.values(factoryManager.ui?.factoryPanels || {}).forEach(panel => {
                        if (panel.messageDisplay) {
                            panel.messageDisplay.draw(this.ctx);
                        }
                    });
                }
            });
        });
    }
}