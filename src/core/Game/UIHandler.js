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

  // Always draw production timers
  this.bases.forEach(base => {
    const factoryManager = base.compositeBase?.factoryManager;
    if (factoryManager) {
      Object.values(factoryManager.productionOverlays).forEach(overlay => {
        overlay.draw(this.ctx, offsetX, offsetY);
      });
    }
  });

  // Panel UI — only when hovered
  const activeBase = this.bases.find(base =>
    base.compositeBase?.garageUI?.showGrid ||
    base.compositeBase?.factoryManager?.showGrid ||
    base.compositeBase?.towerManager?.showGrid  // ← tower
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