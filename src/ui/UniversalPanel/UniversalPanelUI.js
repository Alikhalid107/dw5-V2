import { UniversalPanelPositionCalculator } from "./UniversalPanelPositionCalculator.js";
import { UniversalPanelBackground } from "./UniversalPanelBackground.js";
import { UniversalBoxFactory } from "./UniversalBoxFactory.js";

export class UniversalPanelUI {
  constructor(
    panelType,
    flakManager,
    garageX,
    garageY,
    garageWidth,
    garageHeight,
    config,
    textConfig
  ) {
    this.panelType = panelType;
    this.flakManager = flakManager; // Can be null for non-garage panels
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.showPanel = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    this.config = config;
    this.gridConfig = config.gridConfig;
    this.panelConfig = config.panelConfig;
    this.styling = config.styling;
    this.textConfig = textConfig;

    this.useIndependentMouseHandling = true; // Set this to true

    this.panelWidth =
      this.gridConfig.cols *
        (this.gridConfig.boxWidth + this.gridConfig.spacing) -
      this.gridConfig.spacing +
      4;
    this.panelHeight =
      this.gridConfig.padding +
      this.gridConfig.rows *
        (this.gridConfig.boxHeight + this.gridConfig.spacing) -
      this.gridConfig.spacing +
      this.gridConfig.padding;
    this.panelBounds = null;
    this.boxes = UniversalBoxFactory.createBoxes(
      this,
      this.gridConfig,
      panelType,
      textConfig,
      this.styling
    );
  }

  calculatePanelPosition() {
    return UniversalPanelPositionCalculator.calculate(
      this.garageX,
      this.garageY,
      this.garageWidth,
      this.garageHeight,
      this.panelWidth,
      this.panelConfig
    );
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.showPanel) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.panelBounds = {
      x: pos.x,
      y: pos.y,
      width: this.panelWidth,
      height: this.panelHeight,
    };
    UniversalPanelBackground.draw(
      ctx,
      x,
      y,
      this.panelWidth,
      this.panelHeight,
      this.styling
    );
    this.drawBoxes(ctx, x, y);

    // In UniversalPanelUI.drawUI(), add after calculating position:
    const hoverArea = this.getHoverArea();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      hoverArea.x - offsetX,
      hoverArea.y - offsetY,
      hoverArea.width,
      hoverArea.height
    );
  }

  drawBoxes(ctx, panelX, panelY) {
    this.boxes.forEach((box) => box.draw(ctx, panelX, panelY));
  }

  handleMouseMove(mouseX, mouseY) {
    const hoverArea = this.getHoverArea();
    const isOverHoverArea =
      mouseX >= hoverArea.x &&
      mouseX <= hoverArea.x + hoverArea.width &&
      mouseY >= hoverArea.y &&
      mouseY <= hoverArea.y + hoverArea.height;

    const isOverPanel =
      this.panelBounds &&
      mouseX >= this.panelBounds.x &&
      mouseX <= this.panelBounds.x + this.panelBounds.width &&
      mouseY >= this.panelBounds.y &&
      mouseY <= this.panelBounds.y + this.panelBounds.height;

    this.showPanel = isOverHoverArea || isOverPanel;

    if (this.showPanel) {
      this.boxes.forEach((box) => box.updateHoverState(mouseX, mouseY));
    } else {
      this.boxes.forEach((box) => (box.isHovered = false));
    }
  }

  getHoverArea() {
    const { hoverAreaX, hoverAreaY, hoverAreaWidth, hoverAreaHeight } =
      this.panelConfig;

    return {
      x: this.garageX + hoverAreaX,
      y: this.garageY + hoverAreaY,
      width: hoverAreaWidth === 0 ? this.garageWidth : hoverAreaWidth,
      height: hoverAreaHeight === 0 ? this.garageHeight : hoverAreaHeight,
    };
  }

  handleClick(mouseX, mouseY) {
    if (!this.showPanel) return false;
    return this.boxes.some((box) => box.handleClick(mouseX, mouseY));
  }

  update(deltaTime) {
    this.boxes.forEach((box) => box.update(deltaTime));
  }

  setOffset(offsetX, offsetY) {
    this.panelConfig.panelOffsetX = offsetX;
    this.panelConfig.panelOffsetY = offsetY;
  }
}
