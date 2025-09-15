import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { GARAGE_UI_CONFIG } from "../config/GarageUIConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";
import { PanelBase } from "../ui/ProductionMenu/PanelBase.js";

/**
 * Unified Universal Panel Renderer
 * Handles ALL rendering for panels, boxes, backgrounds, and content
 * Supports: Factory Panels, Garage Panels, Grid Boxes, Upgrade Buttons, Production Elements
 */
export class UniversalPanelRenderer {
  
  // =============================================================================
  // PANEL BACKGROUND RENDERING
  // =============================================================================
  static drawPanelBackground(ctx, x, y, width, height, config = UNIVERSAL_PANEL_CONFIG.LAYOUT) {
    if (!isFinite(x) || !isFinite(y)) return;
    
    // Handle expanded width if needed (for factory panels with buttons)
    const finalWidth = width + (config.expandedPanelWidthOffset || 0);
    
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, config.backgroundGradient.start);
    gradient.addColorStop(1, config.backgroundGradient.end);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, finalWidth, height);
  }

  // =============================================================================
  // FACTORY INFO RENDERING
  // =============================================================================
  static drawFactoryInfo(ctx, x, y, factory, config = UNIVERSAL_PANEL_CONFIG) {
    if (!factory) return;
    
    const { positioning, text } = config.COMPONENTS;
    
    // Factory name
    this.drawText(
      ctx,
      factory.name.replace(" Factory", ""),
      x + positioning.factoryInfoOffsetX,
      y + positioning.factoryInfoOffsetY1,
      text.factoryNameFont
    );
    
    // Factory status
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

  // =============================================================================
  // UNIVERSAL BOX RENDERING - Main method for all box types
  // =============================================================================
  static drawUniversalBox(ctx, state, renderType, context) {
    const { bounds } = state;
    if (!bounds) return;

    // Draw background
    this.drawBoxBackground(ctx, state, renderType, context);

    // Draw content based on type
    switch (renderType) {
      case 'upgrade':
        this.drawUpgradeContent(ctx, state, context);
        break;
      case 'garage':
        this.drawGarageContent(ctx, state, context);
        break;
      case 'production':
        this.drawProductionContent(ctx, state, context);
        break;
      case 'grid':
        this.drawGridContent(ctx, state, context);
        break;
      default:
        this.drawDefaultContent(ctx, state, context);
    }

    // Draw overlays
    this.drawOverlays(ctx, state, renderType, context);
  }

  // =============================================================================
  // BOX BACKGROUND RENDERING
  // =============================================================================
  static drawBoxBackground(ctx, state, renderType, context) {
    const { x, y, width, height } = state.bounds;
    const bgColor = this.getBackgroundColor(renderType, context);

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    // Add hover effect if needed
    if (state.isHovered && this.shouldShowHover(renderType, context)) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.GRID.hoverEffect;
      ctx.fillRect(x, y, width, height);
    }

    // Add border if specified
    if (context.showBorder) {
      ctx.strokeStyle = context.borderColor || UNIVERSAL_PANEL_CONFIG.GRID.borderColor;
      ctx.lineWidth = context.borderWidth || 1;
      ctx.strokeRect(x, y, width, height);
    }
  }

  // =============================================================================
  // CONTENT RENDERING METHODS
  // =============================================================================
  
  // Upgrade Button Content
  static drawUpgradeContent(ctx, state, context) {
    const { factory, spriteManager, iconManager } = context;
    if (!spriteManager) return;

    const factoryType = factory.type || 'concrete';
    const sprite = spriteManager.getSprite(factoryType);
    
    const { x, y, width, height } = state.bounds;
    const scaleFactor = this.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
    const dimensions = this.calculateSpriteDimensions(sprite, factoryType, scaleFactor);
    
    // Center the sprite
    const spriteX = x + (width - dimensions.width) / 2;
    const spriteY = y + (height - dimensions.height) / 2;

    ctx.imageSmoothingEnabled = true;
    sprite.drawFrame(ctx, 0, spriteX, spriteY, dimensions.width, dimensions.height);
  }

  // Garage Content
 static drawGarageContent(ctx, state, context) {
  const { canBuild, flakManager } = context;
  const { x, y, width, height } = state.bounds;
  
  // Handle all garage content rendering including the "+" and "MAX CAP" logic
  if (canBuild) {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
    ctx.textAlign = 'center';
    
    if (flakManager?.canBuild()) {
      // Can build - show "+"
      ctx.font = '18px Arial';
      ctx.fillText('+', centerX, centerY + 6);
    } else {
      // Max capacity - show message
      ctx.font = '10px Arial';
      ctx.fillText('MAX', centerX, centerY - 4);
      ctx.fillText('CAP', centerX, centerY + 8);
    }
  }
}

  // Production Content
  static drawProductionContent(ctx, state, context) {
    const { factory } = context;
    const { x, y, width, height } = state.bounds;
    
    if (factory?.isProducing) {
      // Draw production indicator
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress.fillColor;
      ctx.fillRect(x + 2, y + height - 4, (width - 4) * factory.productionProgress, 2);
    }
  }

  // Grid Content (for garage grids)
  static drawGridContent(ctx, state, context) {
    const { content, isHovered } = context;
    const { x, y, width, height } = state.bounds;
    const config = UNIVERSAL_PANEL_CONFIG.GRID;

    // Draw content text
    if (content?.text && content.text.length > 0) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
      ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.defaultFont;
      ctx.textAlign = 'center';

      const centerX = x + width / 2;
      content.text.forEach((line, index) => {
        const textY = y + GARAGE_UI_CONFIG.content.textOffsetY[index];
        ctx.fillText(line, centerX, textY);
      });
    }

    // Draw progress bar if needed
    if (content?.progress !== undefined) {
      const progressConfig = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress;
      const progressBarWidth = width - 10;
      const progressX = x + 5;
      const progressY = y + height - GARAGE_UI_CONFIG.content.progressBarOffset;

      ctx.fillStyle = progressConfig.backgroundColor;
      ctx.fillRect(progressX, progressY, progressBarWidth, progressConfig.height);

      ctx.fillStyle = progressConfig.fillColor;
      ctx.fillRect(progressX, progressY, progressBarWidth * content.progress, progressConfig.height);
    }

    // Simple content for garage boxes
    if (context.canBuild && context.flakManager) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      
      if (context.flakManager.canBuild()) {
        // Can build - show "+"
        ctx.font = '18px Arial';
        ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
        ctx.textAlign = 'center';
        ctx.fillText('+', centerX, centerY + 6);
      } else {
        // Max capacity - show message
        ctx.font = '10px Arial';
        ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
        ctx.textAlign = 'center';
        ctx.fillText('MAX', centerX, centerY - 4);
        ctx.fillText('CAP', centerX, centerY + 8);
      }
    }
  }

  // Default Content
  static drawDefaultContent(ctx, state, context) {
    // Placeholder for future content types
    const { x, y, width, height } = state.bounds;
    if (context.text) {
      this.drawText(ctx, context.text, x + width/2, y + height/2, "12px Arial", "center");
    }
  }

  // =============================================================================
  // OVERLAY RENDERING
  // =============================================================================
  static drawOverlays(ctx, state, renderType, context) {
    if (renderType === 'upgrade' && context.factory?.isMaxLevel() && context.iconManager) {
      this.drawMaxLevelOverlay(ctx, state, context.iconManager);
    }
  }

  static drawMaxLevelOverlay(ctx, state, iconManager) {
    if (!iconManager?.isLoaded()) return;

    const { x, y, width, height } = state.bounds;
    const checkSettings = this.getCheckmarkSettings();
    const checkSize = state.isHovered ? checkSettings.baseSize * checkSettings.hoverScale : checkSettings.baseSize;
    const checkX = x + (width - checkSize) / 2;
    const checkY = y + (height - checkSize) / 2;
    
    if (state.isHovered) {
      ctx.shadowColor = checkSettings.glowColor;
      ctx.shadowBlur = checkSettings.glowBlur;
    }
    
    iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
    this.resetShadow(ctx);
  }

  // =============================================================================
  // COMPLETE PANEL RENDERING - One method to rule them all
  // =============================================================================
  static drawCompletePanel(ctx, x, y, width, height, options = {}) {
    const {
      backgroundConfig = UNIVERSAL_PANEL_CONFIG.LAYOUT,
      factory = null,
      gridContent = null,
      isHovered = false,
      showFactoryInfo = false,
      panelType = 'default'
    } = options;

    // Draw background
    this.drawPanelBackground(ctx, x, y, width, height, backgroundConfig);

    // Draw factory info if provided
    if (showFactoryInfo && factory) {
      this.drawFactoryInfo(ctx, x, y, factory);
    }

    // Draw grid content if provided
    if (gridContent) {
      const state = { bounds: { x, y, width, height }, isHovered };
      const context = { content: gridContent, ...options };
      this.drawGridContent(ctx, state, context);
    }
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================
  
  static getBackgroundColor(renderType, context) {
    switch (renderType) {
      case 'garage':
        return this.getGarageColor(context.canBuild, context.flakManager);
      case 'upgrade':
        return this.getUpgradeColor(context.factory, context.isHovered);
      case 'production':
        return this.getProductionColor(context.factory, context.isHovered);
      default:
        return UNIVERSAL_PANEL_CONFIG.GRID.boxColors.available;
    }
  }

static getGarageColor(canBuild, flakManager) {
  // Default background for non-buildable boxes
  if (!canBuild) {
    return UNIVERSAL_PANEL_CONFIG.LAYOUT.backgroundGradient.start; // or .end, match your gradient preference
  }
  
  // Buildable box logic
  if (flakManager?.canBuild()) {
    return UNIVERSAL_PANEL_CONFIG.GRID.boxColors.available;
  } else {
    // Max capacity reached - dark red
    return '#4a1717';
  }
}
  static getUpgradeColor(factory, isHovered) {
    const { STYLING } = UPGRADE_BUTTON_CONFIG;
    
    if (factory.upgrading) return STYLING.upgradingBackgroundColor;
    if (factory.isMaxLevel()) return STYLING.maxLevelBackgroundColor;
    if (isHovered) return STYLING.hoverBackgroundColor;
    return STYLING.backgroundColor;
  }

  static getProductionColor(factory, isHovered) {
    if (factory?.isProducing) return '#2a4a2a';
    if (isHovered) return '#3a3a4a';
    return '#2a2a3a';
  }

  static shouldShowHover(renderType, context) {
    switch (renderType) {
      case 'garage':
        return context.canBuild && context.flakManager?.canBuild();
      case 'upgrade':
        return !context.factory?.upgrading && !context.factory?.isMaxLevel();
      default:
        return true;
    }
  }

  static getScaleFactor(factory, isHovered, baseScale) {
    const { STYLING } = UPGRADE_BUTTON_CONFIG;
    const scale = baseScale || STYLING.baseScaleFactor;
    return isHovered ? scale * STYLING.hoverScaleFactor : scale;
  }

  static calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    let origWidth, origHeight;
    const cfg = FactoryConfig?.[factoryType];
    
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

  static getCheckmarkSettings() {
    const { EFFECTS, DIMENSIONS } = UPGRADE_BUTTON_CONFIG;
    return {
      glowColor: EFFECTS.checkmarkGlowColor,
      glowBlur: EFFECTS.checkmarkGlowBlur,
      baseSize: Math.min(DIMENSIONS.width, DIMENSIONS.height) * 1.3,
      hoverScale: 1.1
    };
  }

  // =============================================================================
  // TEXT RENDERING - Uses PanelBase for consistency
  // =============================================================================
  static drawText(ctx, text, x, y, font, align = "left", fillStyle = "#ffffff") {
    // Use PanelBase for consistent text rendering across the application
    const panelBase = new PanelBase();
    panelBase.drawText(ctx, text, x, y, font, align, fillStyle);
  }

  // =============================================================================
  // DEBUG RENDERING
  // =============================================================================
  static drawDebugBorders(ctx, panelPos, hoverPos, targetPos, config = UNIVERSAL_PANEL_CONFIG.DEBUG) {
    if (!config.enabled) return;

    ctx.save();
    
    // Hover area (red border)
    ctx.strokeStyle = config.colors.hoverArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.hoverArea);
    ctx.strokeRect(hoverPos.x, hoverPos.y, hoverPos.width, hoverPos.height);
    
    // Panel area (blue border)
    ctx.strokeStyle = config.colors.panelArea;
    ctx.lineWidth = 3;
    ctx.setLineDash(config.lineStyles.panelArea);
    ctx.strokeRect(panelPos.x, panelPos.y, panelPos.width, panelPos.height);
    
    // Target area (green border)
    ctx.strokeStyle = config.colors.targetArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.targetArea);
    ctx.strokeRect(targetPos.x, targetPos.y, targetPos.width, targetPos.height);
    
    // Labels
    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
    ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
    ctx.fillText('HOVER', hoverPos.x + 5, hoverPos.y + 15);
    ctx.fillText('PANEL', panelPos.x + 5, panelPos.y + 15);
    ctx.fillText('TARGET', targetPos.x + 5, targetPos.y + 15);
    
    ctx.restore();
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  static resetShadow(ctx) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }

  // Legacy compatibility methods
  static drawGridBox(ctx, x, y, width, height, content, isHovered, config) {
    const state = { bounds: { x, y, width, height }, isHovered };
    const context = { content, isHovered };
    this.drawGridContent(ctx, state, context);
  }
}

// =============================================================================
// CONVENIENCE EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================

// Export specific renderer functions for components that expect them
export const PanelRenderer = {
  drawBackground: UniversalPanelRenderer.drawPanelBackground.bind(UniversalPanelRenderer),
  drawFactoryInfo: UniversalPanelRenderer.drawFactoryInfo.bind(UniversalPanelRenderer),
  drawBox: UniversalPanelRenderer.drawUniversalBox.bind(UniversalPanelRenderer),
  drawDebug: UniversalPanelRenderer.drawDebugBorders.bind(UniversalPanelRenderer)
};