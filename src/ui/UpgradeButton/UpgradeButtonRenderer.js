// UpgradeButtonRenderer.js - Handles all rendering operations
import { FactoryConfig } from '../../config/FactoryConfig.js';
export class UpgradeButtonRenderer {
  constructor(iconManager, spriteManager, styles) {
    this.iconManager = iconManager;
    this.spriteManager = spriteManager;
    this.styles = styles;
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
    const { x, y, width, height } = state.bounds;
    const bgColor = this.styles.getBackgroundColor(factory, state.isHovered);
    
    // Add glow effect on hover
    if (this.styles.shouldShowGlow(factory, state.isHovered)) {
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 12;
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
      ctx.shadowBlur = 8;
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
    const baseCheckSize = Math.min(width, height) * 1.3;
    const checkSize = state.isHovered ? baseCheckSize * 1.1 : baseCheckSize;
    const checkX = x + (width - checkSize) / 2;
    const checkY = y + (height - checkSize) / 2;
    
    if (state.isHovered) {
      ctx.shadowColor = "rgba(0, 255, 0, 0.6)";
      ctx.shadowBlur = 6;
    }
    
    this.iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
    this.resetShadow(ctx);
  }

  drawUpgradeProgress(ctx, state, factory) {
    if (!factory.upgrading) return;

    const { x, y, width, height } = state.bounds;
    const progress = factory.getUpgradeProgress();
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillRect(x, y + height - 3, width * progress, 3);
  }

  drawHoverOverlay(ctx, state, factory) {
    if (!state.isHovered || factory.upgrading) return;

    const { x, y, width, height } = state.bounds;
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(x, y, width, height);
  }

  drawFallbackText(ctx, state, factory) {
    const { x, y, width, height } = state.bounds;
    const baseFontSize = 16;
    const fontSize = state.isHovered ? baseFontSize * 1.1 : baseFontSize;
    
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const textX = x + width / 2;
    const textY = y + height / 2;
    
    // Text outline
    ctx.strokeStyle = "black";
    ctx.lineWidth = state.isHovered ? 3 : 2;
    ctx.strokeText("UP", textX, textY);
    
    // Main text
    if (this.styles.shouldShowGlow(factory, state.isHovered)) {
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.shadowBlur = 4;
    } else {
      ctx.fillStyle = "#cccccc";
    }
    
    ctx.fillText("UP", textX, textY);
    this.resetShadow(ctx);
  }

  resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}