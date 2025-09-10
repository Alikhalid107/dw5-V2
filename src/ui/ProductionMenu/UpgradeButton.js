import { PanelBase } from './PanelBase.js';
import { FACTORY_PANEL_CONFIG } from '../../config/FactoryPanelConfig.js';
import { FactoryConfig } from '../../config/FactoryConfig.js';
import { IconManager } from '../../utils/IconManager.js';
import { SpriteFrameUtility } from '../../utils/SpriteFrameUtility.js';

export class UpgradeButton extends PanelBase {
  constructor() {
    super();
    this.buttonWidth = FACTORY_PANEL_CONFIG.COMPONENT_SIZES.upgradeButtonWidth;
    this.buttonHeight = FACTORY_PANEL_CONFIG.COMPONENT_SIZES.upgradeButtonHeight;
    this.buttonBounds = null;
    this.isButtonHovered = false;
    this.iconManager = new IconManager();

    // Preload factory sprite sheets
    this.factorySprites = {};
    this.factorySpritePaths = {
      'concrete': 'concreteFactory.png',
      'steel': 'steelFactory.png',
      'carbon': 'carbonFactory.png',
      'oil': 'oilFactory.png'
    };
    this.loadFactorySprites();
  }

  loadFactorySprites() {
    for (const [type, path] of Object.entries(this.factorySpritePaths)) {
      this.factorySprites[type] = new SpriteFrameUtility(path, 10);
    }
  }

  draw(ctx, x, y, factory) {
    this.buttonBounds = this._bounds(x, y, this.buttonWidth, this.buttonHeight);

    // Background
    const colors = {
      upgrading: "rgba(255, 165, 0, 0.8)",
      maxLevel: "rgba(115, 145, 167, 0.7)",
      default: "rgba(115, 145, 167, 0.7)",
    };
    
    let bgColor = colors.default;
    if (factory.upgrading) {
      bgColor = colors.upgrading;
    } else if (factory.isMaxLevel()) {
      bgColor = colors.maxLevel;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);

    // Factory sprite
    const factoryType = factory.type || 'concrete';
    const factorySprite = this.factorySprites[factoryType];
    const scaleFactor = factory.scaleFactor || 0.6;

    if (factorySprite && factorySprite.isFrameLoaded()) {
      // Get original sprite dimensions
      let origWidth, origHeight;
      const cfg = FactoryConfig && FactoryConfig[factoryType];
      if (cfg && cfg.width && cfg.height) {
        origWidth = cfg.width;
        origHeight = cfg.height;
      } else {
        const frameSize = factorySprite.getFrameSize();
        origWidth = frameSize.width;
        origHeight = frameSize.height;
      }

      // Calculate draw dimensions (fixed size regardless of zoom)
      const drawWidth = origWidth * scaleFactor;
      const drawHeight = origHeight * scaleFactor;

      // Center the sprite in the button
      const spriteX = x + (this.buttonWidth - drawWidth) / 2;
      const spriteY = y + (this.buttonHeight - drawHeight) / 2;

      // Draw the sprite
      ctx.imageSmoothingEnabled = true;
      factorySprite.drawFrame(ctx, 0, spriteX, spriteY, drawWidth, drawHeight);
    } else {
      this._drawFallbackText(ctx, x, y, factory);
    }

    // Checkmark overlay for max level
    if (factory.isMaxLevel() && this.iconManager.isLoaded()) {
      const checkSize = Math.min(this.buttonWidth, this.buttonHeight) * 1.3;
      const checkX = x + (this.buttonWidth - checkSize) / 2;
      const checkY = y + (this.buttonHeight - checkSize) / 2;
      this.iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
    }

    // Progress bar for upgrading
    if (factory.upgrading) {
      const progress = factory.getUpgradeProgress();
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillRect(x, y + this.buttonHeight - 3, this.buttonWidth * progress, 3);
    }

    // Hover overlay
    if (this.isButtonHovered) {
      ctx.fillStyle = "rgba(255, 255, 255, 1)";
      ctx.fillRect(x, y, this.buttonWidth, this.buttonHeight);
    }
  }

  handleClick(mouseX, mouseY, factory) {
    if (this.isPointInBounds(mouseX, mouseY, this.buttonBounds)) {
      return !factory.upgrading && !factory.isMaxLevel();
    }
    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.isButtonHovered = this.buttonBounds
      ? this.isPointInBounds(mouseX, mouseY, this.buttonBounds)
      : false;
  }
}