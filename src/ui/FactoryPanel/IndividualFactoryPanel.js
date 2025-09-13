// =============================================================================
// UPDATED INDIVIDUAL FACTORY PANEL - Uses unified config system
// =============================================================================

import {UNIVERSAL_PANEL_CONFIG} from "../../config/UniversalPanelConfig.js";
import { ConfigurationMerger } from '../../universal/ConfigurationMerger.js';
import { UniversalPositionCalculator } from '../../universal/UniversalPositionCalculator.js';
import {UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { PanelBackground } from '../ProductionMenu/PanelBackground.js';
import { UpgradeButton } from '../UpgradeMenu/UpgradeButton.js';
import { ProductionButtons } from '../ProductionMenu/ProductionButtons.js';
import { CancelBadges } from '../ProductionMenu/CancelBadges.js';
import { ConfirmationDialog } from '../ProductionMenu/ConfirmationDialog.js';
import { MessageDisplay } from '../ProductionMenu/MessageDisplay.js';

export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
    
    // Use unified configuration system
    this.config = ConfigurationMerger.getFactoryPanelConfig(factoryType);
    
    // Store panel dimensions for compatibility
    this.panelWidth = this.config.panelWidth;
    this.panelHeight = this.config.panelHeight;
    this.debugMode = UNIVERSAL_PANEL_CONFIG.DEBUG.enabled;
    
    // Initialize components (keeping existing ones)
    this.components = {
      background: new PanelBackground(),
      upgradeButton: new UpgradeButton(),
      productionButtons: new ProductionButtons(),
      cancelBadges: new CancelBadges(),
      confirmDialog: new ConfirmationDialog(),
      messageDisplay: new MessageDisplay()
    };
    
    // Calculate component positions using unified system
    this.calculateComponentPositions();
    
    // Setup event handlers
    this.setupEventHandlers();
  }

  // =============================================================================
  // POSITIONING SYSTEM - Now uses unified calculators
  // =============================================================================
  calculateComponentPositions() {
    this.componentPositions = UniversalPositionCalculator.calculateComponentPositions(
      this.config, 
      UNIVERSAL_PANEL_CONFIG.COMPONENTS
    );
  }

  calculatePanelPosition(factory) {
    return UniversalPositionCalculator.calculatePanelPosition(factory, this.config);
  }

  calculateHoverArea(factory) {
    return UniversalPositionCalculator.calculateHoverArea(factory, this.config);
  }

  getScreenPosition(factory, offsetX = 0, offsetY = 0) {
    const pos = this.calculatePanelPosition(factory);
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;
    return { x, y, isValid: isFinite(x) && isFinite(y) };
  }

  getComponentPosition(componentName, panelX, panelY) {
    const componentPos = this.componentPositions[componentName];
    if (!componentPos) return { x: panelX, y: panelY };
    return {
      x: panelX + componentPos.x,
      y: panelY + componentPos.y
    };
  }

  isPointInHoverArea(mouseX, mouseY, factory) {
    const hoverArea = this.calculateHoverArea(factory);
    return mouseX >= hoverArea.x && mouseX <= hoverArea.x + hoverArea.width && 
           mouseY >= hoverArea.y && mouseY <= hoverArea.y + hoverArea.height;
  }

  // =============================================================================
  // EVENT HANDLING SYSTEM - Kept the same as your working version
  // =============================================================================
  setupEventHandlers() {
    this.clickHandlers = {
      confirmDialog: (relativeX, relativeY, factory, factoryManager) => {
        if (this.components.confirmDialog?.showConfirmDialog) {
          const result = this.components.confirmDialog.handleClick(relativeX, relativeY, factory);
          if (result && !this.components.confirmDialog.showConfirmDialog && factoryManager) {
            factoryManager.setConfirmationDialog(factory.type, false);
          }
          return result;
        }
        return false;
      },

      cancelBadges: (relativeX, relativeY, factory, factoryManager) => {
        const result = this.components.cancelBadges.handleClick(relativeX, relativeY, factory);
        if (result) {
          this.components.confirmDialog.show();
          if (factoryManager) {
            factoryManager.setConfirmationDialog(factory.type, true);
          }
        }
        return result;
      },

      productionButtons: (relativeX, relativeY, factory) => {
        return this.components.productionButtons.handleClick(relativeX, relativeY, factory, (msg) => {
          this.components.messageDisplay.showBriefly(msg, 3000);
        });
      },

      upgradeButton: (relativeX, relativeY, factory, factoryManager, panelX, panelY) => {
        return this.handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY);
      }
    };
  }

  handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY) {
    const upgradePos = this.getComponentPosition('upgradeButton', 0, 0);
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
    const buttonConfig = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes;
    const buttonBounds = { 
      x: 0, y: 0, 
      width: buttonConfig.upgradeButtonWidth, 
      height: buttonConfig.upgradeButtonHeight 
    };
    
    const isInButtonArea = upgradeRelativeX >= buttonBounds.x && 
                          upgradeRelativeX <= buttonBounds.x + buttonBounds.width && 
                          upgradeRelativeY >= buttonBounds.y && 
                          upgradeRelativeY <= buttonBounds.y + buttonBounds.height;

    if (isInButtonArea && factory.level < factory.maxLevel) {
      factory.level++;
      factory.updateVisuals?.();
      factory.updateSprite?.();
      return true;
    }

    return false;
  }

  // =============================================================================
  // RENDERING SYSTEM - Enhanced with unified renderer
  // =============================================================================
  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return;

    const { x: panelX, y: panelY } = screenPos;

    // Draw using unified background renderer
    UniversalPanelRenderer.drawPanelBackground(
      ctx, panelX, panelY, this.panelWidth, this.panelHeight, this.config
    );

    // Draw factory info on background
    this.components.background.drawFactoryInfo(ctx, panelX, panelY, factory);

    // Draw main components
    this.drawMainComponents(ctx, panelX, panelY, factory);
    
    // Draw overlay components
    this.drawOverlayComponents(ctx, panelX, panelY, factory);
  }

  drawMainComponents(ctx, panelX, panelY, factory) {
    // Upgrade button
    const upgradePos = this.getComponentPosition('upgradeButton', panelX, panelY);
    this.components.upgradeButton.draw(ctx, upgradePos.x, upgradePos.y, factory);

    // Production buttons
    const productionPos = this.getComponentPosition('productionButtons', panelX, panelY);
    this.components.productionButtons.draw(ctx, productionPos.x, productionPos.y, factory);

    // Cancel badges (only if producing)
    if (factory?.isProducing) {
      this.drawCancelBadges(ctx, productionPos.x, productionPos.y, factory);
    }
  }

  drawCancelBadges(ctx, productionX, productionY, factory) {
    const buttonSpacing = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.buttonSpacing;
    const productionButtonWidth = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.productionButtonWidth;
    const fifteenX = productionX + productionButtonWidth + buttonSpacing;
    
    this.components.cancelBadges.draw(ctx, productionX, fifteenX, productionY, productionButtonWidth, factory);
  }

  drawOverlayComponents(ctx, panelX, panelY, factory) {
    // Confirmation dialog (appears on top)
    this.components.confirmDialog.draw(ctx, panelX, panelY, this.panelWidth);
    
    // Message display (appears on top)
    this.components.messageDisplay.draw(ctx, panelX, panelY);
  }

  // =============================================================================
  // PUBLIC API - Main interface methods
  // =============================================================================
  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    const relativeX = mouseX - offsetX;
    const relativeY = mouseY - offsetY;
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    
    if (!screenPos.isValid) return false;

    // Process clicks in priority order
    const clickOrder = ['confirmDialog', 'cancelBadges', 'productionButtons', 'upgradeButton'];
    
    for (const handlerName of clickOrder) {
      const handler = this.clickHandlers[handlerName];
      if (handler) {
        const result = handler(relativeX, relativeY, factory, factoryManager, screenPos.x, screenPos.y);
        if (result) return true;
      }
    }

    return false;
  }

  updateHoverState(mouseX, mouseY) {
    this.components.upgradeButton.updateHoverState?.(mouseX, mouseY);
    this.components.productionButtons.updateHoverState?.(mouseX, mouseY);
  }

  showMessageBriefly(message, duration = 3000) {
    this.components.messageDisplay.showBriefly(message, duration);
  }

  // =============================================================================
  // DEBUG VISUALIZATION - Enhanced with unified renderer
  // =============================================================================
  drawDebugBorders(ctx, factory, offsetX = 0, offsetY = 0) {
    if (!this.debugMode) return;
    
    const panelPos = this.getScreenPosition(factory, offsetX, offsetY);
    const hoverArea = this.calculateHoverArea(factory);
    const targetPos = {
      x: factory.x - offsetX,
      y: factory.y - offsetY,
      width: factory.width,
      height: factory.height
    };

    const hoverPos = {
      x: hoverArea.x - offsetX,
      y: hoverArea.y - offsetY,
      width: hoverArea.width,
      height: hoverArea.height
    };

    // Use unified debug renderer
    UniversalPanelRenderer.drawDebugBorders(ctx, panelPos, hoverPos, targetPos);
  }

  // =============================================================================
  // COMPONENT ACCESS & LEGACY COMPATIBILITY
  // =============================================================================
  getComponent(componentName) {
    return this.components[componentName];
  }

  // Expose positioning object for FactoryManager compatibility
  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, factory) => this.isPointInHoverArea(mouseX, mouseY, factory),
      drawDebugBorders: (ctx, factory, offsetX, offsetY) => this.drawDebugBorders(ctx, factory, offsetX, offsetY)
    };
  }

  // Legacy properties for backward compatibility
  get buttonBounds() { return this.components.upgradeButton.buttonBounds; }
  get isButtonHovered() { return this.components.upgradeButton.isButtonHovered; }
  get showConfirmDialog() { return this.components.confirmDialog.showConfirmDialog; }
  get confirmationDialog() { return this.components.confirmDialog; }
  get width() { return this.panelWidth; }

  // =============================================================================
  // CONFIGURATION UPDATE METHODS - New features
  // =============================================================================
  updateConfiguration(customConfig) {
    this.config = ConfigurationMerger.getFactoryPanelConfig(this.factoryType, customConfig);
    this.panelWidth = this.config.panelWidth;
    this.panelHeight = this.config.panelHeight;
    this.calculateComponentPositions();
  }

  // Method to override specific config values
  setCustomOffset(offsetX, offsetY) {
    this.config.panelOffsetX = offsetX;
    this.config.panelOffsetY = offsetY;
  }

  setCustomHoverArea(x, y, width, height) {
    this.config.hoverAreaX = x;
    this.config.hoverAreaY = y;
    this.config.hoverAreaWidth = width;
    this.config.hoverAreaHeight = height;
  }

  // Enable/disable debug mode
  setDebugMode(enabled) {
    this.debugMode = enabled;
  }
}