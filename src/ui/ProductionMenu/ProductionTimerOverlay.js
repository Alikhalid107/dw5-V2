import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig';

export class ProductionTimerOverlay {
  constructor(factory, config = UNIVERSAL_PANEL_CONFIG.PRODUCTION_TIMER) {
    this.factory = factory;
    this.config = config;
    this.overlayWidth = this.config.dimensions.width;
    this.overlayHeight = this.config.dimensions.height;
  }

  draw(ctx, offsetX, offsetY) {
    if (!this.factory.isProducing && !this.factory.showProductionComplete) return;

    const overlayX = this.factory.x + (this.factory.width / 2) - (this.overlayWidth / 2) - (offsetX || 0);
    const overlayY = this.factory.y - this.config.dimensions.offsetY - (offsetY || 0);

    // Validate coordinates
    if (!isFinite(overlayX) || !isFinite(overlayY)) return;

     if (this.factory.isProducing) {
      this.drawTimerOverlay(ctx, overlayX, overlayY);
    }
  }

  drawTimerOverlay(ctx, x, y) {
    // Background with gradient from config
    const gradient = ctx.createLinearGradient(x, y, x, y + this.overlayHeight);
    gradient.addColorStop(0, this.config.styling.backgroundGradient.start);
    gradient.addColorStop(1, this.config.styling.backgroundGradient.end);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.overlayWidth, this.overlayHeight);

    // Timer text
    const timeText = this.factory.getFormattedProductionTime();
    ctx.fillStyle = this.config.styling.textColor;
    ctx.font = this.config.styling.font;
    ctx.textAlign = this.config.styling.textAlign;
    ctx.fillText(timeText, x + this.overlayWidth / 2, y + this.overlayHeight / 2 + 4);
  }


  // Helper method to check if overlay should be visible
  shouldShow() {
    return this.factory.isProducing || this.factory.showProductionComplete;
  }

  // Get overlay bounds for potential click detection
  getBounds(offsetX = 0, offsetY = 0) {
    if (!this.shouldShow()) return null;
    
    return {
      x: this.factory.x + (this.factory.width / 2) - (this.overlayWidth / 2) - offsetX,
      y: this.factory.y - this.config.dimensions.offsetY - offsetY,
      width: this.overlayWidth,
      height: this.overlayHeight
    };
  }
}