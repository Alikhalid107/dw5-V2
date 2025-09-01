export class UpgradeAllButton {
  constructor(factoryManager, buttonX, buttonY) {
<<<<<<< HEAD
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
    
=======
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

>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);

<<<<<<< HEAD
    // Button text
=======
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

<<<<<<< HEAD
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
=======
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
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
  }

  startUpgrade() {
    if (this.upgradingAll) return false;
<<<<<<< HEAD
    
    const canUpgradeAny = Object.values(this.factoryManager.factories)
      .some(factory => !factory.isMaxLevel());
    
    if (!canUpgradeAny) return false;
    
=======
    const canUpgradeAny = Object.values(this.factoryManager.factories).some(f => !f.isMaxLevel());
    if (!canUpgradeAny) return false;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    return true;
  }

<<<<<<< HEAD
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
=======
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
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
