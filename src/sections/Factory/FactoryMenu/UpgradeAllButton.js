export class UpgradeAllButton {
  constructor(factoryManager, buttonX, buttonY) {
    this.factoryManager = factoryManager;
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
    this.upgradeAllTime = 1000;

    this.buttonWidth = 140;
    this.buttonHeight = 25;
    this.buttonX = buttonX - (this.buttonWidth / 2);
    this.buttonY = buttonY;
    this.buttonBounds = null;
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.buttonX - offsetX;
    const y = this.buttonY - offsetY;
    const w = this.buttonWidth, h = this.buttonHeight;

    let buttonColor = "rgba(70, 130, 180, 0.8)";
    if (this.upgradingAll) buttonColor = "rgba(255, 165, 0, 0.8)";

    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    if (this.upgradingAll) {
      const timeLeft = Math.max(0, Math.ceil((this.upgradeAllTime - this.upgradeAllTimer) / 1000));
      ctx.fillText(`Upgrading All... ${timeLeft}s`, x + w / 2, y + 15);
    } else {
      ctx.fillText("Base Extension", x + w / 2, y + 15);
    }

    this.buttonBounds = { x: x + offsetX, y: y + offsetY, width: w, height: h };
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
    const canUpgradeAny = Object.values(this.factoryManager.factories).some(f => !f.isMaxLevel());
    if (!canUpgradeAny) return false;
    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    return true;
  }

  completeUpgrade() { this.upgradingAll = false; this.upgradeAllTimer = 0; }

  isPointInside(mouseX, mouseY, offsetX, offsetY) {
    if (this.buttonBounds) {
      const b = this.buttonBounds;
      return mouseX >= b.x && mouseX <= b.x + b.width && mouseY >= b.y && mouseY <= b.y + b.height;
    }
    // fallback to world-based check if bounds not available yet
    return this.isPointInsideWorld(mouseX, mouseY);
  }

  isPointInsideWorld(mouseX, mouseY) {
    const x = this.buttonX, y = this.buttonY;
    return mouseX >= x && mouseX <= x + this.buttonWidth && mouseY >= y && mouseY <= y + this.buttonHeight;
  }
}
