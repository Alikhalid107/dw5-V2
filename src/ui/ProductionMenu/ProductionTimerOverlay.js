export class ProductionTimerOverlay {
  constructor(factory) {
    this.factory = factory;
    this.overlayWidth = 100;
    this.overlayHeight = 40;
  }

  draw(ctx, offsetX, offsetY) {
    if (!this.factory.isProducing && !this.factory.showProductionComplete) return;

    const overlayX = this.factory.x + (this.factory.width / 2) - (this.overlayWidth / 2) - (offsetX || 0);
    const overlayY = this.factory.y - 40 - (offsetY || 0);

    // Validate coordinates
    if (!isFinite(overlayX) || !isFinite(overlayY)) return;

    if (this.factory.showProductionComplete) {
      this.drawCompletedOverlay(ctx, overlayX, overlayY);
    } else {
      this.drawTimerOverlay(ctx, overlayX, overlayY);
    }
  }

  drawTimerOverlay(ctx, x, y) {
    // Background with slight transparency
    const gradient = ctx.createLinearGradient(x, y, x, y + this.overlayHeight);
    gradient.addColorStop(0, 'rgba(87, 138, 173, 0.7)');
    gradient.addColorStop(1, 'rgba(87, 138, 173, 0.7)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.overlayWidth, this.overlayHeight);

   
    // Timer text
    const timeText = this.factory.getFormattedProductionTime();
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
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
      y: this.factory.y - 40 - offsetY,
      width: this.overlayWidth,
      height: this.overlayHeight
    };
  }
}