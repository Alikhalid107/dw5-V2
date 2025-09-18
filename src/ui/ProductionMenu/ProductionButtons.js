// ProductionButtons.js - Optimized unified components
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
      buttons: PRODUCTION_BUTTONS_CONFIG.buttons.map(config => new ProductionButton(config))
    });
  }

  draw(ctx, x, y, factory) {
    this.layout.calculatePositions(x, y, this.buttons)
      .forEach((pos, i) => {
        const isDisabled = this.buttons[i].hours === 15 && !this.controller.canStartProduction(factory, 15);
        this.renderer.draw(ctx, pos.x, pos.y, this.buttons[i], factory, isDisabled);
      });
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    return this.buttons.some(button => 
      button.isPointInside(mouseX, mouseY) && 
      this.controller.handleButtonClick(button, factory, messageCallback)
    );
  }

  updateHoverState(mouseX, mouseY) {
    this.buttons.forEach(button => button.setHovered(button.isPointInside(mouseX, mouseY)));
  }
}