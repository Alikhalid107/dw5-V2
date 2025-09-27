// src/universal/UniversalPanelRenderer.js
import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";

export class UniversalPanelRenderer {
  static drawPanelBackground(ctx, x, y, width, height, config = UNIVERSAL_PANEL_CONFIG.PANEL_BACKGROUND) {
    if (!isFinite(x) || !isFinite(y) || !isFinite(width) || !isFinite(height)) return;
    ctx.fillStyle = config.color;
    ctx.fillRect(x, y, width, height);
  }

  /**
   * Draw a universal box.
   * renderType: 'factory' | 'garage' | 'upgrade' | (future types)
   * context: object with optional fields (factory, boxIndex, spriteManager, iconManager, canBuild, flakManager, showBorder, etc.)
   */
  static drawUniversalBox(ctx, state, renderType, context = {}) {
    if (!state || !state.bounds) return;

    // draw background first (background may depend on renderType and boxIndex)
    this.drawBoxBackground(ctx, state, renderType, context);

    // Dispatch to the appropriate content renderer
    const contentMethods = {
      upgrade: this.drawUpgradeContent,
      garage: this.drawGarageContent,
      factory: this.drawFactoryContent
    };

    const method = contentMethods[renderType];
    if (method) {
      method.call(this, ctx, state, context);
    } else {
      // Unknown/renderType fallback: try factory style if context.factory exists
      if (context.factory) {
        this.drawFactoryContent.call(this, ctx, state, context);
      } else {
        this.drawGarageContent.call(this, ctx, state, context);
      }
    }
  }

  /**
   * Draw background for a single box. Now considers factory's boxIndex so
   * factory upgrade boxes can get the same hover styling as 'upgrade' renderType.
   */
  static drawBoxBackground(ctx, state, renderType, context = {}) {
    const { x, y, width, height } = state.bounds;
    const { STYLING, EFFECTS } = UPGRADE_BUTTON_CONFIG;

    let bgColor = UNIVERSAL_PANEL_CONFIG.grid.boxColors.available;

    // Determine whether this should be treated as an "upgrade-like" box for styling:
    const isUpgradeLike = renderType === "upgrade" || (renderType === "factory" );

    // Apply styling based on render type and hover state (now handles factory upgrade)
    if (isUpgradeLike && state.isHovered) {
      bgColor = STYLING.hoverBackgroundColor;
    } else if (renderType === "garage" && state.isHovered) {
      bgColor = UNIVERSAL_PANEL_CONFIG.grid.hoverEffect;
    }

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    

    // Draw border if requested by context
    if (context.showBorder) {
      ctx.strokeStyle = context.borderColor || UNIVERSAL_PANEL_CONFIG.grid.borderColor;
      ctx.lineWidth = context.borderWidth || 1;
      ctx.strokeRect(x, y, width, height);
    }
  }
/////
 static applyHoverEffects(ctx, x, y, width, height, effects, disableGlow = false) {
  if (!effects) return;

  if (!disableGlow && effects.glowEnabled) {
    ctx.shadowColor = effects.buttonGlowColor;
    ctx.shadowBlur = effects.buttonGlowBlur;
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }

  if (effects.hoverOverlayEnabled) {
    ctx.fillStyle = effects.hoverOverlayColor;
    ctx.fillRect(x, y, width, height);
  }
}


  static drawUpgradeContent(ctx, state, context) {
    const { factory, spriteManager, iconManager } = context;
    if (!spriteManager || !factory) return;

    const sprite = spriteManager.getSprite(factory.type || "concrete");
    if (!sprite) {
      console.warn(`No sprite found for factory type: ${factory.type}`);
      return;
    }

    const { x, y, width, height } = state.bounds;
    const scaleFactor = this.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
    const dimensions = this.calculateSpriteDimensions(sprite, factory.type, scaleFactor);

    const spriteX = x + (width - dimensions.width) / 2;
    const spriteY = y + (height - dimensions.height) / 2;

    // Draw sprite and effects
    this.drawSpriteWithEffects(ctx, sprite, spriteX, spriteY, dimensions, state.isHovered);

    // Draw checkmark for max level factories
    this.drawMaxLevelIcon(ctx, factory, iconManager, x, y, width, state.isHovered);
  }

