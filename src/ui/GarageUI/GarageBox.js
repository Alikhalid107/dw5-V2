import { BoxPositionCalculator } from "./BoxPositionCalculator.js";
import { BoxColorCalculator } from "./BoxColorCalculator.js";
import { BuildContentDrawer } from "./BuildContentDrawer.js";
import { UNIVERSAL_PANEL_CONFIG} from '../../config/UniversalPanelConfig.js';
import { GARAGE_UI_CONFIG } from '../../config/GarageUIConfig.js';

export class GarageBox {
  constructor(garageUI, row, col, index) {
    this.garageUI = garageUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.isHovered = false;
    
    // Use config to determine buildable box
    this.canBuild = index === GARAGE_UI_CONFIG.panel.buildableBoxIndex;
    this.bounds = null;
  }

  calculateBoxPosition(panelX, panelY) {
    return BoxPositionCalculator.calculate(
      panelX, panelY, this.row, this.col, this.garageUI.gridConfig
    );
  }

  draw(ctx, panelX, panelY) {
    const pos = this.calculateBoxPosition(panelX, panelY);
    const config = this.garageUI.gridConfig;

    // Box background using config colors
    ctx.fillStyle = BoxColorCalculator.getColor(
      this.canBuild, this.garageUI.flakManager
    );
    ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);

    // Hover effect using config color
    if (this.isHovered && this.canBuild && this.garageUI.flakManager.canBuild()) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.GRID.hoverEffect;
      ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);
    }

    // Draw content for buildable box (only if config allows)
    if (this.canBuild && GARAGE_UI_CONFIG.panel.showBuildingText) {
      BuildContentDrawer.draw(
        ctx, pos.x, pos.y, config, this.garageUI.flakManager
      );
    }

    // Store bounds in world coordinates
    this.bounds = {
      x: pos.x + this.garageUI.currentOffsetX,
      y: pos.y + this.garageUI.currentOffsetY,
      width: config.boxWidth,
      height: config.boxHeight
    };
  }

  updateHoverState(mouseX, mouseY) {
    this.isHovered = this.canBuild && this.bounds &&
                     mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;
  }

  handleClick(mouseX, mouseY) {
    if (!this.canBuild || !this.bounds || !this.garageUI.flakManager.canBuild()) {
      return false;
    }

    const isInside = mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;

    return isInside ? this.garageUI.flakManager.startBuilding() : false;
  }

  update(deltaTime) {
    // Placeholder for future animations
  }
}