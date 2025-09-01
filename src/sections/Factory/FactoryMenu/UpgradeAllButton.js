export class UpgradeAllButton {
  constructor(factoryManager, buttonX, buttonY) {
    Object.assign(this, {
      factoryManager,
      upgradingAll: false,
      upgradeAllTimer: 0,
      upgradeAllTime: 1000,
      buttonWidth: 140,
      buttonHeight: 25,
      buttonX: buttonX - 70, // Center button
      buttonY,
      buttonBounds: null
    });
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.buttonX - (offsetX || 0);
    const y = this.buttonY - (offsetY || 0);
    const { buttonWidth: w, buttonHeight: h } = this;

    // Button styling
    const buttonColor = this.upgradingAll ? "rgba(255, 165, 0, 0.8)" : "rgba(70, 130, 180, 0.8)";
    
    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    // Button text
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    const text = this.upgradingAll 
      ? `Upgrading All... ${Math.max(0, Math.ceil((this.upgradeAllTime - this.upgradeAllTimer) / 1000))}s`
      : "Base Extension";
    
    ctx.fillText(text, x + w / 2, y + 15);

    // Store bounds for click detection
    this.buttonBounds = { x: x + (offsetX || 0), y: y + (offsetY || 0), width: w, height: h };
  }

  update(deltaTime) {
    if (!this.upgradingAll) return false;
    
    this.upgradeAllTimer += deltaTime;
    return this.upgradeAllTimer >= this.upgradeAllTime;
  }

  startUpgrade() {
    if (this.upgradingAll) return false;
    
    const canUpgradeAny = Object.values(this.factoryManager.factories)
      .some(factory => !factory.isMaxLevel());
    
    if (!canUpgradeAny) return false;
    
    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    return true;
  }

  completeUpgrade() {
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
  }

  isPointInside(mouseX, mouseY, offsetX = 0, offsetY = 0) {
    return this.buttonBounds 
      ? this.checkBounds(mouseX, mouseY, this.buttonBounds)
      : this.isPointInsideWorld(mouseX, mouseY);
  }

  isPointInsideWorld(mouseX, mouseY) {
    return this.checkBounds(mouseX, mouseY, {
      x: this.buttonX,
      y: this.buttonY,
      width: this.buttonWidth,
      height: this.buttonHeight
    });
  }

  checkBounds(mouseX, mouseY, bounds) {
    return mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
           mouseY >= bounds.y && mouseY <= bounds.y + bounds.height;
  }
}