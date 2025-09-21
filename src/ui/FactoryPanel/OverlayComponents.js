// src/ui/FactoryPanel/OverlayComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { CancelBadges } from "../ProductionMenu/CancelBadges.js";
import { ConfirmationDialog } from "../ProductionMenu/ConfirmationDialog.js";
import { MessageDisplay } from "../ProductionMenu/MessageDisplay.js";

export class OverlayComponents {
  constructor() {
    this.components = {
      cancelBadges: new CancelBadges(),
      confirmDialog: new ConfirmationDialog(),
      messageDisplay: new MessageDisplay()
    };

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.clickHandlers = {
      confirmDialog: (relativeX, relativeY, factory, factoryManager) => {
        if (!this.components.confirmDialog?.showConfirmDialog) return false;
        const result = this.components.confirmDialog.handleClick(relativeX, relativeY, factory);
        if (result && !this.components.confirmDialog.showConfirmDialog && factoryManager) {
          factoryManager.setConfirmationDialog(factory.type, false);
        }
        return result;
      },
      cancelBadges: (relativeX, relativeY, factory, factoryManager) => {
        const result = this.components.cancelBadges.handleClick(relativeX, relativeY, factory);
        if (result) {
          this.components.confirmDialog.show();
          if (factoryManager) factoryManager.setConfirmationDialog(factory.type, true);
        }
        return result;
      }
    };
  }

  drawCancelBadges(ctx, productionX, productionY, factory) {
    const spacing = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.buttonSpacing;
    const width = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.productionButtonWidth;
    this.components.cancelBadges.draw(ctx, productionX, productionX + width + spacing, productionY, width, factory);
  }

  drawOverlayComponents(ctx, panelX, panelY, factory, panelWidth) {
    this.components.confirmDialog.draw(ctx, panelX, panelY, panelWidth);
    this.components.messageDisplay.draw(ctx, panelX, panelY);
  }

  showMessage(message, duration = 3000) {
    this.components.messageDisplay.showBriefly(message, duration);
  }

  getComponent(componentName) { 
    return this.components[componentName]; 
  }
}