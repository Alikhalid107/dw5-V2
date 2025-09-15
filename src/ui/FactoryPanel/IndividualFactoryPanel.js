// src/ui/IndividualFactoryPanel.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { ConfigurationMerger } from '../../universal/ConfigurationMerger.js';
import { UniversalPositionCalculator } from '../universalSystem/UniversalPositionCalculator.js';
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

import { UniversalBoxController } from '../universalSystem/UniversalBoxController.js';
import { UniversalBoxState } from '../universalSystem/UniversalBoxState.js';

import { UpgradeButton } from '../UpgradeMenu/UpgradeButton.js';
import { ProductionButtons } from '../ProductionMenu/ProductionButtons.js';
import { CancelBadges } from '../ProductionMenu/CancelBadges.js';
import { ConfirmationDialog } from '../ProductionMenu/ConfirmationDialog.js';
import { MessageDisplay } from '../ProductionMenu/MessageDisplay.js';

/**
 * Manages the UI for a single factory, integrating universal components.
 */
export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
    this.config = ConfigurationMerger.getFactoryPanelConfig(factoryType);
    this.panelWidth = this.config.panelWidth;
    this.panelHeight = this.config.panelHeight;
    this.debugMode = UNIVERSAL_PANEL_CONFIG.DEBUG.enabled;

    this.initializeUniversalSystem();
    
    // Legacy components retained for specific overlay drawing or interactions
    this.components = {
      upgradeButton: new UpgradeButton(),
      productionButtons: new ProductionButtons(),
      cancelBadges: new CancelBadges(),
      confirmDialog: new ConfirmationDialog(),
      messageDisplay: new MessageDisplay()
    };

    this.calculateComponentPositions();
    this.setupEventHandlers();
  }

  initializeUniversalSystem() {
    const componentSizes = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes;
    this.universalComponents = {
      upgradeBox: {
        controller: new UniversalBoxController(this.config),
        state: new UniversalBoxState({
          boxWidth: componentSizes.upgradeButtonWidth,
          boxHeight: componentSizes.upgradeButtonHeight
        })

      },
      productionBox: {
        controller: new UniversalBoxController(this.config),
        state: new UniversalBoxState({
          boxWidth: componentSizes.productionButtonWidth,
          boxHeight: componentSizes.upgradeButtonHeight
        })

      }
    };
  }

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
        return this.handleUpgradeClickUniversal(relativeX, relativeY, factory, panelX, panelY);
      }
    };
  }

  handleUpgradeClickUniversal(relativeX, relativeY, factory, panelX, panelY) {
    const upgradePos = this.getComponentPosition('upgradeButton', 0, 0);
    const upgradeComponent = this.universalComponents.upgradeBox;

    upgradeComponent.state.setBounds(
      panelX + upgradePos.x,
      panelY + upgradePos.y
    );

    const context = { factory };
    const wasClicked = upgradeComponent.controller.handleClick(
      relativeX, relativeY,
      upgradeComponent.state,
      context,
      'upgrade'
    );

    if (wasClicked && factory.level < factory.maxLevel) {
      factory.level++;
      factory.updateVisuals?.();
      factory.updateSprite?.();
      return true;
    }
    return false;
  }

  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return;
    const { x: panelX, y: panelY } = screenPos;

    UniversalPanelRenderer.drawCompletePanel(ctx, panelX, panelY, this.panelWidth, this.panelHeight, {
      backgroundConfig: this.config,
      factory: factory,
      showFactoryInfo: true,
      panelType: 'factory'
    });

    this.drawUniversalComponents(ctx, panelX, panelY, factory);
    this.drawOverlayComponents(ctx, panelX, panelY, factory);
  }

  drawUniversalComponents(ctx, panelX, panelY, factory) {
    this.drawUpgradeButtonUniversal(ctx, panelX, panelY, factory);
    this.drawProductionButtonsUniversal(ctx, panelX, panelY, factory);

    if (factory?.isProducing) {
      const productionPos = this.getComponentPosition('productionButtons', panelX, panelY);
      this.drawCancelBadges(ctx, productionPos.x, productionPos.y, factory);
    }
  }

  drawUpgradeButtonUniversal(ctx, panelX, panelY, factory) {
    const upgradePos = this.getComponentPosition('upgradeButton', panelX, panelY);
    const upgradeComponent = this.universalComponents.upgradeBox;
    upgradeComponent.state.setBounds(upgradePos.x, upgradePos.y);

    const context = {
      factory,
      isHovered: upgradeComponent.state.isHovered,
      spriteManager: this.spriteManager || factory.spriteManager,
      iconManager: this.iconManager || factory.iconManager
    };

    UniversalPanelRenderer.drawUniversalBox(
      ctx,
      upgradeComponent.state,
      'upgrade',
      context
    );

    // Fallback/Overlay for complex interactions or specific visuals not fully covered
    if (!factory.isMaxLevel() || factory.upgrading) {
      this.components.upgradeButton.draw(ctx, upgradePos.x, upgradePos.y, factory);
    }
  }

  drawProductionButtonsUniversal(ctx, panelX, panelY, factory) {
    const productionPos = this.getComponentPosition('productionButtons', panelX, panelY);
    const productionComponent = this.universalComponents.productionBox;
    productionComponent.state.setBounds(productionPos.x, productionPos.y);

    const context = {
      factory,
      isHovered: productionComponent.state.isHovered
    };

    UniversalPanelRenderer.drawUniversalBox(
      ctx,
      productionComponent.state,
      'production',
      context
    );

    // Overlay for button details (text, icons) handled by legacy component
    this.components.productionButtons.draw(ctx, productionPos.x, productionPos.y, factory);
  }

  updateHoverStates(mouseX, mouseY, factory) {
    const screenPos = this.getScreenPosition(factory);
    if (!screenPos.isValid) return;

    const upgradePos = this.getComponentPosition('upgradeButton', screenPos.x, screenPos.y);
    const upgradeComponent = this.universalComponents.upgradeBox;
    upgradeComponent.state.setBounds(upgradePos.x, upgradePos.y);
    upgradeComponent.controller.updateHoverState(mouseX, mouseY, upgradeComponent.state);

    const productionPos = this.getComponentPosition('productionButtons', screenPos.x, screenPos.y);
    const productionComponent = this.universalComponents.productionBox;
    productionComponent.state.setBounds(productionPos.x, productionPos.y);
    productionComponent.controller.updateHoverState(mouseX, mouseY, productionComponent.state);
  }

  drawCancelBadges(ctx, productionX, productionY, factory) {
    const buttonSpacing = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.buttonSpacing;
    const productionButtonWidth = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.productionButtonWidth;
    const fifteenX = productionX + productionButtonWidth + buttonSpacing;
    this.components.cancelBadges.draw(ctx, productionX, fifteenX, productionY, productionButtonWidth, factory);
  }

  drawOverlayComponents(ctx, panelX, panelY, factory) {
    this.components.confirmDialog.draw(ctx, panelX, panelY, this.panelWidth);
    this.components.messageDisplay.draw(ctx, panelX, panelY);
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    const relativeX = mouseX - offsetX;
    const relativeY = mouseY - offsetY;
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);

    if (!screenPos.isValid) return false;

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

    UniversalPanelRenderer.drawDebugBorders(ctx, panelPos, hoverPos, targetPos);
  }

  getComponent(componentName) {
    return this.components[componentName];
  }

  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, factory) => this.isPointInHoverArea(mouseX, mouseY, factory),
      drawDebugBorders: (ctx, factory, offsetX, offsetY) => this.drawDebugBorders(ctx, factory, offsetX, offsetY)
    };
  }

  getUniversalComponent(componentName) {
    return this.universalComponents[componentName];
  }

  updateDependencies(dependencies = {}) {
    this.spriteManager = dependencies.spriteManager || this.spriteManager;
    this.iconManager = dependencies.iconManager || this.iconManager;
    // Dependencies for universal components are passed via context during draw/update
  }
}