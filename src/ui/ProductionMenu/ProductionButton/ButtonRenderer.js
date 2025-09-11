export class ButtonRenderer {
  constructor(iconManager, factoryStyleConfig) {
    this.iconManager = iconManager;
    this.factoryStyles = factoryStyleConfig;
  }

  draw(ctx, x, y, button, factory, isDisabled = false) {
    this.drawBackground(ctx, x, y, button, isDisabled);
    this.drawFactoryIcon(ctx, x, y, button, factory.type, isDisabled);
    this.drawButtonText(ctx, x, y, button, factory.type, isDisabled);
    this.drawHoverOverlay(ctx, x, y, button, isDisabled);
  }

  drawBackground(ctx, x, y, button, isDisabled) {
    const { width, height, hovered } = button;
    
    if (hovered && !isDisabled) {
      ctx.fillStyle = "rgba(180, 210, 235, 0.9)";
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    } else {
      ctx.fillStyle = "rgba(115, 145, 167, 0.7)";
    }
    
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }

  drawFactoryIcon(ctx, x, y, button, factoryType, isDisabled) {
    if (!factoryType || !this.iconManager.isLoaded()) return;

    const iconName = this.factoryStyles.getIconName(factoryType);
    if (!iconName) return;

    const { width, height, hovered } = button;
    const baseIconSize = 48;
    const iconSize = hovered && !isDisabled ? baseIconSize * 1.2 : baseIconSize;
    const iconX = x + (width - iconSize) / 2;
    const iconY = y + (height - iconSize) / 2;
    
    if (hovered && !isDisabled) {
      ctx.shadowColor = this.factoryStyles.getColor(factoryType);
      ctx.shadowBlur = 8;
    }
    
    this.iconManager.drawIcon(ctx, iconName, iconX, iconY, iconSize, iconSize);
    this.resetShadow(ctx);
  }

  drawButtonText(ctx, x, y, button, factoryType, isDisabled) {
    const { width, height, label, hovered } = button;
    const baseFontSize = 20;
    const fontSize = hovered && !isDisabled ? baseFontSize * 1 : baseFontSize;
    
    ctx.font = `${fontSize}px Tahoma`;
    ctx.textAlign = "center";
    
    const textX = x + width / 2;
    const textY = y + height / 2 + 5;

    // Draw outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeText(label, textX, textY);

    // Draw main text
    const baseColor = this.factoryStyles.getColor(factoryType);
    if (hovered && !isDisabled) {
      ctx.fillStyle = this.factoryStyles.brightenColor(baseColor, 0.3);
      ctx.shadowColor = baseColor;
      ctx.shadowBlur = 4;
    } else {
      ctx.fillStyle = baseColor;
    }
    
    ctx.fillText(label, textX, textY);
    this.resetShadow(ctx);
  }

  drawHoverOverlay(ctx, x, y, button, isDisabled) {
    if (button.hovered && !isDisabled) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.fillRect(x, y, button.width, button.height);
    }
  }

  resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}
