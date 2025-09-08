export class FactoryPanelEventHandler {
  constructor(components, positioning) {
    this.components = components;
    this.positioning = positioning;
    this.clickHandlers = new Map();
    this.hoverHandlers = new Map();
    
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    // Register click handlers for each component
    this.clickHandlers.set('confirmDialog', (relativeX, relativeY, factory, factoryManager) => {
      if (this.components.confirmDialog?.showConfirmDialog) {
        const result = this.components.confirmDialog.handleClick(relativeX, relativeY, factory);
        if (result && !this.components.confirmDialog.showConfirmDialog && factoryManager) {
          factoryManager.setConfirmationDialog(factory.type, false);
        }
        return result;
      }
      return false;
    });

    this.clickHandlers.set('cancelBadges', (relativeX, relativeY, factory, factoryManager) => {
      const result = this.components.cancelBadges.handleClick(relativeX, relativeY, factory);
      if (result) {
        this.components.confirmDialog.show();
        if (factoryManager) {
          factoryManager.setConfirmationDialog(factory.type, true);
        }
      }
      return result;
    });

    this.clickHandlers.set('productionButtons', (relativeX, relativeY, factory) => {
      return this.components.productionButtons.handleClick(relativeX, relativeY, factory, (msg) => {
        this.components.messageDisplay.showBriefly(msg, 3000);
      });
    });

    this.clickHandlers.set('upgradeButton', (relativeX, relativeY, factory, factoryManager, panelX, panelY) => {
      return this.handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY);
    });

    // Register hover handlers
    this.hoverHandlers.set('upgradeButton', (mouseX, mouseY) => {
      this.components.upgradeButton.updateHoverState(mouseX, mouseY);
    });

    this.hoverHandlers.set('productionButtons', (mouseX, mouseY) => {
      this.components.productionButtons.updateHoverState(mouseX, mouseY);
    });
  }

  handleClick(mouseX, mouseY, offsetX, offsetY, factory, factoryManager) {
    const { x: relativeX, y: relativeY } = this.positioning.convertToRelativeCoordinates(mouseX, mouseY, offsetX, offsetY);
    const screenPos = this.positioning.getScreenPosition(factory, offsetX, offsetY);
    
    if (!screenPos.isValid) return false;

    // Process clicks in priority order
    const clickOrder = ['confirmDialog', 'cancelBadges', 'productionButtons', 'upgradeButton'];
    
    for (const handlerName of clickOrder) {
      const handler = this.clickHandlers.get(handlerName);
      if (handler) {
        const result = handler(relativeX, relativeY, factory, factoryManager, screenPos.x, screenPos.y);
        if (result) return true;
      }
    }

    return false;
  }

  handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY) {
    // Calculate the actual upgrade button position relative to the panel
    const upgradePos = this.positioning.getComponentPosition('upgradeButton', 0, 0); // Get relative position
    const upgradeRelativeX = relativeX - (panelX + upgradePos.x);
    const upgradeRelativeY = relativeY - (panelY + upgradePos.y);

    // Try component's handleClick method first
    try {
      const result = this.components.upgradeButton.handleClick(upgradeRelativeX, upgradeRelativeY, factory);
      if (result) return true;
    } catch (error) {
      console.error("Error calling upgradeButton.handleClick:", error);
    }

    // Fallback: Direct upgrade if click is in button area
    const buttonBounds = this.positioning.createBounds(0, 0, 80, 30);
    const isInButtonArea = this.positioning.isPointInBounds(upgradeRelativeX, upgradeRelativeY, buttonBounds);

    if (isInButtonArea && factory.level < factory.maxLevel) {
      factory.level++;
      
      // Update visuals if methods exist
      if (typeof factory.updateVisuals === 'function') {
        factory.updateVisuals();
      }
      if (typeof factory.updateSprite === 'function') {
        factory.updateSprite();
      }
      
      return true;
    }

    return false;
  }

  updateHoverState(mouseX, mouseY) {
    for (const handler of this.hoverHandlers.values()) {
      handler(mouseX, mouseY);
    }
  }
}