import { UniversalPositionCalculator } from "./UniversalPositionCalculator.js";
import { UniversalBoxState } from "./UniversalBoxState.js";
import { UniversalBoxController } from "./UniversalBoxController.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

/**
 * Universal box component for UI grids.
 */
export class UniversalBox {
  constructor(parentUI, row, col, index, config = {}) {
    this.parentUI = parentUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.config = config;
    this.canBuild = config.buildableBoxIndex !== undefined ? true : false;

    
    this.state = new UniversalBoxState({
      boxWidth: config.boxWidth,
      boxHeight: config.boxHeight,
      DIMENSIONS: { width: config.boxWidth, height: config.boxHeight }
    });
    
    this.controller = new UniversalBoxController(config);
    this._currentOffsets = { offsetX: 0, offsetY: 0 };
  }

  calculatePosition(panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(
      panelX, panelY, this.row, this.col, this.parentUI.gridConfig
    );
  }


  draw(ctx, panelX, panelY, { renderType, ...context } = {}) {
  const pos = this.calculatePosition(panelX, panelY);
  this.state.setBounds(pos.x, pos.y);
  this._currentOffsets = {
    offsetX: this.parentUI.currentOffsetX || 0,
    offsetY: this.parentUI.currentOffsetY || 0
  };

  // Always require renderType explicitly
  if (!renderType) {
    throw new Error("UniversalBox.draw requires a renderType (e.g., 'factory', 'garage')");
  }

  const finalContext = {
    ...context,
    boxIndex: this.index,
    showBorder: false
  };

  UniversalPanelRenderer.drawUniversalBox(ctx, this.state, renderType, finalContext);
}


get description() {
  return this._description;
}

set description(value) {
  this._description = value;
}

  updateHoverState(mouseX, mouseY) {
    const wasHovered = this.state.isHovered;
    this.state.isHovered = this.state.bounds && this._isPointInWorldBounds(mouseX, mouseY);
    return wasHovered !== this.state.isHovered;
  }

handleClick(mouseX, mouseY) {
  if (!this.canBuild || !this.state.bounds || !this._isPointInWorldBounds(mouseX, mouseY)) {
    return false;
  }

  return this.controller.handleClick(mouseX, mouseY, this.state, {
    flakManager: this.parentUI.flakManager,
    boxIndex: this.index,
    gridConfig: this.parentUI.gridConfig
  }, 'build');
}


  get isHovered() { return this.state.isHovered; }
  set isHovered(value) { this.state.isHovered = value; }

  get worldBounds() {
    if (!this.state.bounds) return null;
    return {
      x: this.state.bounds.x + this._currentOffsets.offsetX,
      y: this.state.bounds.y + this._currentOffsets.offsetY,
      width: this.state.bounds.width,
      height: this.state.bounds.height
    };
  }

  isPointInBounds(mouseX, mouseY) {
    return this._isPointInWorldBounds(mouseX, mouseY);
  }

  _isPointInWorldBounds(mouseX, mouseY) {
    if (!this.state.bounds) return false;
    const worldX = this.state.bounds.x + this._currentOffsets.offsetX;
    const worldY = this.state.bounds.y + this._currentOffsets.offsetY;
    return mouseX >= worldX && mouseX <= worldX + this.state.bounds.width &&
           mouseY >= worldY && mouseY <= worldY + this.state.bounds.height;
  }
}