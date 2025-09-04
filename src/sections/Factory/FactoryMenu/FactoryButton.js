export class FactoryButton {
  constructor(factory, panelX, panelY, row, col) {
    this.factory = factory;
    this.buttonWidth = 70;
    this.buttonHeight = 40;
    this.buttonSpacing = 5;
    this.buttonX = panelX + 10 + col * (this.buttonWidth + this.buttonSpacing);
    this.buttonY = panelY + 25 + row * (this.buttonHeight + this.buttonSpacing);
  }

  draw(ctx, offsetX, offsetY) {
    const x = this.buttonX - offsetX;
    const y = this.buttonY - offsetY;
    const factory = this.factory;

    let buttonColor = "rgba(70, 130, 180, 0.8)";
    if (factory.level >= factory.maxLevel) {
      buttonColor = "rgba(34, 139, 34, 0.8)";
    }

    ctx.fillStyle = buttonColor;
    ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);

    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.buttonWidth, this.buttonHeight);

    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(factory.name.split(' ')[0], x + this.buttonWidth / 2, y + 12);

    ctx.font = "9px Arial";
    if (factory.level >= factory.maxLevel) {
      ctx.fillText(`Level ${factory.level} MAX`, x + this.buttonWidth / 2, y + 24);
    } else {
      ctx.fillText(`Level ${factory.level}`, x + this.buttonWidth / 2, y + 24);
      ctx.fillText(`→ Level ${factory.level + 1}`, x + this.buttonWidth / 2, y + 35);
    }
  }

  isPointInside(mouseX, mouseY, offsetX, offsetY) {
    return mouseX >= this.buttonX + offsetX && mouseX <= this.buttonX + this.buttonWidth + offsetX &&
           mouseY >= this.buttonY + offsetY && mouseY <= this.buttonY + this.buttonHeight + offsetY;
  }
}