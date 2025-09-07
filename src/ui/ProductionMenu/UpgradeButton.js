import { PanelBase } from './PanelBase.js';

export class UpgradeButton extends PanelBase {
  constructor() {
    super();
    this.buttonWidth = 60;
    this.buttonHeight = 30;
    this.buttonBounds = null;
    this.isButtonHovered = false;
  }

  draw(ctx, x, y, factory) {
    this.buttonBounds = this._bounds(x, y, this.buttonWidth, this.buttonHeight);
    const colors = {
      upgrading: "rgba(255, 165, 0, 0.8)",
      maxLevel: "rgba(34, 139, 34, 0.8)",
      default: "rgb(82, 122, 151)",
    };
    let c = colors.default;
    if (factory.upgrading) c = colors.upgrading;
    else if (factory.isMaxLevel()) c = colors.maxLevel;

    ctx.fillStyle = c;
    ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);

    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    const textY = y + this.buttonHeight / 2 + 4;
    const btnText = factory.upgrading
      ? "Upgrading..."
      : factory.isMaxLevel()
      ? "MAX"
      : "UPGRADE";
    ctx.fillText(btnText, x + this.buttonWidth / 2, textY);

    if (factory.upgrading) {
      const p = factory.getUpgradeProgress();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(x, y + this.buttonHeight - 3, this.buttonWidth * p, 3);
    }

    if (this.isButtonHovered) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);
    }
  }

  handleClick(mouseX, mouseY, factory) {
    if (this.isPointInBounds(mouseX, mouseY, this.buttonBounds))
      return !factory.upgrading && !factory.isMaxLevel();
    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.isButtonHovered = this.buttonBounds
      ? this.isPointInBounds(mouseX, mouseY, this.buttonBounds)
      : false;
  }
}