import { PanelBase } from './PanelBase.js';
import { IconManager } from '../../utils/IconManager.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';

export class CancelBadges extends PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG) {
    super();
    this.config = config;
    this.iconManager = new IconManager();
    this.oneHourCancelBounds = null;
    this.fifteenHourCancelBounds = null;
    
    // Calculate icon size based on production button size and config
    this.iconSize = Math.min(
      this.config.COMPONENTS.sizes.productionButtonHeight * this.config.CANCEL_BADGE.iconSizeMultiplier, 
      this.config.CANCEL_BADGE.maxIconSize  
    );
  }

  draw(ctx, oneHourButtonX, fifteenHourButtonX, buttonY, prodButtonWidth, factory) {
    // Only show cancel badges if factory is producing
    if (!factory || !factory.isProducing) {
      this.oneHourCancelBounds = null;
      this.fifteenHourCancelBounds = null;
      return;
    }

    // Determine which buttons should show the cancel badge
    const shouldShow1hCancel = this.shouldShow1hCancelBadge(factory);
    const shouldShow15hCancel = this.shouldShow15hCancelBadge(factory);

    if (shouldShow1hCancel) {
      this.drawCancelBadge(ctx, oneHourButtonX, buttonY, "oneHour", prodButtonWidth);
    } else {
      this.oneHourCancelBounds = null;
    }

    if (shouldShow15hCancel) {
      this.drawCancelBadge(ctx, fifteenHourButtonX, buttonY, "fifteenHour", prodButtonWidth);
    } else {
      this.fifteenHourCancelBounds = null;
    }
  }

  shouldShow1hCancelBadge(factory) {
    if (!factory.isProducing) return false;
    
    // Show cancel on 1h button ONLY when at maximum production time (15h)
    // This happens when:
    // 1. User clicked 1h button 15 times (reaching 15h total)
    // 2. User clicked 15h button directly
    
    // Check if factory is at maximum production time
    if (factory.productionTimeRemaining !== undefined) {
      // Convert 15 hours to milliseconds for comparison
      const maxProductionTimeMs = 15 * 60 * 60 * 1000;
      return factory.productionTimeRemaining >= maxProductionTimeMs;
    }
    
    // Alternative: Check if factory cannot start 15h production (meaning at max)
    if (factory.canStart15HourProduction) {
      return !factory.canStart15HourProduction();
    }
    
    // Alternative: Check total production time
    if (factory.totalProductionTime !== undefined) {
      const maxProductionTimeMs = 15 * 60 * 60 * 1000;
      return factory.totalProductionTime >= maxProductionTimeMs;
    }
    
    // Alternative: Check initial production time
    if (factory.initialProductionTime !== undefined) {
      return factory.initialProductionTime >= 15;
    }
    
    return false;
  }

  shouldShow15hCancelBadge(factory) {
    // Always show cancel on 15h button when factory is producing
    // This appears immediately when production starts (either 1h or 15h)
    return factory.isProducing;
  }

  drawCancelBadge(ctx, buttonX, buttonY, which, prodButtonWidth) {
    const buttonHeight = this.config.COMPONENTS.sizes.productionButtonHeight;
    
    // Position the cancel icon in the center of the button
    const iconX = buttonX + (prodButtonWidth - this.iconSize) / 2;
    const iconY = buttonY + (buttonHeight - this.iconSize) / 2;
    
    // Create bounds for click detection
    const bounds = this._bounds(iconX, iconY, this.iconSize, this.iconSize);
    
    if (which === "oneHour") {
      this.oneHourCancelBounds = bounds;
    } else {
      this.fifteenHourCancelBounds = bounds;
    }

    // Draw the cross mark icon if IconManager is loaded
    if (this.iconManager.isLoaded()) {
      this.iconManager.drawIcon(
        ctx,
        "CROSS_MARK",
        iconX,
        iconY,
        this.iconSize,
        this.iconSize
      );
    } else {
      // Fallback: draw a simple X
      this.drawFallbackX(ctx, iconX, iconY, this.iconSize);
    }
  }

  drawFallbackX(ctx, x, y, size) {
    ctx.strokeStyle = this.config.CANCEL_BADGE.fallbackStroke.color;
    ctx.lineWidth = this.config.CANCEL_BADGE.fallbackStroke.width;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size, y + size);
    ctx.moveTo(x + size, y);
    ctx.lineTo(x, y + size);
    ctx.stroke();
  }

  handleClick(mouseX, mouseY, factory) {
    // Only handle clicks if the factory is producing
    if (!factory || !factory.isProducing) return false;

    // Check 1h cancel (only if badge is visible and bounds exist)
    if (this.oneHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.oneHourCancelBounds)) {
      return true; // Return true to trigger cancel dialog
    }

    // Check 15h cancel (only if badge is visible and bounds exist)  
    if (this.fifteenHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.fifteenHourCancelBounds)) {
      return true; // Return true to trigger cancel dialog
    }
  }
}