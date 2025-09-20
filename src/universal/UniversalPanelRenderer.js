// src/universal/UniversalPanelRenderer.js
import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";
import { PanelBase } from "../ui/ProductionMenu/PanelBase.js";

export class UniversalPanelRenderer {

  static drawPanelBackground(ctx, x, y, width, height, config = UNIVERSAL_PANEL_CONFIG.PANEL_BACKGROUND) {
  if (!isFinite(x) || !isFinite(y)) return;
  if (!isFinite(width) || !isFinite(height)) return;
  

  ctx.fillStyle = config.color; // just use solid color
  ctx.fillRect(x, y, width, height);
  }


  static drawFactoryInfo(ctx, x, y, factory, config = UNIVERSAL_PANEL_CONFIG) {
    if (!factory) return;

    const { positioning, text } = config.COMPONENTS;

    this.drawText(
      ctx,
      factory.name.replace(" Factory", ""),
      x + positioning.factoryInfoOffsetX,
      y + positioning.factoryInfoOffsetY1,
      text.factoryNameFont
    );

    const statusText = factory.upgrading
      ? `Upgrading... ${factory.getRemainingUpgradeTime()}s`
      : factory.isMaxLevel()
        ? `Level ${factory.level} (MAX)`
        : `Level ${factory.level} → ${factory.level + 1}`;

    this.drawText(
      ctx,
      statusText,
      x + positioning.factoryInfoOffsetX,
      y + positioning.factoryInfoOffsetY2,
      text.factoryStatusFont,
      "left",
      text.colors.factoryStatus
    );
  }

  static drawUniversalBox(ctx, state, renderType, context) {
    const { bounds } = state;
    if (!bounds) return;
    
    this.drawBoxBackground(ctx, state, renderType, context);
    
    switch (renderType) {
      case 'upgrade': this.drawUpgradeContent(ctx, state, context); break;
      case 'garage': this.drawGarageContent(ctx, state, context); break;
      // case 'production': this.drawProductionContent(ctx, state, context); break;
    }
    
    // this.drawOverlays(ctx, state, renderType, context);
  }

  static drawBoxBackground(ctx, state, renderType, context) {
  const { x, y, width, height } = state.bounds;
  const bgColor = UNIVERSAL_PANEL_CONFIG.grid.boxColors.available;

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, width, height);

  // Decide hover overlay visibility:
  const isHovered = !!state.isHovered;
  let hoverAllowed = false;

  // For garage, allow hover overlay purely based on hover (so flak max doesn't disable it).
  if (renderType === 'garage') {
    hoverAllowed = isHovered;
  } 
  // else {
  //   // For other render types, keep previous rules
  //   hoverAllowed = isHovered && this.shouldShowHover(renderType, context);
  // }

  if (hoverAllowed) {
    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.grid.hoverEffect;
    ctx.fillRect(x, y, width, height);
  }

  if (context.showBorder) {
    ctx.strokeStyle = context.borderColor || UNIVERSAL_PANEL_CONFIG.grid.borderColor;
    ctx.lineWidth = context.borderWidth || 1;
    ctx.strokeRect(x, y, width, height);
  }
}


  static drawUpgradeContent(ctx, state, context) {
    const { factory, spriteManager } = context;
    if (!spriteManager) return;

    const sprite = spriteManager.getSprite(factory.type || 'concrete');
    const { x, y, width, height } = state.bounds;
    const scaleFactor = this.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
    const dimensions = this.calculateSpriteDimensions(sprite, factory.type, scaleFactor);

    const spriteX = x + (width - dimensions.width) / 2;
    const spriteY = y + (height - dimensions.height) / 2;

    ctx.imageSmoothingEnabled = true;
    sprite.drawFrame(ctx, 0, spriteX, spriteY, dimensions.width, dimensions.height);
  }

 static drawGarageContent(ctx, state, context) {
  const { canBuild, flakManager, boxIndex } = context;
  if (!canBuild) return;

  // Only show flak-specific UI for the flak slot (index 0)
  if (boxIndex !== 0) return;

  const { x, y, width, height } = state.bounds;
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
  ctx.textAlign = 'center';

  if (flakManager?.canBuild()) {
    ctx.font = '18px Arial';
    ctx.fillText('+', centerX, centerY + 6);
  } else {
    ctx.font = '10px Arial';
    ctx.fillText('MAX', centerX, centerY - 4);
    ctx.fillText('CAP', centerX, centerY + 8);
  }
  }


  // static drawProductionContent(ctx, state, context) {
  //   const { factory } = context;
  //   if (!factory?.isProducing) return;

  //   const { x, y, width, height } = state.bounds;
  //   ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress.fillColor;
  //   ctx.fillRect(x + 2, y + height - 4, (width - 4) * factory.productionProgress, 2);
  // }

 

  // static drawOverlays(ctx, state, renderType, context) {
  //   if (renderType === 'upgrade' && context.factory?.isMaxLevel() && context.iconManager) {
  //     this.drawMaxLevelOverlay(ctx, state, context.iconManager);
  //   }
  // }

  // static drawMaxLevelOverlay(ctx, state, iconManager) {
  //   if (!iconManager?.isLoaded()) return;

  //   const { x, y, width, height } = state.bounds;
  //   const checkSettings = this.getCheckmarkSettings();
  //   const checkSize = state.isHovered ? checkSettings.baseSize * checkSettings.hoverScale : checkSettings.baseSize;
  //   const checkX = x + (width - checkSize) / 2;
  //   const checkY = y + (height - checkSize) / 2;

  //   if (state.isHovered) {
  //     ctx.shadowColor = checkSettings.glowColor;
  //     ctx.shadowBlur = checkSettings.glowBlur;
  //   }

  //   iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
  //   this.resetShadow(ctx);
  // }

  static drawCompletePanel(ctx, x, y, width, height, options = {}) {
    const {
      backgroundConfig = UNIVERSAL_PANEL_CONFIG.LAYOUT,
      factory = null,
      showFactoryInfo = false
    } = options;

    this.drawPanelBackground(ctx, x, y, width, height, backgroundConfig);
    if (showFactoryInfo && factory) {
      this.drawFactoryInfo(ctx, x, y, factory);
    }
  }

  // inside UniversalPanelRenderer class

