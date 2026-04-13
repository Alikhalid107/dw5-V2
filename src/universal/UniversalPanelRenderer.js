// src/universal/UniversalPanelRenderer.js
import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";
import { IconManager } from '../utils/IconManager.js'; // adjust path as needed
import { PRODUCTION_BUTTONS_CONFIG } from "../config/ProductionButtonConfig.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";
import { WALL_CONFIG } from "../config/WallConfig.js";
import { GARAGE_CONFIG } from "../config/GarageConfig.js";
import { EXTENSION_PANEL_CONFIG } from "../config/ExtensionPanelConfig.js";
import { COMMAND_PANEL_CONFIG } from "../config/CommandPanelConfig.js";

const iconManager = new IconManager();


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
      factory: this.drawFactoryContent,
      tower: this.drawTowerContent,       // ← new
      extension: this.drawExtensionContent,  // ← add
      command: this.drawCommandContent,

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
    ctx.fillRect(x, y, width, height);
    this.resetShadow(ctx);
  }

  if (effects.hoverOverlayEnabled) {
    ctx.fillRect(x, y, width, height);
  }
  }

 static drawTowerContent(ctx, state, context) {
  const { x, y, width, height } = state.bounds;
  const { label, spriteManager, boxIndex, panelBounds, towerManager, iconManager } = context;

  if (spriteManager) {
    spriteManager.drawForBox(ctx, boxIndex, state.isHovered, x, y, width, height, panelBounds);
  } else {
    ctx.fillStyle = "white";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";
    ctx.fillText(label || "Tower", x + width / 2, y + height / 2 + 4);
  }

  // Check mark logic — same pattern as drawMaxLevelIcon
  const shouldShowCheck = this.isTowerBoxComplete(boxIndex, towerManager);
if (shouldShowCheck && iconManager?.isLoaded?.()) {
  const { checkMarkSize, checkMarkOffsetX, checkMarkOffsetY } = TOWER_PANEL_CONFIG.styling;
  iconManager.drawCheckMark(
    ctx,
    x + (checkMarkOffsetX ?? 0),  // ← offset from box x
    y + (checkMarkOffsetY ?? 0),  // ← offset from box y
    checkMarkSize ?? 40
  );
  this.resetShadow(ctx);
}
  }

