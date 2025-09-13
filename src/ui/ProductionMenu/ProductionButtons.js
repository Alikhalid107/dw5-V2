import { PanelBase } from "./PanelBase.js";
import { IconManager } from "../../utils/IconManager.js";
import { PRODUCTION_BUTTONS_CONFIG } from "../../config/ProductionButtonConfig.js";
import { ProductionButton } from "./ProductionButton/ProductionButton.js";
import { ButtonRenderer } from "./ProductionButton/ButtonRenderer.js";
import { FactoryStyleConfig } from "./ProductionButton/FactoryStyleConfig.js";
import { ProductionController } from "./ProductionButton/ProductionController.js";
import { ButtonLayout } from "./ProductionButton/ButtonLayout.js";

export class ProductionButtons extends PanelBase {
  constructor() {
    super();
    this.iconManager = new IconManager();
    this.factoryStyles = new FactoryStyleConfig();
    
    // FIXED: Pass the correct config to each component
    this.renderer = new ButtonRenderer(this.iconManager, this.factoryStyles, PRODUCTION_BUTTONS_CONFIG);
    this.controller = new ProductionController(PRODUCTION_BUTTONS_CONFIG);
    this.layout = new ButtonLayout(PRODUCTION_BUTTONS_CONFIG); // FIXED: Use PRODUCTION_BUTTONS_CONFIG instead of FACTORY_PANEL_CONFIG.COMPONENT_SPACING
    
    this.buttons = this.initializeButtons();
  }

  initializeButtons() {
    // FIXED: Use PRODUCTION_BUTTONS_CONFIG instead of calculating from FACTORY_PANEL_CONFIG
    return PRODUCTION_BUTTONS_CONFIG.buttons.map(buttonConfig => 
      new ProductionButton(buttonConfig, PRODUCTION_BUTTONS_CONFIG)
    );
    
    
  }

  draw(ctx, x, y, factory) {
    const positions = this.layout.calculatePositions(x, y, this.buttons);
    
    this.buttons.forEach((button, index) => {
      const pos = positions[index];
      const isDisabled = button.hours === 15 && !this.controller.canStartProduction(factory, 15);
      this.renderer.draw(ctx, pos.x, pos.y, button, factory, isDisabled);
    });
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    for (const button of this.buttons) {
      if (button.isPointInside(mouseX, mouseY)) {
        return this.controller.handleButtonClick(button, factory, messageCallback);
      }
    }
    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.buttons.forEach(button => {
      button.setHovered(button.isPointInside(mouseX, mouseY));
    });
  }
}


