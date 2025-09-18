// src/ui/production/UnifiedProductionUI.js
import { PRODUCTION_BUTTONS_CONFIG } from "../../config/ProductionButtonConfig.js";
import { UniversalBoxState } from "../universalSystem/UniversalBoxState.js";

export class ButtonLayout {
  constructor(config = PRODUCTION_BUTTONS_CONFIG) {
    this.spacing = config.layout.spacing;
    this.isHorizontal = config.layout.alignment === 'horizontal';
  }
  
  calculatePositions(x, y, buttons) {
    let current = this.isHorizontal ? x : y;
    return buttons.map((button, i) => {
      const pos = this.isHorizontal ? { x: current, y } : { x, y: current };
      button.setBounds(pos.x, pos.y);
      current += (this.isHorizontal ? button.width : button.height) + 
                 (i < buttons.length - 1 ? this.spacing : 0);
      return pos;
    });
  }
  
  calculatePositionsUniversal = this.calculatePositions;
}

export class ButtonRenderer {
  constructor(iconManager, factoryStyles, config = PRODUCTION_BUTTONS_CONFIG) {
    Object.assign(this, { iconManager, factoryStyles, config });
  }
  
  draw(ctx, x, y, button, factory, isDisabled = false) {
    this.drawBackground(ctx, x, y, button, factory, isDisabled);
    if (factory?.type) {
      this.drawFactoryIcon(ctx, x, y, button, factory.type, isDisabled);
      this.drawButtonText(ctx, x, y, button, factory.type, isDisabled);
    }
    this.drawHoverOverlay(ctx, x, y, button, isDisabled);
  }
  
  drawBackground(ctx, x, y, button, factory, isDisabled) {
    const { styling, effects } = this.config;
    const { width, height, hovered } = button;
    
    ctx.fillStyle = isDisabled ? styling.disabledBackgroundColor :
                   factory?.isProducing ? styling.producingBackgroundColor :
                   hovered ? styling.hoverBackgroundColor : styling.backgroundColor;
    
    this.setShadow(ctx, hovered && effects.hover.shadowEnabled ? {
      color: effects.hover.glowColor,
      blur: effects.hover.glowBlur
    } : null);
    
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }
  
  drawFactoryIcon(ctx, x, y, button, factoryType, isDisabled) {
    if (!this.iconManager?.isLoaded()) return;
    const iconName = this.factoryStyles.getIconName(factoryType);
    if (!iconName) return;
    
    const { width, height, hovered } = button;
    const { styling, effects } = this.config;
    const iconSize = styling.iconSize * (hovered && !isDisabled ? styling.hoverIconScale : 1);
    
    this.setShadow(ctx, hovered && !isDisabled && effects.hover.shadowEnabled ? {
      color: this.factoryStyles.getColor(factoryType),
      blur: effects.hover.shadowBlur
    } : null);
    
    this.iconManager.drawIcon(ctx, iconName, 
      x + (width - iconSize) / 2, 
      y + (height - iconSize) / 2, 
      iconSize, iconSize);
    this.resetShadow(ctx);
  }
  
  drawButtonText(ctx, x, y, button, factoryType, isDisabled) {
    const { width, height, label, hovered } = button;
    const { styling, effects } = this.config;
    const baseFontSize = parseInt(styling.font);
    const fontSize = baseFontSize * (hovered && !isDisabled ? styling.hoverFontScale : 1);
    
    ctx.font = `${fontSize}px ${styling.font.split(' ').slice(1).join(' ')}`;
    ctx.textAlign = "center";
    
    const [textX, textY] = [x + width / 2, y + height / 2 + 5];
    const baseColor = this.factoryStyles.getColor(factoryType);
    
    // Draw outline and text
    ctx.strokeStyle = styling.outlineColor;
    ctx.lineWidth = styling.outlineWidth;
    ctx.strokeText(label, textX, textY);
    
    const textColor = isDisabled ? styling.disabledTextColor : 
                     hovered ? this.factoryStyles.brightenColor(baseColor, effects.brightenFactor) : 
                     baseColor;
    
    this.setShadow(ctx, hovered && !isDisabled && effects.hover.shadowEnabled ? {
      color: baseColor, blur: 4
    } : null);
    
    ctx.fillStyle = textColor;
    ctx.fillText(label, textX, textY);
    this.resetShadow(ctx);
  }
  
  drawHoverOverlay(ctx, x, y, button, isDisabled) {
    const { effects } = this.config;
    if (button.hovered && !isDisabled && effects.hover.overlayEnabled) {
      ctx.fillStyle = effects.hover.overlayColor;
      ctx.fillRect(x, y, button.width, button.height);
    }
  }
  
  setShadow(ctx, shadow) {
    if (shadow) {
      ctx.shadowColor = shadow.color;
      ctx.shadowBlur = shadow.blur;
      ctx.shadowOffsetX = ctx.shadowOffsetY = 0;
    }
  }
  
  resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}

export class FactoryStyleConfig {
  constructor(config = PRODUCTION_BUTTONS_CONFIG.factoryStyles) {
    this.config = config;
  }
  
  getColor = (factoryType) => this.config.colors[factoryType] || this.config.colors.default;
  getIconName = (factoryType) => this.config.icons[factoryType];
  
  brightenColor(color, factor) {
    if (!color?.startsWith('#')) return this.config.brighterColors?.[color] || "#ff4444";
    
    const hex = color.slice(1);
    const rgb = [0, 2, 4].map(i => 
      Math.min(255, parseInt(hex.substr(i, 2), 16) + Math.floor(255 * factor))
    );
    return `rgb(${rgb.join(', ')})`;
  }
}

export class ProductionButton extends UniversalBoxState {
  constructor(buttonConfig) {
    const { width, height } = buttonConfig;
    super({ width, height, boxWidth: width, boxHeight: height });
    Object.assign(this, buttonConfig, { hovered: false });
  }
  
  setBounds(x, y) { super.setBounds(x, y, this.width, this.height); }
  setHovered(isHovered) { this.hovered = isHovered; }
}

export class ProductionController {
  canStartProduction = (factory, hours) => 
    hours === 1 || (factory.canStart15HourProduction?.() ?? !factory.isProducing);
  
  handleProductionStart(factory, hours, messageCallback) {
    const wasCapped = factory.startProduction(hours);
    if (wasCapped && messageCallback) messageCallback("Capped at 15 hours");
    return true;
  }
  
  handleButtonClick(button, factory, messageCallback) {
    if (button.hours === 15 && !this.canStartProduction(factory, 15)) {
      messageCallback?.("Cannot start 15hr production while active (max limit is 15 hours)");
      return true;
    }
    return this.handleProductionStart(factory, button.hours, messageCallback);
  }
}