  static drawSpriteWithEffects(ctx, sprite, x, y, dimensions, isHovered) {
  
    ctx.imageSmoothingEnabled = true;
    sprite.drawFrame(ctx, 0, x, y, dimensions.width, dimensions.height);
    this.resetShadow(ctx);
  }

  static drawMaxLevelIcon(ctx, factory, iconManager, x, y, width, isHovered) {
    if (factory?.isMaxLevel?.() && iconManager?.isLoaded?.()) {
      const checkSize = isHovered ? 50 : 50;
      const checkX = x  ;
      const checkY = y ;

     

      iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
      this.resetShadow(ctx);
    }
  }

  static drawGarageContent(ctx, state, context) {
    const { canBuild, flakManager, boxIndex } = context;
    if (!canBuild || boxIndex !== 0) return;

    const { x, y, width, height } = state.bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
    ctx.textAlign = "center";

    if (flakManager?.canBuild()) {
      ctx.font = "18px Arial";
      ctx.fillText("+", centerX, centerY + 6);
    } else {
      ctx.font = "10px Arial";
      ctx.fillText("MAX", centerX, centerY - 4);
      ctx.fillText("CAP", centerX, centerY + 8);
    }
  }

  static drawFactoryContent(ctx, state, context) {
    const { boxIndex } = context;

    const actions = {
      0: () => this.drawUpgradeContent(ctx, state, context),
      1: () => this.drawProductionBoxContent(ctx, state, context.factory, "1h", "PROD"),
      2: () => this.drawProductionBoxContent(ctx, state, context.factory, "15h", "PROD")
    };

    actions[boxIndex]?.();
  }

  static drawProductionBoxContent(ctx, state, factory, timeText, subText) {
    const { x, y, width, height } = state.bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const factoryColors = {
      concrete: "#fcfc8bff",
      carbon: "#32CD32",
      steel: "#DC143C",
      oil: "#9932CC",
      default: "white"
    };

    const baseColor = factoryColors[factory?.type] ;

    // Text styling
    ctx.fillStyle = baseColor;
    ctx.textAlign = "center";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Main time text
    ctx.font = "16px Arial";
    ctx.strokeText(timeText, centerX, centerY - 2);
    ctx.fillText(timeText, centerX, centerY - 2);

    // Sub text
    ctx.font = "10px Arial";
    ctx.strokeText(subText, centerX, centerY + 12);
    ctx.fillText(subText, centerX, centerY + 12);
  }

  static drawPanelHeader(ctx, panelX, panelY, panelWidth, text, options = {}) {
    const padding = options.padding ?? 8;
    const font = options.font ?? UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
    const align = options.align ?? "left";
    const fillStyle = options.fillStyle ?? UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;

    const headerX = panelX + padding;
    const headerY = panelY + (options.offsetY ?? 18);

    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, headerX, headerY);
  }

  static getScaleFactor(factory, isHovered, baseScale) {
    const { STYLING } = UPGRADE_BUTTON_CONFIG;
    const scale = baseScale || STYLING.baseScaleFactor;
    return isHovered ? scale * STYLING.hoverScaleFactor : scale;
  }

  static calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    const cfg = FactoryConfig?.[factoryType];
    let origWidth, origHeight;

    if (cfg?.width && cfg?.height) {
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

    static drawDebugBorders(ctx, panelPos, hoverPos, targetPos, config = UNIVERSAL_PANEL_CONFIG.DEBUG) {
    if (!config.enabled) return;

    ctx.save();

    ctx.strokeStyle = config.colors.hoverArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.hoverArea);
    ctx.strokeRect(hoverPos.x, hoverPos.y, hoverPos.width, hoverPos.height);

    ctx.strokeStyle = config.colors.panelArea;
    ctx.lineWidth = 3;
    ctx.setLineDash(config.lineStyles.panelArea);
    ctx.strokeRect(panelPos.x, panelPos.y, panelPos.width, panelPos.height);

    ctx.strokeStyle = config.colors.targetArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.targetArea);
    ctx.strokeRect(targetPos.x, targetPos.y, targetPos.width, targetPos.height);

    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
    ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
    ctx.fillText('HOVER', hoverPos.x + 5, hoverPos.y + 15);
    ctx.fillText('PANEL', panelPos.x + 5, panelPos.y + 15);
    ctx.fillText('TARGET', targetPos.x + 5, targetPos.y + 15);

    ctx.restore();
  }


  static resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}
