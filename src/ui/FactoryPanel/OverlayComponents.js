// src/ui/FactoryPanel/OverlayComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { CancelBadges } from "../ProductionMenu/CancelBadges.js";
import { ConfirmationDialog } from "../ProductionMenu/ConfirmationDialog.js";
import { MessageDisplay } from "../ProductionMenu/MessageDisplay.js";

export class OverlayComponents {
  constructor() {
    this.cancelBadges = new CancelBadges();
    this.confirmationDialog = new ConfirmationDialog();
    this.messageDisplay = new MessageDisplay();
    this.currentPanelX = 0;
    this.currentPanelY = 0;
  }

  handleClick(relativeX, relativeY, factory, factoryManager) {
    // Priority 1: Confirmation dialog (blocks all other clicks when visible)
    if (this.isConfirmationDialogVisible()) {
      // Pass the raw mouse coordinates directly - the dialog handles absolute positioning
      const result = this.confirmationDialog.handleClick(relativeX, relativeY, factory, factoryManager);
      
      // Check if dialog was closed and update factory manager
      if (result && !this.confirmationDialog.showConfirmDialog && factoryManager) {
        factoryManager.setConfirmationDialog(factory.type, false);
      }
      
      return result;
    }

    // Priority 2: Cancel badges (only when factory is producing)
    if (factory?.isProducing && this.handleCancelBadgeClick(relativeX, relativeY, factory)) {
      return this.showConfirmationDialog(factoryManager, factory.type, factory);
    }

    return false;
  }

  isConfirmationDialogVisible() {
    return this.confirmationDialog?.showConfirmDialog === true;
  }

  handleCancelBadgeClick(relativeX, relativeY, factory) {
    return this.cancelBadges.handleClick(relativeX, relativeY, factory);
  }

  draw(ctx, panelX, panelY, factory, panelWidth) {
    this.currentPanelX = panelX;
    this.currentPanelY = panelY;
    
    this.messageDisplay?.draw?.(ctx);
    
    if (factory?.isProducing) {
      this.drawCancelBadgesForFactory(ctx, panelX, panelY, factory);
    }
    
    if (this.isConfirmationDialogVisible()) {
      this.confirmationDialog.draw(ctx, panelX, panelY, panelWidth);
    }
  }

  drawCancelBadgesForFactory(ctx, panelX, panelY, factory) {
  const buttonWidth = UNIVERSAL_PANEL_CONFIG.grid.boxWidth;
  const gridSpacing = UNIVERSAL_PANEL_CONFIG.grid.spacing;
  
  const paddingLeft = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.panelPadding + UNIVERSAL_PANEL_CONFIG.CANCEL_BADGE.cancelBadgesOffsetX;
  const paddingTop = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.panelPadding + UNIVERSAL_PANEL_CONFIG.CANCEL_BADGE.cancelBadgesOffsetY;

  // First button (1hr) - starts at paddingLeft
  const button1hX = panelX + paddingLeft;
  
  // Second button (15hr) - after first button + spacing
  const button15hX = panelX + paddingLeft + buttonWidth + gridSpacing;
  
  const buttonY = panelY + paddingTop;

  this.cancelBadges.draw(ctx, button1hX, button15hX, buttonY, buttonWidth, factory);
}

  showConfirmationDialog(factoryManager, factoryType, factoryInstance) {
    try {
      this.confirmationDialog.showConfirmDialog = true;
      
      // Use the same pattern as your old working code
      if (typeof this.confirmationDialog.show === 'function') {
        this.confirmationDialog.show(factoryManager, factoryType);
      }
      
      // Update factory manager state
      if (factoryManager) {
        factoryManager.setConfirmationDialog(factoryType, true);
      }
      
      return true;
    } catch (error) {
      console.error("Error showing confirmation dialog:", error);
      return false;
    }
  }

  hideConfirmationDialog(factoryManager, factoryType) {
    this.confirmationDialog.showConfirmDialog = false;
    
    if (typeof this.confirmationDialog.hide === 'function') {
      this.confirmationDialog.hide(factoryManager, factoryType);
    }
    
    if (factoryManager) {
      factoryManager.setConfirmationDialog(factoryType, false);
    }
  }

  showMessage(message, duration = 3000) {
    this.messageDisplay.showBriefly(message, duration);
  }

  getComponent(componentName) { 
    const componentMap = {
      'cancelBadges': this.cancelBadges,
      'confirmDialog': this.confirmationDialog,
      'confirmationDialog': this.confirmationDialog,
      'messageDisplay': this.messageDisplay
    };
    
    return componentMap[componentName];
  }
}