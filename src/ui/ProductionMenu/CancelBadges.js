import { PanelBase } from './PanelBase.js';
import { IconManager } from '../../utils/IconManager.js';
import { FACTORY_PANEL_CONFIG } from '../../config/FactoryPanelConfig.js';

export class CancelBadges extends PanelBase {
  constructor() {
    super();
    this.iconManager = new IconManager();
    this.oneHourCancelBounds = null;
    this.fifteenHourCancelBounds = null;
    
    // Calculate icon size based on production button size
    this.iconSize = Math.min(
      FACTORY_PANEL_CONFIG.COMPONENT_SIZES.productionButtonsHeight * 100, 
      50  
      );
  }

  draw(ctx, oneHourButtonX, fifteenHourButtonX, buttonY, prodButtonWidth, factory) {
    // Determine which buttons should show the cancel badge
    const shouldShow1hCancel = this.shouldShow1hCancelBadge(factory);
    const shouldShow15hCancel = this.shouldShow15hCancelBadge(factory);

    if (shouldShow1hCancel) {
      this.drawCancelBadge(ctx, oneHourButtonX, buttonY, "oneHour", prodButtonWidth);
    } else {
      this.oneHourCancelBounds = null; // Clear bounds if not showing
    }

    if (shouldShow15hCancel) {
      this.drawCancelBadge(ctx, fifteenHourButtonX, buttonY, "fifteenHour", prodButtonWidth);
    } else {
      this.fifteenHourCancelBounds = null; // Clear bounds if not showing
    }
  }

  shouldShow1hCancelBadge(factory) {
    if (!factory.isProducing) return false;
    
    // Show cancel on 1h button if:
    // 1. Factory cannot start 15h production (meaning we're at or near 15h limit)
    // 2. OR factory has 15h or more remaining time
    // 3. OR factory was started with 15h directly
    
    // Primary check: If factory can't start 15h production, show cancel on 1h
    if (factory.canStart15HourProduction) {
      const canStart15 = factory.canStart15HourProduction();
      if (!canStart15) {
        return true; // At max capacity, show cancel on 1h
      }
    }
    
    // Secondary check: If factory has remaining time info and it's 15h
    if (factory.productionTimeRemaining !== undefined) {
      // If at or near max time (15h = 15 * 60 * 60 * 1000 ms), show cancel on 1h
      return factory.productionTimeRemaining >= (15 * 60 * 60 * 1000);
    }
    
    // Tertiary check: If factory has initial production time set to 15h
    if (factory.initialProductionTime !== undefined) {
      return factory.initialProductionTime >= 15;
    }
    
    // Quaternary check: If factory has total production time and it's 15h
    if (factory.totalProductionTime !== undefined) {
      return factory.totalProductionTime >= (15 * 60 * 60 * 1000);
    }
    
    // Fallback: don't show cancel on 1h button by default
    return false;
  }

  shouldShow15hCancelBadge(factory) {
    // Show cancel on 15h button if factory is producing
    return factory.isProducing;
  }

  drawCancelBadge(ctx, buttonX, buttonY, which, prodButtonWidth) {
    const buttonHeight = FACTORY_PANEL_CONFIG.COMPONENT_SIZES.productionButtonsHeight;
    
    // Center the icon within the production button
    const iconX = buttonX + (prodButtonWidth - this.iconSize) / 2 ;
    const iconY = buttonY + (buttonHeight - this.iconSize) / 2 ;
    
    // Create bounds for click detection (same as icon position)
    const bounds = this._bounds(
      iconX,
      iconY,
      this.iconSize,
      this.iconSize
    );
    
    if (which === "oneHour") this.oneHourCancelBounds = bounds;
    else this.fifteenHourCancelBounds = bounds;

  

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
    } 
  }

  handleClick(mouseX, mouseY, factory) {
    // Only handle clicks if the factory is producing AND the click is on a visible cancel badge
    if (!factory.isProducing) return false;

    // Check 1h cancel (only if badge is visible)
    if (this.oneHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.oneHourCancelBounds)) {
      return true;
    }

    // Check 15h cancel (only if badge is visible)  
    if (this.fifteenHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.fifteenHourCancelBounds)) {
      return true;
    }

    return false;
  }
}