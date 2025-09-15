import { UniversalPositionCalculator } from "./UniversalPositionCalculator.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

export class UniversalBox {
  constructor(parentUI, row, col, index, config = {}) {
    this.parentUI = parentUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.config = config;

    // Determine if this box can be interacted with
    this.canBuild = config.buildableBoxIndex !== undefined ? 
                   (index === config.buildableBoxIndex) : false;
    this.isHovered = false;
    this.bounds = null;
    this.worldBounds = null;
  }

  calculatePosition(panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(
      panelX, panelY, this.row, this.col, this.parentUI.gridConfig
    );
  }

  draw(ctx, panelX, panelY) {
    const pos = this.calculatePosition(panelX, panelY);
    const { boxWidth, boxHeight } = this.parentUI.gridConfig;

    this.bounds = { x: pos.x, y: pos.y, width: boxWidth, height: boxHeight };

    // Store world coordinates for click detection
    this.worldBounds = {
      x: pos.x + (this.parentUI.currentOffsetX || 0),
      y: pos.y + (this.parentUI.currentOffsetY || 0),
      width: boxWidth,
      height: boxHeight
    };

    // ✅ SOLUTION: Use UniversalPanelRenderer instead of duplicated logic
    const state = {
      bounds: this.bounds,
      isHovered: this.isHovered
    };

    const context = {
      canBuild: this.canBuild,
      flakManager: this.parentUI.flakManager
    };

    // Delegate ALL rendering to UniversalPanelRenderer
    UniversalPanelRenderer.drawUniversalBox(ctx, state, 'garage', context);
  }

  updateHoverState(mouseX, mouseY) {
    if (!this.canBuild || !this.worldBounds) {
      this.isHovered = false;
      return;
    }

    this.isHovered = this.isPointInBounds(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    if (!this.canBuild || !this.worldBounds || !this.parentUI.flakManager?.canBuild()) {
      return false;
    }

    if (this.isPointInBounds(mouseX, mouseY)) {
      return this.parentUI.flakManager.startBuilding();
    }

    return false;
  }

  isPointInBounds(mouseX, mouseY) {
    if (!this.worldBounds) return false;

    return mouseX >= this.worldBounds.x && 
           mouseX <= this.worldBounds.x + this.worldBounds.width &&
           mouseY >= this.worldBounds.y && 
           mouseY <= this.worldBounds.y + this.worldBounds.height;
  }
}