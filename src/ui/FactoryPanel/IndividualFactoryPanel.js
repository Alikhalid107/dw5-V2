import { PanelBackground } from '../ProductionMenu/PanelBackground.js';
import { UpgradeButton } from '../UpgradeButton.js';
import { ProductionButtons } from '../ProductionMenu/ProductionButtons.js';
import { CancelBadges } from '../ProductionMenu/CancelBadges.js';
import { ConfirmationDialog } from '../ProductionMenu/ConfirmationDialog.js';
import { MessageDisplay } from '../ProductionMenu/MessageDisplay.js';
import { FactoryPanelPositioning } from '../../utils/FactoryPanelPositioning.js';
import { FactoryPanelEventHandler } from './FactoryPanelEventHandler.js';
import { FactoryPanelRenderer } from './FactoryPanelRenderer.js';

export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;

    // Initialize positioning system
    this.positioning = new FactoryPanelPositioning(factory.panelConfig);

    // Initialize UI components
    this.components = {
      background: new PanelBackground(),
      upgradeButton: new UpgradeButton(),
      productionButtons: new ProductionButtons(),
      cancelBadges: new CancelBadges(),
      confirmDialog: new ConfirmationDialog(),
      messageDisplay: new MessageDisplay()
    };

    // Initialize systems
    this.eventHandler = new FactoryPanelEventHandler(this.components, this.positioning);
    this.renderer = new FactoryPanelRenderer(this.components, this.positioning);
  }

  // ---------- Main Interface ----------
  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    this.renderer.draw(ctx, factory, offsetX, offsetY);
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    return this.eventHandler.handleClick(mouseX, mouseY, offsetX, offsetY, factory, factoryManager);
  }

  updateHoverState(mouseX, mouseY) {
    this.eventHandler.updateHoverState(mouseX, mouseY);
  }

  showMessageBriefly(message, duration = 3000) {
    this.components.messageDisplay.showBriefly(message, duration);
  }

  // ---------- Component Access (for external systems) ----------
  getComponent(componentName) {
    return this.components[componentName];
  }

  getPositioning() {
    return this.positioning;
  }

  // ---------- Legacy Compatibility (Deprecated - use getComponent() instead) ----------
  get buttonBounds() { return this.components.upgradeButton.buttonBounds; }
  get isButtonHovered() { return this.components.upgradeButton.isButtonHovered; }
  get buttonWidth() { return this.components.upgradeButton.buttonWidth; }
  get buttonHeight() { return this.components.upgradeButton.buttonHeight; }
  get prodButtonWidth() { return this.components.productionButtons.prodButtonWidth; }
  get prodButtonHeight() { return this.components.productionButtons.prodButtonHeight; }
  get oneHourButtonBounds() { return this.components.productionButtons.oneHourButtonBounds; }
  get fifteenHourButtonBounds() { return this.components.productionButtons.fifteenHourButtonBounds; }
  get isOneHourHovered() { return this.components.productionButtons.isOneHourHovered; }
  get isFifteenHourHovered() { return this.components.productionButtons.isFifteenHourHovered; }
  get cancelButtonSize() { return this.components.cancelBadges.cancelButtonSize; }
  get oneHourCancelBounds() { return this.components.cancelBadges.oneHourCancelBounds; }
  get fifteenHourCancelBounds() { return this.components.cancelBadges.fifteenHourCancelBounds; }
  get showConfirmDialog() { return this.components.confirmDialog.showConfirmDialog; }
  get confirmYesBounds() { return this.components.confirmDialog.confirmYesBounds; }
  get confirmNoBounds() { return this.components.confirmDialog.confirmNoBounds; }
  get showMessage() { return this.components.messageDisplay.showMessage; }
  get messageText() { return this.components.messageDisplay.messageText; }
  get messageTimer() { return this.components.messageDisplay.messageTimer; }

  // Legacy methods (Deprecated - use component methods directly)
  calculatePanelPosition(factory) { return this.positioning.calculatePanelPosition(factory); }
  _bounds(x, y, w, h) { return this.positioning.createBounds(x, y, w, h); }
  isPointInBounds(x, y, b) { return this.positioning.isPointInBounds(x, y, b); }
  drawText(ctx, text, x, y, font, align, style) { 
    this.components.background.drawText(ctx, text, x, y, font, align, style); 
  }
  _drawRoundedRect(ctx, x, y, w, h) { 
    this.components.background._drawRoundedRect(ctx, x, y, w, h); 
  }
  drawBackground(ctx, x, y) { 
    this.components.background.drawBackground(ctx, x, y, this.positioning.panelWidth, this.positioning.panelHeight); 
  }
  drawButton(ctx, x, y, factory) { 
    this.components.upgradeButton.draw(ctx, x, y, factory); 
  }
  drawProductionButton(ctx, x, y, label, isProducing, isHovered, isDisabled) { 
    this.components.productionButtons.drawProductionButton(ctx, x, y, label, isProducing, isHovered, isDisabled); 
  }
  drawCancelBadge(ctx, buttonX, buttonY, which) { 
    this.components.cancelBadges.drawCancelBadge(ctx, buttonX, buttonY, which, this.positioning.prodButtonWidth); 
  }
  drawConfirmDialog(ctx, panelX, panelY) { 
    this.components.confirmDialog.draw(ctx, panelX, panelY, this.positioning.panelWidth); 
  }
}