import { PanelBase } from './PanelBase.js';

export class CancelBadges extends PanelBase {
  constructor() {
    super();
    this.cancelButtonSize = 16;
    this.oneHourCancelBounds = null;
    this.fifteenHourCancelBounds = null;
  }

  draw(ctx, oneHourButtonX, fifteenHourButtonX, buttonY, prodButtonWidth) {
    this.drawCancelBadge(ctx, oneHourButtonX, buttonY, "oneHour", prodButtonWidth);
    this.drawCancelBadge(ctx, fifteenHourButtonX, buttonY, "fifteenHour", prodButtonWidth);
  }

  drawCancelBadge(ctx, buttonX, buttonY, which, prodButtonWidth) {
    const bx = buttonX + prodButtonWidth - this.cancelButtonSize;
    const by = buttonY;
    const bounds = this._bounds(
      bx,
      by,
      this.cancelButtonSize,
      this.cancelButtonSize
    );
    if (which === "oneHour") this.oneHourCancelBounds = bounds;
    else this.fifteenHourCancelBounds = bounds;

    ctx.fillStyle = "rgba(220,20,20,0.9)";
    ctx.fillRect(bx, by, this.cancelButtonSize, this.cancelButtonSize);
    ctx.fillStyle = "white";
    ctx.font = "bold 10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      "✕",
      bx + this.cancelButtonSize / 2,
      by + this.cancelButtonSize / 2 + 3
    );
  }

  handleClick(mouseX, mouseY, factory) {
    if (
      factory.isProducing &&
      (this.isPointInBounds(mouseX, mouseY, this.oneHourCancelBounds) ||
        this.isPointInBounds(mouseX, mouseY, this.fifteenHourCancelBounds))
    ) {
      return true; // Signal that cancel dialog should be shown
    }
    return false;
  }
}
