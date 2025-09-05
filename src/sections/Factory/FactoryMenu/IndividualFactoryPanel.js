import { PanelBackground } from '../ProductionMenu/PanelBackground.js';
import { UpgradeButton } from '../ProductionMenu/UpgradeButton.js';
import { ProductionButtons } from '../ProductionMenu/ProductionButtons.js';
import { CancelBadges } from '../ProductionMenu/CancelBadges.js';
import { ConfirmationDialog } from '../ProductionMenu/ConfirmationDialog.js';
import { MessageDisplay } from '../ProductionMenu/MessageDisplay.js';

export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;

    const cfg = factory.panelConfig || {};
    this.panelWidth = cfg.panelWidth;
    this.panelHeight = (cfg.panelHeight || 0) + 45; // preserve original extra height
    this.panelOffsetX = cfg.panelOffsetX;
    this.panelOffsetY = cfg.panelOffsetY;

    // Initialize components
    this.background = new PanelBackground();
    this.upgradeButton = new UpgradeButton();
    this.productionButtons = new ProductionButtons();
    this.cancelBadges = new CancelBadges();
    this.confirmDialog = new ConfirmationDialog();
    this.messageDisplay = new MessageDisplay();
  }

  calculatePanelPosition(factory) {
    const factoryCenterX = factory.x + factory.width / 2;
    return {
      x: factoryCenterX + this.panelOffsetX - this.panelWidth / 2,
      y: factory.y + this.panelOffsetY,
    };
  }

  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    const pos = this.calculatePanelPosition(factory);
    const x = pos.x - offsetX,
      y = pos.y - offsetY;
    if (!isFinite(x) || !isFinite(y)) return;

    // Draw background and factory info
    this.background.drawBackground(ctx, x, y, this.panelWidth, this.panelHeight);
    this.background.drawFactoryInfo(ctx, x, y, factory);

    // Draw upgrade button
    this.upgradeButton.draw(ctx, x + 10, y + 60, factory);

    // Draw production buttons
    const by = y + 100;
    this.productionButtons.draw(ctx, x + 10, by, factory);

    // Draw cancel badges if producing
    if (factory.isProducing) {
      const oneX = x + 10;
      const fifteenX = oneX + this.productionButtons.prodButtonWidth + 10;
      this.cancelBadges.draw(ctx, oneX, fifteenX, by, this.productionButtons.prodButtonWidth);
    }

    // Draw dialogs and messages
    this.confirmDialog.draw(ctx, x, y, this.panelWidth);
    this.messageDisplay.draw(ctx, x, y, this.panelWidth);
  }

  // ✅ Updated handleClick with confirmation persistence
  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    const ax = mouseX - offsetX,
      ay = mouseY - offsetY;

    // If confirmation dialog is shown, handle its clicks
    if (this.confirmDialog?.showConfirmDialog) {
      const result = this.confirmDialog.handleClick(ax, ay, factory);
      if (result) {
        // If dialog was clicked, tell factory manager to update state
        if (!this.confirmDialog.showConfirmDialog && factoryManager) {
          factoryManager.setConfirmationDialog(factory.type, false);
        }
        return true; // stop further click handling
      }
    }

    // Handle cancel badge click -> show dialog
    if (this.cancelBadges.handleClick(ax, ay, this.factory)) {
      this.confirmDialog.show();
      if (factoryManager) {
        factoryManager.setConfirmationDialog(factory.type, true);
      }
      return true;
    }

    // Production buttons
    if (this.productionButtons.handleClick(ax, ay, this.factory, (msg) => this.showMessageBriefly(msg))) {
      return true;
    }

    // Upgrade button
    return this.upgradeButton.handleClick(ax, ay, this.factory);
  }

  updateHoverState(mouseX, mouseY) {
    this.upgradeButton.updateHoverState(mouseX, mouseY);
    this.productionButtons.updateHoverState(mouseX, mouseY);
  }

  showMessageBriefly(message, duration = 3000) {
    this.messageDisplay.showBriefly(message, duration);
  }

  // Compatibility getters for backward compatibility
  get buttonBounds() { return this.upgradeButton.buttonBounds; }
  get isButtonHovered() { return this.upgradeButton.isButtonHovered; }
  get buttonWidth() { return this.upgradeButton.buttonWidth; }
  get buttonHeight() { return this.upgradeButton.buttonHeight; }
  get prodButtonWidth() { return this.productionButtons.prodButtonWidth; }
  get prodButtonHeight() { return this.productionButtons.prodButtonHeight; }
  get oneHourButtonBounds() { return this.productionButtons.oneHourButtonBounds; }
  get fifteenHourButtonBounds() { return this.productionButtons.fifteenHourButtonBounds; }
  get isOneHourHovered() { return this.productionButtons.isOneHourHovered; }
  get isFifteenHourHovered() { return this.productionButtons.isFifteenHourHovered; }
  get cancelButtonSize() { return this.cancelBadges.cancelButtonSize; }
  get oneHourCancelBounds() { return this.cancelBadges.oneHourCancelBounds; }
  get fifteenHourCancelBounds() { return this.cancelBadges.fifteenHourCancelBounds; }
  get showConfirmDialog() { return this.confirmDialog.showConfirmDialog; }
  get confirmYesBounds() { return this.confirmDialog.confirmYesBounds; }
  get confirmNoBounds() { return this.confirmDialog.confirmNoBounds; }
  get showMessage() { return this.messageDisplay.showMessage; }
  get messageText() { return this.messageDisplay.messageText; }
  get messageTimer() { return this.messageDisplay.messageTimer; }

  // Legacy compatibility methods (if needed)
  _bounds(x, y, w, h) {
    return { x, y, width: w, height: h };
  }

  isPointInBounds(x, y, b) {
    if (!b) return false;
    return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
  }

  drawText(ctx, text, x, y, font = "12px Arial", align = "left", style = "white") {
    this.background.drawText(ctx, text, x, y, font, align, style);
  }

  _drawRoundedRect(ctx, x, y, w, h) {
    this.background._drawRoundedRect(ctx, x, y, w, h);
  }

  drawBackground(ctx, x, y) {
    this.background.drawBackground(ctx, x, y, this.panelWidth, this.panelHeight);
  }

  drawButton(ctx, x, y, factory) {
    this.upgradeButton.draw(ctx, x, y, factory);
  }

  drawProductionButton(ctx, x, y, label, isProducing, isHovered, isDisabled = false) {
    this.productionButtons.drawProductionButton(ctx, x, y, label, isProducing, isHovered, isDisabled);
  }

  drawCancelBadge(ctx, buttonX, buttonY, which) {
    this.cancelBadges.drawCancelBadge(ctx, buttonX, buttonY, which, this.productionButtons.prodButtonWidth);
  }

  drawConfirmDialog(ctx, panelX, panelY) {
    this.confirmDialog.draw(ctx, panelX, panelY, this.panelWidth);
  }

  drawMessage(ctx, panelX, panelY) {
    this.messageDisplay.draw(ctx, panelX, panelY, this.panelWidth);
  }
}
