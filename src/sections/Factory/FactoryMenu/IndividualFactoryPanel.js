export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
<<<<<<< HEAD
=======

>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    this.panelWidth = 200;
    this.panelHeight = 120;
    this.buttonWidth = 60;
    this.buttonHeight = 30;
<<<<<<< HEAD
=======
    this.buttonSpacing = 1;
    this.labelHeight = 60;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    this.buttonBounds = null;
    this.isButtonHovered = false;
  }

  calculatePanelPosition(factory) {
<<<<<<< HEAD
    // Fix potential NaN/undefined values that cause gradient errors
    const factoryWidth = factory.width || factory.factoryWidth || 0;
    const panelX = (factory.x || 0) + (factoryWidth / 2) - (this.panelWidth / 2);
    const panelY = (factory.y || 0) - this.panelHeight + 10;
=======
    const panelX = factory.x + (factory.factoryWidth / 2) - (this.panelWidth / 2);
    const panelY = factory.y - this.panelHeight + 10;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    return { x: panelX, y: panelY };
  }

  draw(ctx, offsetX, offsetY, factory) {
    const pos = this.calculatePanelPosition(factory);
<<<<<<< HEAD
    const x = pos.x - (offsetX || 0);
    const y = pos.y - (offsetY || 0);

    // Validate coordinates before drawing
    if (!isFinite(x) || !isFinite(y)) return;

    this.drawBackground(ctx, x, y);
    this.drawContent(ctx, x, y, factory);
  }

  drawBackground(ctx, x, y) {
    // Validate gradient coordinates
    if (!isFinite(x) || !isFinite(y)) return;

=======
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.drawGlassmorphismBackground(ctx, x, y);
    this.drawLabel(ctx, x, y, factory);
    this.drawUpgradeButton(ctx, x, y, factory);
  }

  drawGlassmorphismBackground(ctx, x, y) {
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    const gradient = ctx.createLinearGradient(x, y, x, y + this.panelHeight);
    gradient.addColorStop(0, 'rgba(21, 59, 70, 0.85)');
    gradient.addColorStop(1, 'rgba(21, 59, 70, 0.75)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.panelWidth, this.panelHeight);

<<<<<<< HEAD
    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.panelWidth, this.panelHeight);
  }

  drawContent(ctx, x, y, factory) {
    // Label
=======
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.panelWidth, this.panelHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 1, y + 1, this.panelWidth - 2, this.panelHeight - 2);
  }

  drawLabel(ctx, x, y, factory) {
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.fillStyle = "white";
    ctx.font = "700 12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(factory.name.replace(' Factory', ''), x + 10, y + 25);

<<<<<<< HEAD
    // Status
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    const statusText = factory.upgrading 
      ? `Upgrading... ${factory.getRemainingUpgradeTime()}s`
      : factory.isMaxLevel() 
        ? `Level ${factory.level} (MAX)`
        : `Level ${factory.level} → ${factory.level + 1}`;
    ctx.fillText(statusText, x + 10, y + 45);

    // Button
    this.drawButton(ctx, x + 10, y + 60, factory);
  }

  drawButton(ctx, buttonX, buttonY, factory) {
    this.buttonBounds = { x: buttonX, y: buttonY, width: this.buttonWidth, height: this.buttonHeight };

    // Button color based on state
    const colors = {
      upgrading: "rgba(255, 165, 0, 0.8)",
      maxLevel: "rgba(34, 139, 34, 0.8)",
      default: "rgb(82, 122, 151)"
    };
    
    let buttonColor = colors.default;
    if (factory.upgrading) buttonColor = colors.upgrading;
    else if (factory.isMaxLevel()) buttonColor = colors.maxLevel;

    // Draw button
=======
    ctx.font = "12px Arial";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    if (factory.upgrading) {
      ctx.fillText(`Upgrading... ${factory.getRemainingUpgradeTime()}s`, x + 10, y + 45);
    } else if (factory.isMaxLevel()) {
      ctx.fillText(`Level ${factory.level} (MAX)`, x + 10, y + 45);
    } else {
      ctx.fillText(`Level ${factory.level} → ${factory.level + 1}`, x + 10, y + 45);
    }
  }

  drawUpgradeButton(ctx, x, y, factory) {
    const buttonX = x + 10;
    const buttonY = y + this.labelHeight;

    this.buttonBounds = { x: buttonX, y: buttonY, width: this.buttonWidth, height: this.buttonHeight };

    let buttonColor = "rgb(82, 122, 151)";
    if (factory.upgrading) buttonColor = "rgba(255, 165, 0, 0.8)";
    else if (factory.isMaxLevel()) buttonColor = "rgba(34, 139, 34, 0.8)";

>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    ctx.fillStyle = buttonColor;
    ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

<<<<<<< HEAD
    // Button text
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    
    const textY = buttonY + this.buttonHeight / 2 + 4;
    const buttonText = factory.upgrading ? "Upgrading..." : factory.isMaxLevel() ? "MAX" : "UPGRADE";
    ctx.fillText(buttonText, buttonX + this.buttonWidth / 2, textY);

    // Progress bar
=======
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";

    const textY = buttonY + this.buttonHeight / 2 + 4;
    if (factory.upgrading) ctx.fillText("Upgrading...", buttonX + this.buttonWidth / 2, textY);
    else if (factory.isMaxLevel()) ctx.fillText("MAX", buttonX + this.buttonWidth / 2, textY);
    else ctx.fillText("UPGRADE", buttonX + this.buttonWidth / 2, textY);

>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    if (factory.upgrading) {
      const progress = factory.getUpgradeProgress();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(buttonX, buttonY + this.buttonHeight - 3, this.buttonWidth * progress, 3);
    }

<<<<<<< HEAD
    // Hover effect
=======
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    if (this.isButtonHovered) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);
    }
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0) {
    if (!this.buttonBounds) return false;
<<<<<<< HEAD
    
    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;
    const b = this.buttonBounds;
    
    const inside = adjustedX >= b.x && adjustedX <= b.x + b.width &&
                   adjustedY >= b.y && adjustedY <= b.y + b.height;
    
=======
    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;
    const b = this.buttonBounds;
    const inside = adjustedX >= b.x && adjustedX <= b.x + b.width &&
                   adjustedY >= b.y && adjustedY <= b.y + b.height;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    return inside && !this.factory.upgrading && !this.factory.isMaxLevel();
  }

  updateHoverState(mouseX, mouseY) {
<<<<<<< HEAD
    if (!this.buttonBounds) {
      this.isButtonHovered = false;
      return;
    }
    
=======
    if (!this.buttonBounds) { this.isButtonHovered = false; return; }
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    const b = this.buttonBounds;
    this.isButtonHovered = mouseX >= b.x && mouseX <= b.x + b.width &&
                           mouseY >= b.y && mouseY <= b.y + b.height;
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
