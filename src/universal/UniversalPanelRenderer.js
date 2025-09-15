// src/universal/UniversalPanelRenderer.js
import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";
import { PanelBase } from "../ui/ProductionMenu/PanelBase.js";

/**
 * Unified Universal Panel Renderer
 * Handles ALL rendering for panels, boxes, backgrounds, and content
 * Supports: Factory Panels, Garage Panels, Grid Boxes, Upgrade Buttons, Production Elements
 * Goal: Centralize rendering logic to maximize reuse and minimize duplication.
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
    // Draw background using centralized logic
    this.drawBoxBackground(ctx, state, renderType, context);
    // Draw content based on type using specific methods
    switch (renderType) {
      case 'upgrade':
        this.drawUpgradeContent(ctx, state, context);
        break;
      case 'garage':
        // Use the dedicated garage content method to avoid duplication
        this.drawGarageContent(ctx, state, context);
        break;
      case 'production':
        this.drawProductionContent(ctx, state, context);
        break;
      // Removed 'grid' case. If needed, it should not duplicate 'garage' logic.
      // If a distinct grid type is needed, create a new specific method.
      default:
        this.drawDefaultContent(ctx, state, context);
    }
    // Draw overlays (e.g., checkmark for max level upgrade)
    this.drawOverlays(ctx, state, renderType, context);
  }

  // =============================================================================
  // BOX BACKGROUND RENDERING
  // =============================================================================
  static drawBoxBackground(ctx, state, renderType, context) {
    const { x, y, width, height } = state.bounds;
    // Delegate color calculation to centralized helper
    const bgColor = this.getBackgroundColor(renderType, context);

    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);

    // Add hover effect if conditions are met, using centralized logic
    if (state.isHovered && this.shouldShowHover(renderType, context)) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.GRID.hoverEffect;
      ctx.fillRect(x, y, width, height);
    }

    // Add border if specified in context
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
    const { factory, spriteManager } = context; // iconManager handled in overlay
    if (!spriteManager) return; // Guard clause

    const factoryType = factory.type || 'concrete';
    const sprite = spriteManager.getSprite(factoryType);

    const { x, y, width, height } = state.bounds;
    // Delegate scale calculation to helper
    const scaleFactor = this.getScaleFactor(factory, state.isHovered, factory.scaleFactor);
    // Delegate dimension calculation to helper
    const dimensions = this.calculateSpriteDimensions(sprite, factoryType, scaleFactor);

    // Center the sprite within the box bounds
    const spriteX = x + (width - dimensions.width) / 2;
    const spriteY = y + (height - dimensions.height) / 2;

    ctx.imageSmoothingEnabled = true;
    sprite.drawFrame(ctx, 0, spriteX, spriteY, dimensions.width, dimensions.height);
  }

  // Garage Content (Handles '+' and 'MAX CAP' logic)
  static drawGarageContent(ctx, state, context) {
    const { canBuild, flakManager } = context;
    const { x, y, width, height } = state.bounds;
    // Only draw content if the box is buildable
    if (canBuild) {
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
      ctx.textAlign = 'center';
      // Determine what text/icon to show based on FlakManager state
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

    // Draw a progress bar if the factory is producing
    if (factory?.isProducing) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress.fillColor;
      // Position bar near the bottom of the box
      ctx.fillRect(x + 2, y + height - 4, (width - 4) * factory.productionProgress, 2);
    }
  }

  // Default Content (Placeholder for future types)
  static drawDefaultContent(ctx, state, context) {
    const { x, y, width, height } = state.bounds;
    if (context.text) {
      this.drawText(ctx, context.text, x + width / 2, y + height / 2, "12px Arial", "center");
    }
  }

  // =============================================================================
  // OVERLAY RENDERING (e.g., Checkmarks, Glows)
  // =============================================================================
  static drawOverlays(ctx, state, renderType, context) {
    // Example: Draw a checkmark overlay for max level upgrade buttons
    if (renderType === 'upgrade' && context.factory?.isMaxLevel() && context.iconManager) {
      this.drawMaxLevelOverlay(ctx, state, context.iconManager);
    }
    // Add other overlays here if needed for different box types
  }

  static drawMaxLevelOverlay(ctx, state, iconManager) {
    if (!iconManager?.isLoaded()) return; // Guard clause

    const { x, y, width, height } = state.bounds;
    // Get overlay settings (size, glow)
    const checkSettings = this.getCheckmarkSettings();
    const checkSize = state.isHovered ? checkSettings.baseSize * checkSettings.hoverScale : checkSettings.baseSize;
    const checkX = x + (width - checkSize) / 2;
    const checkY = y + (height - checkSize) / 2;

    // Apply hover glow effect
    if (state.isHovered) {
      ctx.shadowColor = checkSettings.glowColor;
      ctx.shadowBlur = checkSettings.glowBlur;
    }

    // Draw the checkmark icon
    iconManager.drawCheckMark(ctx, checkX, checkY, checkSize);
    // Reset shadow to avoid affecting other drawings
    this.resetShadow(ctx);
  }

  // =============================================================================
  // COMPLETE PANEL RENDERING - High-level panel composition
  // =============================================================================
  static drawCompletePanel(ctx, x, y, width, height, options = {}) {
    const {
      backgroundConfig = UNIVERSAL_PANEL_CONFIG.LAYOUT,
      factory = null,
      // gridContent = null, // Removed problematic reference
      isHovered = false,
      showFactoryInfo = false,
      panelType = 'default'
    } = options;

    // 1. Draw the main panel background
    this.drawPanelBackground(ctx, x, y, width, height, backgroundConfig);

    // 2. Draw specific panel content (e.g., factory info)
    if (showFactoryInfo && factory) {
      this.drawFactoryInfo(ctx, x, y, factory);
    }

    // 3. Future: Add hooks or parameters here for drawing grid content
    // or other panel-specific elements if needed, but avoid direct calls
    // to potentially removed/duplicated methods like drawGridContent.
    // The current structure relies on the caller to draw universal boxes/components separately.
  }

  // =============================================================================
  // HELPER METHODS - Centralized logic for colors, scales, etc.
  // =============================================================================

  static getBackgroundColor(renderType, context) {
    // Delegate to specific color helpers based on box type
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

  // Corrected Garage Color Helper (uses specific box colors, not panel gradient)
  static getGarageColor(canBuild, flakManager) {
    const colors = UNIVERSAL_PANEL_CONFIG.GRID.boxColors;
    if (!canBuild) return colors.disabled; // Specific disabled color
    if (flakManager?.isBuilding()) return colors.building; // Specific building color
    if (!flakManager?.canBuild()) return colors.maxCapacity; // Specific max capacity color
    return colors.available; // Specific available color
  }

  static getUpgradeColor(factory, isHovered) {
    const { STYLING } = UPGRADE_BUTTON_CONFIG;
    // Determine color based on factory state
    if (factory.upgrading) return STYLING.upgradingBackgroundColor;
    if (factory.isMaxLevel()) return STYLING.maxLevelBackgroundColor;
    if (isHovered) return STYLING.hoverBackgroundColor;
    return STYLING.backgroundColor;
  }

  static getProductionColor(factory, isHovered) {
     // Determine color based on factory state and hover
    if (factory?.isProducing) return '#2a4a2a'; // Dark greenish for producing
    if (isHovered) return '#3a3a4a'; // Dark grayish for hover
    return '#2a2a3a'; // Dark base color
  }

  static shouldShowHover(renderType, context) {
    // Define specific conditions for showing hover effects
    switch (renderType) {
      case 'garage':
        // Only show hover if it's buildable and the manager allows building
        return context.canBuild && context.flakManager?.canBuild();
      case 'upgrade':
        // Don't show hover on upgrading or max level buttons
        return !context.factory?.upgrading && !context.factory?.isMaxLevel();
      default:
        // Show hover by default for other types
        return true;
    }
  }

  static getScaleFactor(factory, isHovered, baseScale) {
    const { STYLING } = UPGRADE_BUTTON_CONFIG;
    // Calculate scale factor, applying hover effect
    const scale = baseScale || STYLING.baseScaleFactor;
    return isHovered ? scale * STYLING.hoverScaleFactor : scale;
  }

  static calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    let origWidth, origHeight;
    // Try to get dimensions from FactoryConfig first
    const cfg = FactoryConfig?.[factoryType];

    if (cfg?.width && cfg?.height) {
      origWidth = cfg.width;
      origHeight = cfg.height;
    } else {
      // Fallback to sprite's frame size
      const frameSize = sprite.getFrameSize();
      origWidth = frameSize.width;
      origHeight = frameSize.height;
    }
    // Apply the calculated scale factor
    return {
      width: origWidth * scaleFactor,
      height: origHeight * scaleFactor
    };
  }

  static getCheckmarkSettings() {
    const { EFFECTS, DIMENSIONS } = UPGRADE_BUTTON_CONFIG;
    // Centralize settings for the max level checkmark overlay
    return {
      glowColor: EFFECTS.checkmarkGlowColor,
      glowBlur: EFFECTS.checkmarkGlowBlur,
      baseSize: Math.min(DIMENSIONS.width, DIMENSIONS.height) * 1.3,
      hoverScale: 1.1
    };
  }

  // =============================================================================
  // TEXT RENDERING - Uses PanelBase for consistency across the app
  // =============================================================================
  static drawText(ctx, text, x, y, font, align = "left", fillStyle = "#ffffff") {
    // Delegate text drawing to PanelBase to ensure consistent styling
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

    // Labels for debug areas
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
    // Utility to cleanly reset canvas shadow properties
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
}

// =============================================================================
// CONVENIENCE EXPORTS FOR BACKWARD COMPATIBILITY
// =============================================================================

// Export bound methods for components that might still expect them directly
export const PanelRenderer = {
  drawBackground: UniversalPanelRenderer.drawPanelBackground.bind(UniversalPanelRenderer),
  drawFactoryInfo: UniversalPanelRenderer.drawFactoryInfo.bind(UniversalPanelRenderer),
  drawBox: UniversalPanelRenderer.drawUniversalBox.bind(UniversalPanelRenderer),
  drawDebug: UniversalPanelRenderer.drawDebugBorders.bind(UniversalPanelRenderer)
};