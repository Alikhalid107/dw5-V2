export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
    
    // Get panel configuration from factory properties or use defaults
    const panelConfig = factory.panelConfig 
    
    // Set panel properties from config
    this.panelWidth = panelConfig.panelWidth;
    this.panelHeight = panelConfig.panelHeight;
    this.panelOffsetX = panelConfig.panelOffsetX;
    this.panelOffsetY = panelConfig.panelOffsetY;
    
    // Button properties
    this.buttonWidth = 60;
    this.buttonHeight = 30;
    this.buttonBounds = null;
    this.isButtonHovered = false;
  }

  calculatePanelPosition(factory) {
    // Use manual offsets instead of complex calculations
    const factoryCenterX = factory.x + (factory.width / 2);
    const panelX = factoryCenterX + this.panelOffsetX - (this.panelWidth / 2);
    const panelY = factory.y + this.panelOffsetY;
    
    return { x: panelX, y: panelY };
  }

  draw(ctx, offsetX, offsetY, factory) {
    const pos = this.calculatePanelPosition(factory);
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

    const gradient = ctx.createLinearGradient(x, y, x, y + this.panelHeight);
    gradient.addColorStop(0, 'rgba(21, 59, 70, 0.85)');
    gradient.addColorStop(1, 'rgba(21, 59, 70, 0.75)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.panelWidth, this.panelHeight);

    // Border
    // ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    // ctx.lineWidth = 1;
    // ctx.strokeRect(x, y, this.panelWidth, this.panelHeight);
  }

  drawContent(ctx, x, y, factory) {
    // Label
    ctx.fillStyle = "white";
    ctx.font = "700 12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(factory.name.replace(' Factory', ''), x + 10, y + 25);

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
    ctx.fillStyle = buttonColor;
    ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

    // ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    // ctx.lineWidth = 1;
    // ctx.strokeRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);

    // Button text
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    
    const textY = buttonY + this.buttonHeight / 2 + 4;
    const buttonText = factory.upgrading ? "Upgrading..." : factory.isMaxLevel() ? "MAX" : "UPGRADE";
    ctx.fillText(buttonText, buttonX + this.buttonWidth / 2, textY);

    // Progress bar
    if (factory.upgrading) {
      const progress = factory.getUpgradeProgress();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(buttonX, buttonY + this.buttonHeight - 3, this.buttonWidth * progress, 3);
    }

    // Hover effect
    if (this.isButtonHovered) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(buttonX, buttonY, this.buttonWidth, this.buttonHeight);
    }
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0) {
    if (!this.buttonBounds) return false;
    
    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;
    const b = this.buttonBounds;
    
    const inside = adjustedX >= b.x && adjustedX <= b.x + b.width &&
                   adjustedY >= b.y && adjustedY <= b.y + b.height;
    
    return inside && !this.factory.upgrading && !this.factory.isMaxLevel();
  }

  updateHoverState(mouseX, mouseY) {
    if (!this.buttonBounds) {
      this.isButtonHovered = false;
      return;
    }
    
    const b = this.buttonBounds;
    this.isButtonHovered = mouseX >= b.x && mouseX <= b.x + b.width &&
                           mouseY >= b.y && mouseY <= b.y + b.height;
  }
}