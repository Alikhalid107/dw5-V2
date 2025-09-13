import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";
import { FactoryConfig } from "../../config/FactoryConfig.js";

export class UpgradeButtonRenderer {
  constructor(iconManager, spriteManager, styles, config = UPGRADE_BUTTON_CONFIG) {
    this.iconManager = iconManager;
    this.spriteManager = spriteManager;
    this.styles = styles;
    this.config = config;
  }

  draw(ctx, state, factory) {
    const { x, y } = state.bounds;
    
    this.drawBackground(ctx, state, factory);
    this.drawFactorySprite(ctx, state, factory);
    this.drawMaxLevelOverlay(ctx, state, factory);
    this.drawUpgradeProgress(ctx, state, factory);
    this.drawHoverOverlay(ctx, state, factory);
  }

  drawBackground(ctx, state, factory) {
    if (!this.config.EFFECTS.shadowEnabled) return;
    
    const { x, y, width, height } = state.bounds;
    const bgColor = this.styles.getBackgroundColor(factory, state.isHovered);
    
    // Add glow effect on hover
    if (this.styles.shouldShowGlow(factory, state.isHovered)) {
      const glowSettings = this.styles.getButtonGlowSettings();
      ctx.shadowColor = glowSettings.color;
      ctx.shadowBlur = glowSettings.blur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }

  drawFactorySprite(ctx, state, factory) {
    const factoryType = factory.type || 'concrete';
    const sprite = this.spriteManager.getSprite(factoryType);
    
    if (!this.spriteManager.isSpriteLoaded(factoryType)) {
      this.drawFallbackText(ctx, state, factory);
      return;
    }

    const { x, y, width, height } = state.bounds;
    const scaleFactor = this.styles.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
    const dimensions = this.calculateSpriteDimensions(sprite, factoryType, scaleFactor);
    
    // Center the sprite
    const spriteX = x + (width - dimensions.width) / 2;
    const spriteY = y + (height - dimensions.height) / 2;

    // Add glow for hovered sprite
    if (this.styles.shouldShowGlow(factory, state.isHovered)) {
      ctx.shadowColor = this.styles.getFactoryGlowColor(factoryType);
      const glowSettings = this.styles.getSpriteGlowSettings();
      ctx.shadowBlur = glowSettings.blur;
    }

    ctx.imageSmoothingEnabled = true;
    sprite.drawFrame(ctx, 0, spriteX, spriteY, dimensions.width, dimensions.height);
    this.resetShadow(ctx);
  }

  calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    let origWidth, origHeight;
    const cfg = FactoryConfig && FactoryConfig[factoryType];
    
    if (cfg && cfg.width && cfg.height) {
      origWidth = cfg.width;
      origHeight = cfg.height;
    } else {
      const frameSize = sprite.getFrameSize();
      origWidth = frameSize.width;
      origHeight = frameSize.height;
    }

    return {
      width: origWidth * scaleFactor,
      height: origHeight * scaleFactor
    };
  }

  drawMaxLevelOverlay(ctx, state, factory) {
    if (!factory.isMaxLevel() || !this.iconManager.isLoaded()) return;

    const { x, y, width, height } = state.bounds;
    const checkSettings = this.styles.getCheckmarkSettings();
    const checkSize = state.isHovered ? checkSettings.baseSize * checkSettings.hoverScale : checkSettings.baseSize;
    const checkX = x + (width - checkSize) / 2;
    const checkY = y + (height - checkSize) / 2;
    
    if (state.isHovered) {
      ctx.shadowColor = checkSettings.glowColor;
      ctx.shadowBlur = checkSettings.glowBlur;
    }
    
    this.iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
    this.resetShadow(ctx);
  }

  drawUpgradeProgress(ctx, state, factory) {
    if (!factory.upgrading || !this.config.EFFECTS.progressBarEnabled) return;

    const { x, y, width, height } = state.bounds;
    const progress = factory.getUpgradeProgress();
    const progressSettings = this.styles.getProgressBarSettings();
    
    ctx.fillStyle = progressSettings.backgroundColor;
    ctx.fillRect(x, y + height - progressSettings.height, width * progress, progressSettings.height);
  }

  drawHoverOverlay(ctx, state, factory) {
    if (!state.isHovered || factory.upgrading || !this.config.EFFECTS.hoverOverlayEnabled) return;

    const { x, y, width, height } = state.bounds;
    ctx.fillStyle = this.styles.getHoverOverlayColor();
    ctx.fillRect(x, y, width, height);
  }

  drawFallbackText(ctx, state, factory) {
    const { x, y, width, height } = state.bounds;
    const textSettings = this.styles.getFallbackTextSettings(state.isHovered);
    
    ctx.font = `${textSettings.fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const textX = x + width / 2;
    const textY = y + height / 2;
    
    // Text outline
    ctx.strokeStyle = textSettings.outlineColor;
    ctx.lineWidth = textSettings.outlineWidth;
    ctx.strokeText(textSettings.text, textX, textY);
    
    // Main text
    if (this.styles.shouldShowGlow(factory, state.isHovered)) {
      ctx.fillStyle = textSettings.textColor;
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 4;
    } else {
      ctx.fillStyle = textSettings.textColor;
    }
    
    ctx.fillText(textSettings.text, textX, textY);
    this.resetShadow(ctx);
  }

  resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}