// Helper — checks if a tower box should show the tick mark
  static isTowerBoxComplete(boxIndex, towerManager) {
  if (!towerManager) return false;
  switch (boxIndex) {
    case 0: return towerManager.militaryBuilding?.isMaxLevel() &&
                   towerManager.militaryBuildingRight?.isMaxLevel();
    case 1: return !!towerManager.radarBuilding;
    case 2: return !!towerManager.jammerBuilding;
    case 3: return !!towerManager.detectorBuilding;
    default: return false;
  }
  }

  static drawUpgradeContent(ctx, state, context) {
  const { factory, spriteManager, iconManager, panelBounds } = context;
  if (!spriteManager || !factory) return;

  const sprite = spriteManager.getSprite(factory.type);
  if (!sprite) return;

  const { x, y, width, height } = state.bounds;
  const scaleFactor = this.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
  const dimensions = this.calculateSpriteDimensions(sprite, factory.type, scaleFactor);

  const spriteX = x + (width - dimensions.width) / 2;
  const spriteY = y + (height - dimensions.height) / 2;

  ctx.save();
  // Clip to panel bounds if available, else fall back to box bounds
  const clip = panelBounds || { x, y, width, height };
  ctx.beginPath();
  ctx.rect(clip.x, clip.y, clip.width, clip.height);
  ctx.clip();

  this.drawSpriteWithEffects(ctx, sprite, spriteX, spriteY, dimensions, state.isHovered);
  this.drawMaxLevelIcon(ctx, factory, iconManager, x, y, width, state.isHovered);
  ctx.restore();
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
  const { canBuild, flakManager, boxIndex, wallSection, iconManager, garageSpriteManager, garageUI, panelBounds } = context;
  const { x, y, width, height } = state.bounds;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  if (boxIndex === 0) {
  // Always draw flak sprite (frame 0 static, animated on hover)
  if (garageSpriteManager) {
    garageSpriteManager.drawFlakInBox(ctx, state.isHovered, x, y, width, height, panelBounds);
  }

  // Draw + or MAX CAP text on top of sprite
  ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
  
  return;
}

  if (boxIndex === 1) {
    if (wallSection?.wallsUpgraded && iconManager?.isLoaded?.()) {
      const { checkMarkSize, checkMarkOffsetX, checkMarkOffsetY } = WALL_CONFIG.UI;
      iconManager.drawCheckMark(ctx, x + (checkMarkOffsetX ?? 0), y + (checkMarkOffsetY ?? 0), checkMarkSize ?? 35);
    } else {
      ctx.fillStyle = "white";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("WALL", centerX, centerY - 4);
      ctx.fillText("UP", centerX, centerY + 8);
    }
    return;
  }

  if (boxIndex === 2) {
    // Draw sprite in box — rotates on hover
    if (garageSpriteManager) {
      garageSpriteManager.drawInBox(ctx, state.isHovered, x, y, width, height, panelBounds);
    }

    // Tick mark when placed
    if (garageUI?.longRangeBuilding && iconManager?.isLoaded?.()) {
      const { size, offsetX: ox, offsetY: oy } = GARAGE_CONFIG.longRange.checkMark;
      iconManager.drawCheckMark(ctx, x + ox, y + oy, size);
    }
  }
  }

  static drawFactoryContent(ctx, state, context) {
  const { boxIndex, panelBounds } = context;

  const actions = {
    0: () => this.drawUpgradeContent(ctx, state, context),
    1: () => this.drawProductionBoxContent(ctx, state, context.factory, "1h", null, panelBounds),
    2: () => this.drawProductionBoxContent(ctx, state, context.factory, "15h", null, panelBounds)
  };

  actions[boxIndex]?.();
  }

  static drawProductionBoxContent(ctx, state, factory, timeText, subText, panelBounds) {
  const { x, y, width, height } = state.bounds;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  const { FACTORY_COLORS, FACTORY_ICONS, PRODUCTION_BOX } = PRODUCTION_BUTTONS_CONFIG;

  const baseColor = FACTORY_COLORS[factory?.type] || FACTORY_COLORS.default;
  const iconName = FACTORY_ICONS[factory?.type];

  if (iconName && iconManager.isLoaded()) {
    const multiplier = state.isHovered
      ? PRODUCTION_BOX.spriteHoverSizeMultiplier
      : PRODUCTION_BOX.spriteSizeMultiplier;

    const spriteSize = Math.min(width, height) * multiplier;
    const spriteX = centerX - spriteSize / 2;
    const spriteY = centerY - spriteSize / 2;

    ctx.save();
    // Clip to panel bounds so sprite doesn't exceed panel
    const clip = panelBounds || { x, y, width, height };
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();

    ctx.globalAlpha = PRODUCTION_BOX.spriteOpacity;
    iconManager.drawIcon(ctx, iconName, spriteX, spriteY, spriteSize, spriteSize);
    ctx.restore();
  }

  // Text always outside clip
  ctx.fillStyle = baseColor;
  ctx.textAlign = "center";
  ctx.strokeStyle = PRODUCTION_BOX.textStrokeColor;
  ctx.lineWidth = PRODUCTION_BOX.textStrokeWidth;
  ctx.font = PRODUCTION_BOX.textFont;
  ctx.strokeText(timeText, centerX, centerY + PRODUCTION_BOX.textOffsetY);
  ctx.fillText(timeText, centerX, centerY + PRODUCTION_BOX.textOffsetY);
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

 static drawExtensionContent(ctx, state, context) {
  const { x, y, width, height } = state.bounds;
  const { boxIndex, spriteManager, iconManager, extensionManager, panelBounds } = context;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  // Draw sprite for boxes 0, 2, 3
  if (boxIndex !== 1 && spriteManager) {
    spriteManager.drawForBox(ctx, boxIndex, state.isHovered, x, y, width, height, panelBounds);
  }

  // Box 1 — upgrade all: show text placeholder
  if (boxIndex === 1) {
    ctx.fillStyle = extensionManager?.upgradingAll ? "orange" : "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText(extensionManager?.upgradingAll ? "..." : "UP ALL", centerX, centerY + 4);
  }

  // Tick marks
  const shouldShowCheck = this.isExtensionBoxComplete(boxIndex, extensionManager);
  if (shouldShowCheck && iconManager?.isLoaded?.()) {
    const { checkMarkSize, checkMarkOffsetX, checkMarkOffsetY } = EXTENSION_PANEL_CONFIG.styling;
    iconManager.drawCheckMark(
      ctx,
      x + (checkMarkOffsetX ?? 0),
      y + (checkMarkOffsetY ?? 0),
      checkMarkSize ?? 40
    );
    this.resetShadow(ctx);
    }
  }

  static isExtensionBoxComplete(boxIndex, em) {
  if (!em) return false;
  switch (boxIndex) {
    case 0: return !!em.ministryBuilding?.isMaxLevel();
    case 1: return em.upgradeAllUsed &&   // ← only show tick after it was used
                   Object.values(em.factoryManager?.factories || {}).every(f => f.isMaxLevel());
    case 2: return !!em.officeBuilding?.isMaxLevel();
    case 3: return !!em.groupBuilding?.isMaxLevel();
    default: return false;
  }
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

  static drawBoxBackground(ctx, state, renderType, context = {}) {
  const { x, y, width, height } = state.bounds;
  const { STYLING } = UPGRADE_BUTTON_CONFIG;

  let bgColor = UNIVERSAL_PANEL_CONFIG.grid.boxColors.available;

  const isUpgradeLike = renderType === "upgrade" || renderType === "factory" || renderType === "tower" || renderType === "extension" || renderType === "command";  // ← add this

  if (isUpgradeLike && state.isHovered) {
    bgColor = STYLING.hoverBackgroundColor;
  } else if (renderType === "garage" && state.isHovered) {
    bgColor = UNIVERSAL_PANEL_CONFIG.grid.hoverEffect;
  }

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);

  if (context.showBorder) {
    ctx.strokeStyle = context.borderColor || UNIVERSAL_PANEL_CONFIG.grid.borderColor;
    ctx.lineWidth = context.borderWidth || 1;
    ctx.strokeRect(x, y, width, height);
  }
  }

  static resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  static drawCommandContent(ctx, state, context) {
  const { x, y, width, height } = state.bounds;
  const { boxIndex, spriteManager, iconManager, commandManager, panelBounds } = context;

  // Draw sprite for all boxes
  if (spriteManager) {
    spriteManager.drawForBox(ctx, boxIndex, state.isHovered, x, y, width, height, panelBounds, iconManager, commandManager?.commandBuilding);
  }

  // Tick mark for box 0 when max level
  if (boxIndex === 0) {
    const shouldShowCheck = commandManager?.commandBuilding?.isMaxLevel();
    if (shouldShowCheck && iconManager?.isLoaded?.()) {
      const { checkMarkSize, checkMarkOffsetX, checkMarkOffsetY } = COMMAND_PANEL_CONFIG.styling;
      iconManager.drawCheckMark(ctx, x + checkMarkOffsetX, y + checkMarkOffsetY, checkMarkSize);
      this.resetShadow(ctx);
    }

    
  }
  }
}
