import { BoxFactory } from "./BoxFactory.js";
import { UniversalPanelRenderer } from '../../universal/UniversalPanelRenderer.js';
import {  UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js"
import { ConfigurationMerger } from "../../universal/ConfigurationMerger.js";
import {GARAGE_UI_CONFIG,} from "../../config/GarageUIConfig.js";

export class GarageUI {
  constructor(flakManager, garageX, garageY, garageWidth, garageHeight, customConfig = {}) {
    this.flakManager = flakManager;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.showGrid = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    // Use unified config system with custom overrides
    this.config = ConfigurationMerger.getGarageUIConfig(customConfig);
    this.gridConfig = this.config.grid;

    // Calculate panel dimensions based on config
    this.calculatePanelDimensions();
    
    this.panelBounds = null;
    this.boxes = BoxFactory.createBoxes(this, this.gridConfig);
  }

 calculatePanelDimensions() {
  const alignment = this.gridConfig.alignment || {};
  const paddingLeft = alignment.paddingLeft || this.gridConfig.padding;
  const paddingRight = alignment.paddingRight || 2;
  const paddingTop = alignment.paddingTop || this.gridConfig.padding;
  const paddingBottom = alignment.paddingBottom || 2;
  
  const gridWidth = this.gridConfig.cols * this.gridConfig.boxWidth + 
                   (this.gridConfig.cols - 1) * this.gridConfig.spacing;
  const gridHeight = this.gridConfig.rows * this.gridConfig.boxHeight + 
                    (this.gridConfig.rows - 1) * this.gridConfig.spacing;

  this.panelWidth = gridWidth + paddingLeft + paddingRight;
  this.panelHeight = gridHeight + paddingTop + paddingBottom;
}

  calculatePanelPosition() {
    // Use config offset values
    return {
      x: this.garageX + (this.garageWidth / 2) - (this.panelWidth / 2) + this.config.panel.offsetX,
      y: this.garageY + this.garageHeight + this.config.panel.offsetY
    };
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.panelBounds = { x: pos.x, y: pos.y, width: this.panelWidth, height: this.panelHeight };
    
    // Use unified panel background renderer with config
    UniversalPanelRenderer.drawPanelBackground(
      ctx, x, y, this.panelWidth, this.panelHeight, 
      UNIVERSAL_PANEL_CONFIG.LAYOUT
    );
    
    this.drawBoxes(ctx, x, y);
     // ADD THIS LINE:
  this.drawDebugBorders(ctx, offsetX, offsetY);
  }

  drawBoxes(ctx, panelX, panelY) {
    this.boxes.forEach(box => box.draw(ctx, panelX, panelY));
  }

 // Updated GarageUI.handleMouseMove() method
handleMouseMove(mouseX, mouseY) {
  // Calculate hover area using config values
  const hoverArea = {
    x: this.garageX + (this.config.panel.hoverAreaX || 0),
    y: this.garageY + (this.config.panel.hoverAreaY || 0),
    width: this.config.panel.hoverAreaWidth || this.garageWidth,
    height: this.config.panel.hoverAreaHeight || this.garageHeight
  };

  // Use config to determine if hover areas are enabled
  const isOverGarage = this.config.panel.garageHoverEnabled &&
                      mouseX >= hoverArea.x && 
                      mouseX <= hoverArea.x + hoverArea.width &&
                      mouseY >= hoverArea.y && 
                      mouseY <= hoverArea.y + hoverArea.height;

  const isOverPanel = this.config.panel.panelHoverEnabled && this.panelBounds &&
                     mouseX >= this.panelBounds.x && 
                     mouseX <= this.panelBounds.x + this.panelBounds.width &&
                     mouseY >= this.panelBounds.y && 
                     mouseY <= this.panelBounds.y + this.panelBounds.height;

  this.showGrid = isOverGarage || isOverPanel;

  if (this.showGrid) {
    this.boxes.forEach(box => box.updateHoverState(mouseX, mouseY));
  } else {
    this.boxes.forEach(b => b.isHovered = false);
  }

  return this.showGrid;
}

// Alternative: If you're using the UniversalPanel system, update the calculateHoverArea method
static calculateHoverArea(target, config) {
  // For garage panels
  if (target.garageX !== undefined) {
    return {
      x: target.garageX + (config.panel?.hoverAreaX || 0),
      y: target.garageY + (config.panel?.hoverAreaY || 0),
      width: config.panel?.hoverAreaWidth || target.garageWidth,
      height: config.panel?.hoverAreaHeight || target.garageHeight
    };
  }
  
  // For factory panels - existing logic
  return {
    x: target.x + (config.hoverAreaX || 0),
    y: target.y + (config.hoverAreaY || 0),
    width: config.hoverAreaWidth || config.panelWidth,
    height: config.hoverAreaHeight || config.panelHeight
  };
}

  handleClick(mouseX, mouseY) {
    if (!this.showGrid) return false;
    return this.boxes.some(box => box.handleClick(mouseX, mouseY));
  }

  update(deltaTime) {
    this.boxes.forEach(box => box.update(deltaTime));
  }

  // =============================================================================
  // CONFIGURATION UPDATE METHODS - New features
  // =============================================================================
  updateConfig(newConfig) {
    this.config = ConfigurationMerger.getGarageUIConfig(newConfig);
    this.gridConfig = this.config.grid;
    this.calculatePanelDimensions();
    
    // Recreate boxes with new config
    this.boxes = BoxFactory.createBoxes(this, this.gridConfig);
  }

  // Method to change grid size dynamically
  setGridSize(rows, cols) {
    this.updateConfig({
      grid: { rows, cols }
    });
  }

  // Method to change box dimensions
  setBoxSize(width, height) {
    this.updateConfig({
      grid: { boxWidth: width, boxHeight: height }
    });
  }

  // Method to change panel position
  setPanelOffset(offsetX, offsetY) {
    this.updateConfig({
      panel: { offsetX, offsetY }
    });
  }

  // Enable/disable hover areas
  setHoverEnabled(garageHover, panelHover) {
    this.updateConfig({
      panel: { 
        garageHoverEnabled: garageHover, 
        panelHoverEnabled: panelHover 
      }
    });
  }

  // Change buildable box index
  setBuildableBox(index) {
    this.updateConfig({
      panel: { buildableBoxIndex: index }
    });
    
    // Update existing boxes
    this.boxes.forEach(box => {
      box.canBuild = box.index === index;
    });
  }

  drawDebugBorders(ctx, offsetX, offsetY) {
  if (!this.config.debug?.enabled) return;

  const colors = this.config.debug.colors;
  const lineStyles = this.config.debug.lineStyles;
  
  // Calculate areas
  const hoverArea = {
    x: this.garageX + (this.config.panel.hoverAreaX || 0) - offsetX,
    y: this.garageY + (this.config.panel.hoverAreaY || 0) - offsetY,
    width: this.config.panel.hoverAreaWidth || this.garageWidth,
    height: this.config.panel.hoverAreaHeight || this.garageHeight
  };
  
  const garageArea = {
    x: this.garageX - offsetX,
    y: this.garageY - offsetY,
    width: this.garageWidth,
    height: this.garageHeight
  };
  
  // Draw hover area border (red, dashed)
  ctx.strokeStyle = colors.hoverArea;
  ctx.setLineDash(lineStyles.hoverArea);
  ctx.lineWidth = this.config.debug.lineWidth || 2;
  ctx.strokeRect(hoverArea.x, hoverArea.y, hoverArea.width, hoverArea.height);
  
  // Draw garage area border (green, dashed)
  ctx.strokeStyle = colors.garageArea;
  ctx.setLineDash(lineStyles.garageArea);
  ctx.strokeRect(garageArea.x, garageArea.y, garageArea.width, garageArea.height);
  
  // Draw panel area border (blue, solid) - if panel is visible
  if (this.panelBounds) {
    ctx.strokeStyle = colors.panelArea;
    ctx.setLineDash(lineStyles.panelArea);
    ctx.strokeRect(
      this.panelBounds.x - offsetX, 
      this.panelBounds.y - offsetY, 
      this.panelBounds.width, 
      this.panelBounds.height
    );
  }
  
  // Reset line dash
  ctx.setLineDash([]);
}
}
