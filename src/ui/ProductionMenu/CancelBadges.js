import { PanelBase } from './PanelBase.js';
import { IconManager } from '../../utils/IconManager.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';
import { FactoryUtils } from '../../utils/FactoryUtils.js';

export class CancelBadges extends PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG) {
    super();
    this.config = config;
    this.iconManager = new IconManager();
    this.oneHourCancelBounds = null;
    this.fifteenHourCancelBounds = null;
  }

  // draw called by parent. prodButtonWidth is optional (if parent provides actual button width)
  // oneHourButtonX and fifteenHourButtonX are expected to be the top-left X of those buttons
  draw(ctx, oneHourButtonX, fifteenHourButtonX, buttonY, prodButtonWidth, factory) {
    // reset bounds and bail if not producing
    if (!factory || !factory.isProducing) {
      this.oneHourCancelBounds = null;
      this.fifteenHourCancelBounds = null;
      return;
    }

    const shouldShow1hCancel = this.shouldShow1hCancelBadge(factory);
    const shouldShow15hCancel = this.shouldShow15hCancelBadge(factory);

    // config flag to link 1h badge position to 15h button (optional)
    const linkOneHourTo15h = !!this.config?.CANCEL_BADGE?.linkTo15h;

    if (shouldShow1hCancel) {
      // if linking enabled and fifteenHourButtonX provided, use that X for the 1h badge
      const targetX = linkOneHourTo15h && fifteenHourButtonX !== undefined
        ? fifteenHourButtonX
        : oneHourButtonX;

      this.drawCancelBadge(ctx, targetX, buttonY, "oneHour", prodButtonWidth);
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
    if (!factory || !factory.isProducing) return false;
    // show 1h cancel only when factory is at max production (as original logic)
    return FactoryUtils.isFactoryAtMaxProduction(factory);
  }

  shouldShow15hCancelBadge(factory) {
    if (!factory) return false;
    return factory.isProducing;
  }

  // drawCancelBadge now accepts prodButtonWidth and uses it if provided.
  drawCancelBadge(ctx, buttonX, buttonY, which, prodButtonWidth) {
    // If parent supplies exact button width use it; otherwise fallback to config grid size
    const buttonWidth = prodButtonWidth ?? (this.config?.grid?.boxWidth ?? 60);
    const buttonHeight = (this.config?.grid?.boxHeight ?? 40);

    // compute icon size based on config multiplier or explicit iconSize cap
    const multiplier = this.config?.CANCEL_BADGE?.iconSizeMultiplier ?? 1;
    const computedSize = buttonHeight * multiplier;

    const explicitSize = this.config?.CANCEL_BADGE?.iconSize;
    const sizeCandidates = explicitSize ? [computedSize, explicitSize] : [computedSize];
    const iconSize = Math.min(...sizeCandidates);

    // Position icon centered inside the button area (buttonX is top-left)
    const iconX = buttonX + (buttonWidth - iconSize) / 2;
    const iconY = buttonY + (buttonHeight - iconSize) / 2;

    const bounds = this._bounds(iconX, iconY, iconSize, iconSize);
    if (which === "oneHour") {
      this.oneHourCancelBounds = bounds;
    } else {
      this.fifteenHourCancelBounds = bounds;
    }

    if (this.iconManager.isLoaded && this.iconManager.isLoaded()) {
      this.iconManager.drawIcon(ctx, "CROSS_MARK", iconX, iconY, iconSize, iconSize);
    }
  }

  handleClick(mouseX, mouseY, factory) {
    if (!factory || !factory.isProducing) return false;

    if (this.oneHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.oneHourCancelBounds)) {
      return true;
    }

    if (this.fifteenHourCancelBounds && this.isPointInBounds(mouseX, mouseY, this.fifteenHourCancelBounds)) {
      return true;
    }

    return false;
  }
}
