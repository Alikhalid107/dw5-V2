// ProductionButtons.js - Fixed version with proper bounds setting
import { IconManager } from "../../utils/IconManager.js";
import { PRODUCTION_BUTTONS_CONFIG } from "../../config/ProductionButtonConfig.js";
import { ProductionButton, ButtonRenderer, FactoryStyleConfig, ProductionController, ButtonLayout } from "./UnifiedProductionUI.js";

export class ProductionButtons {
  constructor() {
    const iconManager = new IconManager();
    const factoryStyles = new FactoryStyleConfig();
    
    Object.assign(this, {
      renderer: new ButtonRenderer(iconManager, factoryStyles),
      controller: new ProductionController(),
      layout: new ButtonLayout(),
      buttons: PRODUCTION_BUTTONS_CONFIG.buttons.map(config => new ProductionButton(config)),
      lastDrawPosition: { x: 0, y: 0 } // Track last draw position
    });
  }

  draw(ctx, x, y, factory) {
    // Store the position for use in updateHoverState
    this.lastDrawPosition = { x, y };
    
    // Calculate positions and ensure bounds are set correctly
    const positions = this.layout.calculatePositions(x, y, this.buttons);
    
    // Draw each button and ensure bounds are properly set
    positions.forEach((pos, i) => {
      // CRITICAL: Ensure the button bounds are set to screen coordinates
      this.buttons[i].setBounds(pos.x, pos.y);
      
      const isDisabled = this.buttons[i].hours === 15 && !this.controller.canStartProduction(factory, 15);
      this.renderer.draw(ctx, pos.x, pos.y, this.buttons[i], factory, isDisabled);
    });
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    // Recalculate positions before checking clicks to ensure bounds are current
    if (this.lastDrawPosition.x !== 0 || this.lastDrawPosition.y !== 0) {
      this.layout.calculatePositions(this.lastDrawPosition.x, this.lastDrawPosition.y, this.buttons);
    }
    
    return this.buttons.some(button => 
      button.isPointInside(mouseX, mouseY) && 
      this.controller.handleButtonClick(button, factory, messageCallback)
    );
  }

  updateHoverState(mouseX, mouseY) {
    // CRITICAL: Recalculate positions before checking hover to ensure bounds are current
    if (this.lastDrawPosition.x !== 0 || this.lastDrawPosition.y !== 0) {
      this.layout.calculatePositions(this.lastDrawPosition.x, this.lastDrawPosition.y, this.buttons);
    }
    
    // Update hover state for each button
    this.buttons.forEach(button => {
      const isInside = button.isPointInside(mouseX, mouseY);
      button.setHovered(isInside);
    });
  }
}