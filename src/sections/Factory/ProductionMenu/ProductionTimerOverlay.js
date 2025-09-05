export class ProductionTimerOverlay {
  constructor(factory) {
    this.factory = factory;
    this.overlayWidth = 80;
    this.overlayHeight = 30;
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
    gradient.addColorStop(0, 'rgba(40, 80, 40, 0.9)');
    gradient.addColorStop(1, 'rgba(20, 60, 20, 0.9)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.overlayWidth, this.overlayHeight);

    // Border
    ctx.strokeStyle = 'rgba(100, 255, 100, 0.8)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.overlayWidth, this.overlayHeight);

    // Timer text
    const timeText = this.factory.getFormattedProductionTime();
    ctx.fillStyle = "white";
    ctx.font = "bold 11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(timeText, x + this.overlayWidth / 2, y + this.overlayHeight / 2 + 4);

    // Small production icon/indicator
    ctx.fillStyle = "rgba(100, 255, 100, 0.8)";
    ctx.fillRect(x + 2, y + 2, 4, 4);
  }

  drawCompletedOverlay(ctx, x, y) {
    // Completed background with green color
    const gradient = ctx.createLinearGradient(x, y, x, y + this.overlayHeight);
    gradient.addColorStop(0, 'rgba(40, 120, 40, 0.95)');
    gradient.addColorStop(1, 'rgba(20, 100, 20, 0.95)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.overlayWidth, this.overlayHeight);

    // Border
    ctx.strokeStyle = 'rgba(150, 255, 150, 0.9)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, this.overlayWidth, this.overlayHeight);

    // Checkmark and "Complete" text
    ctx.fillStyle = "white";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("✓ Complete", x + this.overlayWidth / 2, y + this.overlayHeight / 2 + 3);
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