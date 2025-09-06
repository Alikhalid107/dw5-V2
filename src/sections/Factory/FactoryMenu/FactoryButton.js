export class UpgradeButton {
  constructor() {
    this.buttonWidth = 80;
    this.buttonHeight = 30;
    this.isButtonHovered = false;
    this.buttonBounds = null;
  }

  draw(ctx, x, y, factory) {
    // Update button bounds for click detection
    this.buttonBounds = { x, y, width: this.buttonWidth, height: this.buttonHeight };

    // Determine button appearance
    const isMaxLevel = factory.level >= factory.maxLevel;
    const buttonColor = isMaxLevel ? "rgba(34, 139, 34, 0.8)" 
                       : this.isButtonHovered ? "rgba(100, 150, 200, 0.9)" 
                       : "rgba(70, 130, 180, 0.8)";

    // Draw button
    ctx.fillStyle = buttonColor;
    this._drawRoundedRect(ctx, x, y, this.buttonWidth, this.buttonHeight, 5);
    ctx.fill();

    // Draw border
    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    this._drawRoundedRect(ctx, x, y, this.buttonWidth, this.buttonHeight, 5);
    ctx.stroke();

    // Draw text
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const centerX = x + this.buttonWidth / 2;
    const centerY = y + this.buttonHeight / 2;

    if (isMaxLevel) {
      ctx.font = "10px Arial";
      ctx.fillText("MAX LEVEL", centerX, centerY);
    } else {
      ctx.font = "10px Arial";
      ctx.fillText("UPGRADE", centerX, centerY - 5);
      ctx.font = "8px Arial";
      ctx.fillText(`Lv${factory.level} → Lv${factory.level + 1}`, centerX, centerY + 5);
    }

    // Reset canvas state
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
  }

  handleClick(mouseX, mouseY, factory) {
    // Check if click is within button bounds
    const isInBounds = mouseX >= 0 && mouseX <= this.buttonWidth && 
                      mouseY >= 0 && mouseY <= this.buttonHeight;
    
    if (!isInBounds || factory.level >= factory.maxLevel) {
      return isInBounds; // Return true if clicked but at max level
    }

    // Upgrade the factory
    let upgradeSuccess = false;
    const oldLevel = factory.level;

    // Try factory upgrade methods in order of preference
    if (typeof factory.upgrade === 'function') {
      upgradeSuccess = factory.upgrade();
    } else if (typeof factory.upgradeLevel === 'function') {
      upgradeSuccess = factory.upgradeLevel();
    } else {
      // Direct level increment as fallback
      factory.level++;
      upgradeSuccess = factory.level > oldLevel;
    }

    // Update factory visuals
    this._updateFactoryVisuals(factory);

    return true;
  }

  _updateFactoryVisuals(factory) {
    // Call visual update methods if they exist
    if (typeof factory.updateVisuals === 'function') {
      factory.updateVisuals();
    }
    if (typeof factory.onUpgrade === 'function') {
      factory.onUpgrade();
    }
    if (typeof factory.updateSprite === 'function') {
      factory.updateSprite();
    }
  }

  updateHoverState(mouseX, mouseY) {
    if (this.buttonBounds) {
      this.isButtonHovered = this.isPointInBounds(mouseX, mouseY, this.buttonBounds);
    }
  }

  isPointInBounds(x, y, bounds) {
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width && 
           y >= bounds.y && y <= bounds.y + bounds.height;
  }

  _drawRoundedRect(ctx, x, y, width, height, radius = 5) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}