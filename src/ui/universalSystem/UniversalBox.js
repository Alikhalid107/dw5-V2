import { UniversalPositionCalculator } from "./UniversalPositionCalculator.js";
import { UniversalBoxState } from "./UniversalBoxState.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

export class UniversalBox {
  constructor(parentUI, row, col, index, config = {}) {
    this.parentUI = parentUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.config = config;
    this.canBuild = config.buildableBoxIndex !== undefined ? 
                   (index === config.buildableBoxIndex) : false;
    // Use UniversalBoxState for bounds and hover state
    this.state = new UniversalBoxState({
      boxWidth: config.boxWidth,
      boxHeight: config.boxHeight
    });
    this.worldBounds = null; // Still needed for world click detection
  }

  calculatePosition(panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(
      panelX, panelY, this.row, this.col, this.parentUI.gridConfig
    );
  }

  draw(ctx, panelX, panelY) {
    const pos = this.calculatePosition(panelX, panelY);
    const { boxWidth, boxHeight } = this.parentUI.gridConfig;
    
    // Set bounds using UniversalBoxState
    this.state.setBounds(pos.x, pos.y);
    
    // Store world coordinates for click detection (as before)
    this.worldBounds = {
      x: pos.x + (this.parentUI.currentOffsetX || 0),
      y: pos.y + (this.parentUI.currentOffsetY || 0),
      width: boxWidth,
      height: boxHeight
    };

    // Prepare context for UniversalPanelRenderer
    const context = {
      canBuild: this.canBuild,
      flakManager: this.parentUI.flakManager
      // Add other context if needed by renderer helpers
    };

    // Delegate ALL rendering to UniversalPanelRenderer
    UniversalPanelRenderer.drawUniversalBox(ctx, this.state, 'garage', context);
  }

  updateHoverState(mouseX, mouseY) {
    // Use UniversalBoxState for hover updates
    if (!this.canBuild || !this.worldBounds) {
      // Ensure state reflects this
      this.state.isHovered = false;
      return;
    }
    // Update state's hover based on world coordinates
    const wasHovered = this.state.isHovered;
    this.state.isHovered = this.isPointInBounds(mouseX, mouseY);
    return wasHovered !== this.state.isHovered;
  }

  handleClick(mouseX, mouseY) {
    // Logic can remain largely the same, but use state for consistency if needed
    if (!this.canBuild || !this.worldBounds || !this.parentUI.flakManager?.canBuild()) {
      return false;
    }
    if (this.isPointInBounds(mouseX, mouseY)) {
      return this.parentUI.flakManager.startBuilding();
    }
    return false;
  }

  isPointInBounds(mouseX, mouseY) {
    // This still needs to check world bounds for mouse interaction
    if (!this.worldBounds) return false;
    return mouseX >= this.worldBounds.x && 
           mouseX <= this.worldBounds.x + this.worldBounds.width &&
           mouseY >= this.worldBounds.y && 
           mouseY <= this.worldBounds.y + this.worldBounds.height;
  }
}
