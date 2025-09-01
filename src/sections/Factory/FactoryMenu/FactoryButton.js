export class FactoryButton {
  constructor(factory, panelX, panelY, row, col) {
    this.factory = factory;
    this.panelX = panelX;
    this.panelY = panelY;
    this.row = row;
    this.col = col;
    
    // Calculate button position relative to panel
    this.buttonWidth = 70;
    this.buttonHeight = 40;
    this.buttonSpacing = 5;
    this.buttonX = panelX + 10 + col * (this.buttonWidth + this.buttonSpacing);
    this.buttonY = panelY + 25 + row * (this.buttonHeight + this.buttonSpacing);
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.buttonX - offsetX;
    const y = this.buttonY - offsetY;
    const width = this.buttonWidth;
    const height = this.buttonHeight;
    const factory = this.factory;
    const maxPossibleLevel = factory.maxLevel;

    // Button background
    let buttonColor = "rgba(70, 130, 180, 0.8)";
    if (factory.upgrading) {
      buttonColor = "rgba(255, 165, 0, 0.8)";
    } else if (factory.level >= maxPossibleLevel) {
      buttonColor = "rgba(34, 139, 34, 0.8)";
    }

    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, width, height);

    // Button border
    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    // Factory name
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      factory.name.split(' ')[0],
      x + width / 2,
      y + 12
    );

    // Level info
    ctx.font = "9px Arial";
    if (factory.upgrading) {
      const timeLeft = factory.getRemainingUpgradeTime();
      ctx.fillText(`${timeLeft}s...`, x + width / 2, y + 24);
    } else if (factory.level >= maxPossibleLevel) {
      ctx.fillText(`Level ${factory.level} MAX`, x + width / 2, y + 24);
    } else {
      ctx.fillText(`Level ${factory.level}`, x + width / 2, y + 24);
      ctx.fillText(`→ Level ${factory.level + 1}`, x + width / 2, y + 35);
    }

    // Store button bounds for click detection
    factory.buttonBounds = {
      x: x + offsetX,
      y: y + offsetY,
      width: width,
      height: height
    };
  }

  isPointInside(mouseX, mouseY, offsetX, offsetY) {
    const bounds = {
      x: this.buttonX + offsetX,
      y: this.buttonY + offsetY,
      width: this.buttonWidth,
      height: this.buttonHeight
    };
    
    return (
      mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
      mouseY >= bounds.y && mouseY <= bounds.y + bounds.height
    );
  }
}