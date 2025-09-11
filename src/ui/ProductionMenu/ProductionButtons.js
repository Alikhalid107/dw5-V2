import { PanelBase } from "./PanelBase.js";
import { IconManager } from "../../utils/IconManager.js";
import { FACTORY_PANEL_CONFIG } from "../../config/FactoryPanelConfig.js";
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
    this.renderer = new ButtonRenderer(this.iconManager, this.factoryStyles);
    this.controller = new ProductionController();
    this.layout = new ButtonLayout(FACTORY_PANEL_CONFIG.COMPONENT_SPACING);
    
    this.buttons = this.initializeButtons();
  }

  initializeButtons() {
    const { productionButtonsWidth, productionButtonsHeight } = FACTORY_PANEL_CONFIG.COMPONENT_SIZES;
    const { buttonSpacing } = FACTORY_PANEL_CONFIG.COMPONENT_SPACING;
    
    const buttonWidth = productionButtonsWidth / 2 - buttonSpacing;
    const buttonHeight = productionButtonsHeight;

    return [
      new ProductionButton({
        width: buttonWidth,
        height: buttonHeight,
        label: "1h",
        hours: 1
      }),
      new ProductionButton({
        width: buttonWidth,
        height: buttonHeight,
        label: "15h",
        hours: 15
      })
    ];
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