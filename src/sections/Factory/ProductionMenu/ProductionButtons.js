import { PanelBase } from './PanelBase.js';

export class ProductionButtons extends PanelBase {
  constructor() {
    super();
    this.prodButtonWidth = 50;
    this.prodButtonHeight = 25;
    this.oneHourButtonBounds = null;
    this.fifteenHourButtonBounds = null;
    this.isOneHourHovered = false;
    this.isFifteenHourHovered = false;
  }

  drawProductionButton(
    ctx,
    x,
    y,
    label,
    isProducing,
    isHovered,
    isDisabled = false
  ) {
    const color = isDisabled
      ? "rgba(100,100,100,0.5)"
      : isProducing
      ? "rgb(180,70,70)"
      : "rgb(82,122,151)";
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.prodButtonWidth, this.prodButtonHeight);

    ctx.fillStyle = isDisabled ? "rgba(255,255,255,0.5)" : "white";
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      label,
      x + this.prodButtonWidth / 2,
      y + this.prodButtonHeight / 2 + 3
    );

    if (isHovered && !isDisabled) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x, y, this.prodButtonWidth, this.prodButtonHeight);
    }
  }

  draw(ctx, x, y, factory) {
    const oneX = x;
    const fifteenX = oneX + this.prodButtonWidth + 10;
    
    this.oneHourButtonBounds = this._bounds(
      oneX,
      y,
      this.prodButtonWidth,
      this.prodButtonHeight
    );
    this.fifteenHourButtonBounds = this._bounds(
      fifteenX,
      y,
      this.prodButtonWidth,
      this.prodButtonHeight
    );

    this.drawProductionButton(
      ctx,
      oneX,
      y,
      "1hr",
      factory.isProducing,
      this.isOneHourHovered
    );
    const canStart15 = factory.canStart15HourProduction();
    this.drawProductionButton(
      ctx,
      fifteenX,
      y,
      "15hr",
      factory.isProducing,
      this.isFifteenHourHovered,
      !canStart15
    );
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    if (this.isPointInBounds(mouseX, mouseY, this.oneHourButtonBounds)) {
      if (!factory.isProducing) {
        factory.startProduction(1);
      } else {
        const wasCapped = factory.startProduction(1);
        if (wasCapped) messageCallback("Capped at 15 hours");
      }
      return true;
    }

    if (this.isPointInBounds(mouseX, mouseY, this.fifteenHourButtonBounds)) {
      if (factory.canStart15HourProduction()) {
        factory.startProduction(15);
      } else {
        messageCallback(
          "Cannot start 15hr production while active (max limit is 15 hours)"
        );
      }
      return true;
    }

    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.isOneHourHovered = this.isPointInBounds(
      mouseX,
      mouseY,
      this.oneHourButtonBounds
    );
    this.isFifteenHourHovered = this.isPointInBounds(
      mouseX,
      mouseY,
      this.fifteenHourButtonBounds
    );
  }
}
