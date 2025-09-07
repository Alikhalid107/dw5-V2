import { GridConfig } from "./GridConfig.js";
import { PanelPositionCalculator } from "./PanelPositionCalculator.js";
import { PanelBackground } from "./PanelBackground.js";
import { BoxFactory } from "./BoxFactory.js";

// GarageUI.js
export class GarageUI {
  constructor(flakManager, garageX, garageY, garageWidth, garageHeight) {
    this.flakManager = flakManager;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.showGrid = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    this.gridConfig = GridConfig;

    this.panelWidth = (this.gridConfig.cols * (this.gridConfig.boxWidth + this.gridConfig.spacing)) - this.gridConfig.spacing + 4;
    this.panelHeight = this.gridConfig.padding + (this.gridConfig.rows * (this.gridConfig.boxHeight + this.gridConfig.spacing)) - this.gridConfig.spacing + 2;
    this.panelBounds = null;
    this.boxes = BoxFactory.createBoxes(this, this.gridConfig);
  }

  calculatePanelPosition() {
    return PanelPositionCalculator.calculate(
      this.garageX, this.garageY, this.garageWidth, this.garageHeight, this.panelWidth
    );
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.panelBounds = { x: pos.x, y: pos.y, width: this.panelWidth, height: this.panelHeight };
    PanelBackground.draw(ctx, x, y, this.panelWidth, this.panelHeight);
    this.drawBoxes(ctx, x, y);
  }

  drawBoxes(ctx, panelX, panelY) {
    this.boxes.forEach(box => box.draw(ctx, panelX, panelY));
  }

  handleMouseMove(mouseX, mouseY) {
    const isOverGarage = mouseX >= this.garageX && mouseX <= this.garageX + this.garageWidth &&
                        mouseY >= this.garageY && mouseY <= this.garageY + this.garageHeight;

    const isOverPanel = this.panelBounds &&
                       mouseX >= this.panelBounds.x && mouseX <= this.panelBounds.x + this.panelBounds.width &&
                       mouseY >= this.panelBounds.y && mouseY <= this.panelBounds.y + this.panelBounds.height;

    this.showGrid = isOverGarage || isOverPanel;

    if (this.showGrid) {
      this.boxes.forEach(box => box.updateHoverState(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY));
    } else {
      this.boxes.forEach(b => b.isHovered = false);
    }
  }

  handleClick(mouseX, mouseY) {
    if (!this.showGrid) return false;
    return this.boxes.some(box => box.handleClick(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY));
  }

  update(deltaTime) {
    this.boxes.forEach(box => box.update(deltaTime));
  }
}