import { FACTORY_PANEL_CONFIG } from '../../config/FactoryPanelConfig.js';

export class FactoryPanelRenderer {
  constructor(components, positioning) {
    this.components = components;
    this.positioning = positioning;
  }

  draw(ctx, factory, offsetX = 0, offsetY = 0) {
    const screenPos = this.positioning.getScreenPosition(factory, offsetX, offsetY);
    
    if (!screenPos.isValid) return;

    const { x: panelX, y: panelY } = screenPos;

    // Draw components in layered order (background first, dialogs last)
    this.drawBackground(ctx, panelX, panelY, factory);
    this.drawMainComponents(ctx, panelX, panelY, factory);
    this.drawOverlayComponents(ctx, panelX, panelY, factory);
  }

  drawBackground(ctx, panelX, panelY, factory) {
    this.components.background.drawBackground(
      ctx, 
      panelX, 
      panelY, 
      this.positioning.panelWidth, 
      this.positioning.panelHeight
    );
    
    this.components.background.drawFactoryInfo(ctx, panelX, panelY, factory);
  }

  drawMainComponents(ctx, panelX, panelY, factory) {
    // Upgrade button
    const upgradePos = this.positioning.getComponentPosition('upgradeButton', panelX, panelY);
    this.components.upgradeButton.draw(ctx, upgradePos.x, upgradePos.y, factory);

    // Production buttons
    const productionPos = this.positioning.getComponentPosition('productionButtons', panelX, panelY);
    this.components.productionButtons.draw(ctx, productionPos.x, productionPos.y, factory);

    // Cancel badges (only if producing)
    if (factory && factory.isProducing) {
      this.drawCancelBadges(ctx, productionPos.x, productionPos.y, factory);
    }
  }

  drawCancelBadges(ctx, productionX, productionY, factory) {
    const oneX = productionX;
    const buttonSpacing = FACTORY_PANEL_CONFIG.COMPONENT_SPACING.buttonSpacing;
    
    // Calculate button width properly from config
    const totalButtonsWidth = FACTORY_PANEL_CONFIG.COMPONENT_SIZES.productionButtonsWidth;
    const buttonWidth = totalButtonsWidth / 2 - buttonSpacing;
    
    const fifteenX = oneX + buttonWidth + buttonSpacing;
    
    this.components.cancelBadges.draw(
      ctx, 
      oneX, 
      fifteenX, 
      productionY, 
      buttonWidth, // Use calculated button width
      factory
    );
  }

  drawOverlayComponents(ctx, panelX, panelY, factory) {
    // Confirmation dialog (appears on top)
    this.components.confirmDialog.draw(ctx, panelX, panelY, this.positioning.panelWidth);
    
    // Message display (appears on top)
    this.components.messageDisplay.draw(ctx, panelX, panelY);
  }
}