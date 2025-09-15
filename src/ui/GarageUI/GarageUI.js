import { UniversalBoxsesFactory } from "../universalSystem/UniversalBoxsesFactory.js";
import { UniversalPanelRenderer } from '../../universal/UniversalPanelRenderer.js';
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js"
import { ConfigurationMerger } from "../../universal/ConfigurationMerger.js";

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

    // Use unified config system
    this.config = ConfigurationMerger.getGarageUIConfig(customConfig);
    this.gridConfig = this.config.grid;
    
    // Set buildable box index in gridConfig so UniversalBox can use it
    this.gridConfig.buildableBoxIndex = this.config.panel.buildableBoxIndex;

    // Calculate panel dimensions
    this.calculatePanelDimensions();
    
    this.panelBounds = null;
    
    // ✅ CLEAN: Use factory to create UniversalBox instances
    this.boxes = UniversalBoxsesFactory.createBoxes(this, this.gridConfig);
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
    
    // Draw panel background
    UniversalPanelRenderer.drawPanelBackground(
      ctx, x, y, this.panelWidth, this.panelHeight, 
      UNIVERSAL_PANEL_CONFIG.LAYOUT
    );
    
    // ✅ CLEAN: Draw boxes using universal system
    this.drawBoxes(ctx, x, y);
    // this.drawDebugBorders(ctx, offsetX, offsetY);
  }

  drawBoxes(ctx, panelX, panelY) {
    // Each UniversalBox handles its own drawing
    this.boxes.forEach(box => box.draw(ctx, panelX, panelY));
  }

  handleMouseMove(mouseX, mouseY) {
    const hoverArea = {
      x: this.garageX + (this.config.panel.hoverAreaX || 0),
      y: this.garageY + (this.config.panel.hoverAreaY || 0),
      width: this.config.panel.hoverAreaWidth || this.garageWidth,
      height: this.config.panel.hoverAreaHeight || this.garageHeight
    };

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
      // ✅ CLEAN: Use universal hover system
      this.boxes.forEach(box => box.updateHoverState(mouseX, mouseY));
    } else {
      this.boxes.forEach(box => box.isHovered = false);
    }

    return this.showGrid;
  }

  handleClick(mouseX, mouseY) {
    if (!this.showGrid) return false;
    // ✅ CLEAN: Use universal click system
    return this.boxes.some(box => box.handleClick(mouseX, mouseY));
  }

  update(deltaTime) {
    // No update needed for boxes currently
  }

  updateConfig(newConfig) {
    this.config = ConfigurationMerger.getGarageUIConfig(newConfig);
    this.gridConfig = this.config.grid;
    this.gridConfig.buildableBoxIndex = this.config.panel.buildableBoxIndex;
    this.calculatePanelDimensions();
    
    // Recreate boxes with new config
    this.boxes = UniversalBoxsesFactory.createBoxes(this, this.gridConfig);
  }

 
}

//  drawDebugBorders(ctx, offsetX, offsetY) {
//     if (!this.config.debug?.enabled) return;

//     const colors = this.config.debug.colors;
//     const lineStyles = this.config.debug.lineStyles;
    
//     const hoverArea = {
//       x: this.garageX + (this.config.panel.hoverAreaX || 0) - offsetX,
//       y: this.garageY + (this.config.panel.hoverAreaY || 0) - offsetY,
//       width: this.config.panel.hoverAreaWidth || this.garageWidth,
//       height: this.config.panel.hoverAreaHeight || this.garageHeight
//     };
    
//     const garageArea = {
//       x: this.garageX - offsetX,
//       y: this.garageY - offsetY,
//       width: this.garageWidth,
//       height: this.garageHeight
//     };
    
//     ctx.strokeStyle = colors.hoverArea;
//     ctx.setLineDash(lineStyles.hoverArea);
//     ctx.lineWidth = this.config.debug.lineWidth || 2;
//     ctx.strokeRect(hoverArea.x, hoverArea.y, hoverArea.width, hoverArea.height);
    
//     ctx.strokeStyle = colors.garageArea;
//     ctx.setLineDash(lineStyles.garageArea);
//     ctx.strokeRect(garageArea.x, garageArea.y, garageArea.width, garageArea.height);
    
//     if (this.panelBounds) {
//       ctx.strokeStyle = colors.panelArea;
//       ctx.setLineDash(lineStyles.panelArea);
//       ctx.strokeRect(
//         this.panelBounds.x - offsetX, 
//         this.panelBounds.y - offsetY, 
//         this.panelBounds.width, 
//         this.panelBounds.height
//       );
//     }
    
//     ctx.setLineDash([]);
//   }