static drawPanelHeader(ctx, panelX, panelY, panelWidth, text, options = {}) {
  // options: { padding = 8, font, align, fillStyle }
  const padding = options.padding ?? 8;
  const font = options.font ?? UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
  const align = options.align ?? "left";
  const fillStyle = options.fillStyle ?? UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;

  // x,y to place header: place inside panel top area
  const headerX = panelX + padding;
  const headerY = panelY + (options.offsetY ?? 18); // tweak for vertical placement

  this.drawText(ctx, text, headerX, headerY, font, align, fillStyle);
}


  // static getBackgroundColor(renderType, context) {
  //   switch (renderType) {
  //     default: return UNIVERSAL_PANEL_CONFIG.grid.boxColors.available;
  //   }
  // }

//  static getGarageColor(canBuild, flakManager, boxIndex = 0, gridConfig = {}) {
//   const colors = UNIVERSAL_PANEL_CONFIG.grid.boxColors;

//   // Decide the canonical flak slot index.
//   // If you store flak slot in config (recommended), use that; otherwise default to 0.
//   const flakSlotIndex = (gridConfig.panel && gridConfig.panel.flakIndex !== undefined)
//     ? gridConfig.panel.flakIndex
//     : 0;

//   // Non-flak slots: color based on "canBuild" only (independent of flakManager).
//   if (boxIndex !== flakSlotIndex) {
//     return canBuild ? colors.available : colors.disabled;
//   }

//   // Flak slot: use flak manager state to set color.
//   if (!canBuild) return colors.disabled;
//   if (flakManager?.isBuilding()) return colors.building;
//   if (!flakManager?.canBuild()) return colors.maxCapacity;
//   return colors.available;
// }

  // static getUpgradeColor(factory, isHovered) {
  //   const { STYLING } = UPGRADE_BUTTON_CONFIG;
  //   if (isHovered) return STYLING.hoverBackgroundColor;
  //   return UNIVERSAL_PANEL_CONFIG.grid.boxColors.available;
  // }

  // static getProductionColor(factory, isHovered) {
  //   if (factory?.isProducing) return '#2a4a2a';
  //   if (isHovered) return '#3a3a4a';
  //   return '#2a2a3a';
  // }

  // static shouldShowHover(renderType, context) {
  //   switch (renderType) {
  //     case 'garage': return context.canBuild && context.flakManager?.canBuild();
  //     case 'upgrade': return !context.factory?.upgrading && !context.factory?.isMaxLevel();
  //     default: return true;
  //   }
  // }

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

  // static getCheckmarkSettings() {
  //   const { EFFECTS } = UPGRADE_BUTTON_CONFIG;
  //   return {
  //     checkMark: EFFECTS.checkmarkGlowColor,
  //   };
  // }

  static drawText(ctx, text, x, y, font, align = "left", fillStyle = "#ffffff") {
    const panelBase = new PanelBase();
    panelBase.drawText(ctx, text, x, y, font, align, fillStyle);
  }

  // static drawDebugBorders(ctx, panelPos, hoverPos, targetPos, config = UNIVERSAL_PANEL_CONFIG.DEBUG) {
  //   if (!config.enabled) return;

  //   ctx.save();

  //   ctx.strokeStyle = config.colors.hoverArea;
  //   ctx.lineWidth = 2;
  //   ctx.setLineDash(config.lineStyles.hoverArea);
  //   ctx.strokeRect(hoverPos.x, hoverPos.y, hoverPos.width, hoverPos.height);

  //   ctx.strokeStyle = config.colors.panelArea;
  //   ctx.lineWidth = 3;
  //   ctx.setLineDash(config.lineStyles.panelArea);
  //   ctx.strokeRect(panelPos.x, panelPos.y, panelPos.width, panelPos.height);

  //   ctx.strokeStyle = config.colors.targetArea;
  //   ctx.lineWidth = 2;
  //   ctx.setLineDash(config.lineStyles.targetArea);
  //   ctx.strokeRect(targetPos.x, targetPos.y, targetPos.width, targetPos.height);

  //   ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
  //   ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
  //   ctx.fillText('HOVER', hoverPos.x + 5, hoverPos.y + 15);
  //   ctx.fillText('PANEL', panelPos.x + 5, panelPos.y + 15);
  //   ctx.fillText('TARGET', targetPos.x + 5, targetPos.y + 15);

  //   ctx.restore();
  // }

  static resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}

export const PanelRenderer = {
  drawBackground: UniversalPanelRenderer.drawPanelBackground.bind(UniversalPanelRenderer),
  drawFactoryInfo: UniversalPanelRenderer.drawFactoryInfo.bind(UniversalPanelRenderer),
  drawBox: UniversalPanelRenderer.drawUniversalBox.bind(UniversalPanelRenderer),
  // drawDebug: UniversalPanelRenderer.drawDebugBorders.bind(UniversalPanelRenderer)
};