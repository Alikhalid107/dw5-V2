import { PRODUCTION_BUTTONS_CONFIG } from "../../../config/ProductionButtonConfig";
export class ButtonRenderer {
  constructor(iconManager, factoryStyleConfig, config = PRODUCTION_BUTTONS_CONFIG) {
    this.iconManager = iconManager;
    this.factoryStyles = factoryStyleConfig;
    this.config = config;
  }

  draw(ctx, x, y, button, factory, isDisabled = false) {
    this.drawBackground(ctx, x, y, button, factory, isDisabled);
    this.drawFactoryIcon(ctx, x, y, button, factory.type, isDisabled);
    this.drawButtonText(ctx, x, y, button, factory.type, isDisabled);
    this.drawHoverOverlay(ctx, x, y, button, isDisabled);
  }

  drawBackground(ctx, x, y, button, factory, isDisabled) {
    const { width, height, hovered } = button;
    const { styling, effects } = this.config;
    
    if (isDisabled) {
      ctx.fillStyle = styling.disabledBackgroundColor;
    } else if (factory && factory.isProducing) {
      ctx.fillStyle = styling.producingBackgroundColor;
    } else if (hovered) {
      ctx.fillStyle = styling.hoverBackgroundColor;
      
      if (effects.hover.shadowEnabled) {
        ctx.shadowColor = effects.hover.glowColor;
        ctx.shadowBlur = effects.hover.glowBlur;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }
    } else {
      ctx.fillStyle = styling.backgroundColor;
    }
    
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }

  drawFactoryIcon(ctx, x, y, button, factoryType, isDisabled) {
    if (!factoryType || !this.iconManager.isLoaded()) return;

    const iconName = this.factoryStyles.getIconName(factoryType);
    if (!iconName) return;

    const { width, height, hovered } = button;
    const { styling, effects } = this.config;
    
    const baseIconSize = styling.iconSize;
    const iconSize = hovered && !isDisabled ? baseIconSize * styling.hoverIconScale : baseIconSize;
    const iconX = x + (width - iconSize) / 2;
    const iconY = y + (height - iconSize) / 2;
    
    if (hovered && !isDisabled && effects.hover.shadowEnabled) {
      ctx.shadowColor = this.factoryStyles.getColor(factoryType);
      ctx.shadowBlur = effects.hover.shadowBlur;
    }
    
    this.iconManager.drawIcon(ctx, iconName, iconX, iconY, iconSize, iconSize);
    this.resetShadow(ctx);
  }

  drawButtonText(ctx, x, y, button, factoryType, isDisabled) {
    const { width, height, label, hovered } = button;
    const { styling, effects } = this.config;
    
    const baseFontSize = parseInt(styling.font.split('px')[0]);
    const fontSize = hovered && !isDisabled ? baseFontSize * styling.hoverFontScale : baseFontSize;
    const fontFamily = styling.font.split(' ').slice(1).join(' ');
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    
    const textX = x + width / 2;
    const textY = y + height / 2 + 5;

    // Draw outline
    ctx.strokeStyle = styling.outlineColor;
    ctx.lineWidth = styling.outlineWidth;
    ctx.strokeText(label, textX, textY);

    // Draw main text
    let textColor;
    if (isDisabled) {
      textColor = styling.disabledTextColor;
    } else {
      const baseColor = this.factoryStyles.getColor(factoryType);
      if (hovered) {
        textColor = this.factoryStyles.brightenColor(baseColor, effects.brightenFactor);
        if (effects.hover.shadowEnabled) {
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = 4;
        }
      } else {
        textColor = baseColor;
      }
    }
    
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

  resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

}
