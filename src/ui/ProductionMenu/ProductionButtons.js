import { PanelBase } from "./PanelBase.js";
import { IconManager } from "../../utils/IconManager.js";
import { FACTORY_PANEL_CONFIG } from "../../config/FactoryPanelConfig.js";

export class ProductionButtons extends PanelBase {
  constructor() {
    super();
    this.iconManager = new IconManager();
    this.buttons = this.initializeButtons();
    this.factoryConfig = this.initializeFactoryConfig();
  }

  initializeButtons() {
    const { productionButtonsWidth, productionButtonsHeight } = FACTORY_PANEL_CONFIG.COMPONENT_SIZES;
    const { buttonSpacing } = FACTORY_PANEL_CONFIG.COMPONENT_SPACING;
    
    const buttonWidth = productionButtonsWidth / 2 - buttonSpacing;
    const buttonHeight = productionButtonsHeight;

    return {
      oneHour: {
        width: buttonWidth,
        height: buttonHeight,
        label: "1h",
        hours: 1,
        bounds: null,
        hovered: false
      },
      fifteenHour: {
        width: buttonWidth,
        height: buttonHeight,
        label: "15h",
        hours: 15,
        bounds: null,
        hovered: false
      }
    };
  }

  initializeFactoryConfig() {
    return {
      icons: {
        concrete: "CONCRETE_MIXER",
        steel: "STEEL_FURNACE",
        carbon: "CARBON_PLANT",
        oil: "OIL_REFINERY"
      },
      colors: {
        concrete: "#fcfc8bff",
        carbon: "#32CD32",
        steel: "#DC143C",
        oil: "#9932CC",
        default: "red"
      }
    };
  }

  getFactoryColor(factoryType) {
    return this.factoryConfig.colors[factoryType] || this.factoryConfig.colors.default;
  }

  drawButton(ctx, x, y, button, factory, isDisabled = false) {
    const { width, height, label } = button;
    
    // Draw background
    ctx.fillStyle = "rgba(115, 145, 167, 0.7)";
    ctx.fillRect(x, y, width, height);

    // Draw icon if available
    this.drawFactoryIcon(ctx, x, y, width, height, factory.type);

    // Draw text with outline
    this.drawButtonText(ctx, x, y, width, height, label, factory.type);

    // Draw hover effect
    if (button.hovered && !isDisabled) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(x, y, width, height);
    }
  }

  drawFactoryIcon(ctx, x, y, width, height, factoryType) {
    if (!factoryType || !this.iconManager.isLoaded()) return;

    const iconName = this.factoryConfig.icons[factoryType];
    if (!iconName) return;

    const iconSize = 48;
    const iconX = x + (width - iconSize) / 2;
    const iconY = y + (height - iconSize) / 2;
    
    this.iconManager.drawIcon(ctx, iconName, iconX, iconY, iconSize, iconSize);
  }

  drawButtonText(ctx, x, y, width, height, text, factoryType) {
    ctx.font = "20px Tahoma";
    ctx.fontWeight = "600";
    ctx.textAlign = "center";
    
    const textX = x + width / 2;
    const textY = y + height / 2 + 5;

    // Black outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeText(text, textX, textY);

    // Main text
    ctx.fillStyle = this.getFactoryColor(factoryType);
    ctx.fillText(text, textX, textY);
  }

  draw(ctx, x, y, factory) {
    const spacing = FACTORY_PANEL_CONFIG.COMPONENT_SPACING.buttonSpacing;
    const { oneHour, fifteenHour } = this.buttons;

    // Calculate positions
    const oneHourX = x;
    const fifteenHourX = oneHourX + oneHour.width + spacing;

    // Update bounds
    oneHour.bounds = this._bounds(oneHourX, y, oneHour.width, oneHour.height);
    fifteenHour.bounds = this._bounds(fifteenHourX, y, fifteenHour.width, fifteenHour.height);

    // Draw buttons
    this.drawButton(ctx, oneHourX, y, oneHour, factory);
    
    const canStart15Hour = this.canStartProduction(factory, 15);
    this.drawButton(ctx, fifteenHourX, y, fifteenHour, factory, !canStart15Hour);
  }

  canStartProduction(factory, hours) {
    if (hours === 1) return true;
    
    return factory.canStart15HourProduction 
      ? factory.canStart15HourProduction()
      : !factory.isProducing;
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    const { oneHour, fifteenHour } = this.buttons;

    // Handle 1-hour button
    if (this.isPointInBounds(mouseX, mouseY, oneHour.bounds)) {
      return this.handleProductionStart(factory, oneHour.hours, messageCallback);
    }

    // Handle 15-hour button
    if (this.isPointInBounds(mouseX, mouseY, fifteenHour.bounds)) {
      if (this.canStartProduction(factory, fifteenHour.hours)) {
        factory.startProduction(fifteenHour.hours);
        return true;
      } else {
        messageCallback("Cannot start 15hr production while active (max limit is 15 hours)");
        return true;
      }
    }

    return false;
  }

  handleProductionStart(factory, hours, messageCallback) {
    if (!factory.isProducing) {
      factory.startProduction(hours);
    } else {
      const wasCapped = factory.startProduction(hours);
      if (wasCapped) {
        messageCallback("Capped at 15 hours");
      }
    }
    return true;
  }

  updateHoverState(mouseX, mouseY) {
    const { oneHour, fifteenHour } = this.buttons;
    
    oneHour.hovered = this.isPointInBounds(mouseX, mouseY, oneHour.bounds);
    fifteenHour.hovered = this.isPointInBounds(mouseX, mouseY, fifteenHour.bounds);
  }
}