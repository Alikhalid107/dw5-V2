import { PanelBase } from "./PanelBase.js";
import { IconManager } from "../../utils/IconManager.js";
import { FACTORY_PANEL_CONFIG } from "../../config/FactoryPanelConfig.js";

export class ProductionButtons extends PanelBase {
  constructor() {
    super();
    this.prodButtonWidth = FACTORY_PANEL_CONFIG.COMPONENT_SIZES.productionButtonsWidth / 2 - FACTORY_PANEL_CONFIG.COMPONENT_SPACING.buttonSpacing;
    this.prodButtonHeight= FACTORY_PANEL_CONFIG.COMPONENT_SIZES.productionButtonsHeight;
    this.oneHourButtonBounds = null;
    this.fifteenHourButtonBounds = null;
    this.isOneHourHovered = false;
    this.isFifteenHourHovered = false;
    this.iconManager = new IconManager();

    // Factory type to icon mapping
    this.factoryIcons = {
      concrete: "CONCRETE_MIXER",
      steel: "STEEL_FURNACE",
      carbon: "CARBON_PLANT",
      oil: "OIL_REFINERY",
    };

    // Factory type to text color mapping
    this.factoryTextColors = {
      concrete: "#fcfc8bff",  // Yellow/Gold
      carbon: "#32CD32",    // Green
      steel: "#DC143C",     // Red
      oil: "#9932CC"        // Purple
    };

    // Default text color for unknown factory types
    this.defaultTextColor = "red";
  }

  getFactoryTextColor(factoryType, isDisabled = false) {
    // if (isDisabled) {
    //   return "rgba(255,255,255,0.5)";
    // }
    
    return this.factoryTextColors[factoryType] || this.defaultTextColor;
  }

  drawProductionButton(
    ctx,
    x,
    y,
    label,
    isProducing,
    isHovered,
    isDisabled = false,
    factoryType = null
  ) {
    const color = isDisabled
      ? "rgba(100,100,100,0.5)"
      : isProducing ? "#5A757E" : "#5A757E";

    // Draw button background
    ctx.fillStyle = color;
    ctx.fillRect(x, y, this.prodButtonWidth, this.prodButtonHeight);

    // Draw factory-specific icon if available and loaded
    if (factoryType && this.iconManager.isLoaded()) {
      const iconName = this.factoryIcons[factoryType];
      if (iconName) {
        // Position icon on the left side of button
        const iconSize = 40;
        const iconX = x + 3;
        const iconY = y + (this.prodButtonHeight - iconSize) / 2;
        this.iconManager.drawIcon(
          ctx,
          iconName,
          iconX,
          iconY,
          iconSize,
          iconSize
        );
      }
    }

    // Draw label text with factory-specific color and black outline
    ctx.font = "20px Tahoma";
    ctx.fontWeight = "600";
    ctx.textAlign = "center";
    const textX = factoryType && this.iconManager.isLoaded() ? x + 22 : x + 5;
    const textY = y + this.prodButtonHeight / 2 + 3;
    
    // Draw black outline (stroke)
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4; // 3px outline - you can change this to 2 for thinner outline
    ctx.strokeText(label, textX, textY);
    
    // Draw the main text (fill)
    ctx.fillStyle = this.getFactoryTextColor(factoryType, isDisabled);
    ctx.fillText(label, textX, textY);

    // Draw hover overlay
    if (isHovered && !isDisabled) {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(x, y, this.prodButtonWidth, this.prodButtonHeight);
    }
  }

  draw(ctx, x, y, factory) {
    const oneX = x;
    // Use the buttonSpacing from config instead of hardcoded value
    const buttonSpacing = FACTORY_PANEL_CONFIG.COMPONENT_SPACING.buttonSpacing;
    const fifteenX = oneX + this.prodButtonWidth + buttonSpacing;

    this.oneHourButtonBounds = this._bounds(
      oneX,
      y,
      this.prodButtonWidth,
      this.prodButtonHeight
    );
    this.fifteenHourButtonBounds = this._bounds(
      fifteenX,
      y,
      this.prodButtonWidth,
      this.prodButtonHeight
    );

    // Draw 1hr button with factory-specific icon and text color
    this.drawProductionButton(
      ctx,
      oneX,
      y,
      "1h",
      factory.isProducing,
      this.isOneHourHovered,
      false,
      factory.type
    );

    // Check if the method exists before calling it
    const canStart15 = factory.canStart15HourProduction
      ? factory.canStart15HourProduction()
      : !factory.isProducing;

    // Draw 15hr button with factory-specific icon and text color
    this.drawProductionButton(
      ctx,
      fifteenX,
      y,
      "15h",
      factory.isProducing,
      this.isFifteenHourHovered,
      !canStart15,
      factory.type
    );
  }

  handleClick(mouseX, mouseY, factory, messageCallback) {
    if (this.isPointInBounds(mouseX, mouseY, this.oneHourButtonBounds)) {
      if (!factory.isProducing) {
        factory.startProduction(1);
      } else {
        const wasCapped = factory.startProduction(1);
        if (wasCapped) messageCallback("Capped at 15 hours");
      }
      return true;
    }

    if (this.isPointInBounds(mouseX, mouseY, this.fifteenHourButtonBounds)) {
      // Check if method exists before calling it
      const canStart15 = factory.canStart15HourProduction
        ? factory.canStart15HourProduction()
        : !factory.isProducing;

      if (canStart15) {
        factory.startProduction(15);
      } else {
        messageCallback(
          "Cannot start 15hr production while active (max limit is 15 hours)"
        );
      }
      return true;
    }

    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.isOneHourHovered = this.isPointInBounds(
      mouseX,
      mouseY,
      this.oneHourButtonBounds
    );
    this.isFifteenHourHovered = this.isPointInBounds(
      mouseX,
      mouseY,
      this.fifteenHourButtonBounds
    );
  }
}