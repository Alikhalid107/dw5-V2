export class UpgradeAllButton {
  constructor(factoryManager, panelX, panelY) {
    this.factoryManager = factoryManager;
    this.panelX = panelX;
    this.panelY = panelY;
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
    this.upgradeAllTime = 1;
    
    // Calculate button position relative to panel
    this.buttonWidth = 140;
    this.buttonHeight = 25;
    this.buttonX = panelX + 10;
    this.buttonY = panelY + 130; // Below the factory buttons
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.buttonX - offsetX;
    const y = this.buttonY - offsetY;
    const width = this.buttonWidth;
    const height = this.buttonHeight;

    // Button background
    let buttonColor = "rgba(70, 130, 180, 0.8)";
    if (this.upgradingAll) {
      buttonColor = "rgba(255, 165, 0, 0.8)";
    }

    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, width, height);

    // Button border
    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Button text
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    if (this.upgradingAll) {
      const progress = Math.min(this.upgradeAllTimer / this.upgradeAllTime, 1);
      const timeLeft = Math.max(0, Math.ceil((this.upgradeAllTime - this.upgradeAllTimer) / 1000));
      ctx.fillText(`Upgrading All... ${timeLeft}s`, x + width / 2, y + 15);
    } else {
      ctx.fillText("UPGRADE ALL FACTORIES", x + width / 2, y + 15);
    }

    // Store button bounds for click detection
    this.buttonBounds = {
      x: x + offsetX,
      y: y + offsetY,
      width: width,
      height: height
    };
  }

  update(deltaTime) {
    if (this.upgradingAll) {
      this.upgradeAllTimer += deltaTime;
      return this.upgradeAllTimer >= this.upgradeAllTime;
    }
    return false;
  }

  startUpgrade() {
    if (this.upgradingAll) return false;
    
    // Check if any factory can be upgraded
    const canUpgradeAny = Object.values(this.factoryManager.factories).some(
      factory => !factory.isMaxLevel()
    );
    
    if (!canUpgradeAny) return false;
    
    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    return true;
  }

  completeUpgrade() {
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
  }

  isPointInside(mouseX, mouseY, offsetX, offsetY) {
    if (!this.buttonBounds) return false;
    
    const bounds = this.buttonBounds;
    return (
      mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
      mouseY >= bounds.y && mouseY <= bounds.y + bounds.height
    );
  }
}