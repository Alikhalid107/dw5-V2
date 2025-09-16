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

export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
    this.config = ConfigurationMerger.getFactoryPanelConfig(factoryType);
    this.panelWidth = this.config.panelWidth;
    this.panelHeight = this.config.panelHeight;
    this.debugMode = UNIVERSAL_PANEL_CONFIG.DEBUG.enabled;

    const sizes = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes;
    this.universalComponents = {
      upgradeBox: {
        controller: new UniversalBoxController(this.config),
        state: new UniversalBoxState({
          boxWidth: sizes.upgradeButtonWidth,
          boxHeight: sizes.upgradeButtonHeight,
          DIMENSIONS: { width: sizes.upgradeButtonWidth, height: sizes.upgradeButtonHeight }
        })
      },
      productionBox: {
        controller: new UniversalBoxController(this.config),
        state: new UniversalBoxState({
          boxWidth: sizes.productionButtonWidth,
          boxHeight: sizes.productionButtonHeight,
          DIMENSIONS: { width: sizes.productionButtonWidth, height: sizes.productionButtonHeight }
        })
      }
    };

    this.components = {
      upgradeButton: new UpgradeButton(),
      productionButtons: new ProductionButtons(),
      cancelBadges: new CancelBadges(),
      confirmDialog: new ConfirmationDialog(),
      messageDisplay: new MessageDisplay()
    };

    this.setupEventHandlers();
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
    const positions = UniversalPositionCalculator.calculateComponentPositions(
      this.config, UNIVERSAL_PANEL_CONFIG.COMPONENTS
    );
    const pos = positions[componentName];
    return pos ? { x: panelX + pos.x, y: panelY + pos.y } : { x: panelX, y: panelY };
  }

  isPointInHoverArea(mouseX, mouseY, factory) {
    const area = this.calculateHoverArea(factory);
    return mouseX >= area.x && mouseX <= area.x + area.width &&
           mouseY >= area.y && mouseY <= area.y + area.height;
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
    upgradeComponent.state.setBounds(panelX + upgradePos.x, panelY + upgradePos.y);

    const wasClicked = upgradeComponent.controller.handleClick(
      relativeX, relativeY, upgradeComponent.state, { factory }, 'upgrade'
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
    this.drawUpgradeComponent(ctx, panelX, panelY, factory);
    this.drawProductionComponent(ctx, panelX, panelY, factory);
    if (factory?.isProducing) {
      const pos = this.getComponentPosition('productionButtons', panelX, panelY);
      this.drawCancelBadges(ctx, pos.x, pos.y, factory);
    }
  }

  drawUpgradeComponent(ctx, panelX, panelY, factory) {
    const pos = this.getComponentPosition('upgradeButton', panelX, panelY);
    const component = this.universalComponents.upgradeBox;
    component.state.setBounds(pos.x, pos.y);

    UniversalPanelRenderer.drawUniversalBox(ctx, component.state, 'upgrade', {
      factory,
      isHovered: component.state.isHovered,
      spriteManager: this.spriteManager || factory.spriteManager,
      iconManager: this.iconManager || factory.iconManager
    });

    if (!factory.isMaxLevel() || factory.upgrading) {
      this.components.upgradeButton.draw(ctx, pos.x, pos.y, factory);
    }
  }

  drawProductionComponent(ctx, panelX, panelY, factory) {
    const pos = this.getComponentPosition('productionButtons', panelX, panelY);
    const component = this.universalComponents.productionBox;
    component.state.setBounds(pos.x, pos.y);

    UniversalPanelRenderer.drawUniversalBox(ctx, component.state, 'production', {
      factory,
      isHovered: component.state.isHovered
    });

    this.components.productionButtons.draw(ctx, pos.x, pos.y, factory);
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
    const spacing = UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.buttonSpacing;
    const width = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.productionButtonWidth;
    const fifteenX = productionX + width + spacing;
    this.components.cancelBadges.draw(ctx, productionX, fifteenX, productionY, width, factory);
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
      if (handler?.call(this, relativeX, relativeY, factory, factoryManager, screenPos.x, screenPos.y)) {
        return true;
      }
    }
    return false;
  }

  drawDebugBorders(ctx, factory, offsetX = 0, offsetY = 0) {
    if (!this.debugMode) return;
    const panelPos = this.getScreenPosition(factory, offsetX, offsetY);
    const hoverArea = this.calculateHoverArea(factory);
    const targetPos = { x: factory.x - offsetX, y: factory.y - offsetY, width: factory.width, height: factory.height };
    const hoverPos = { x: hoverArea.x - offsetX, y: hoverArea.y - offsetY, width: hoverArea.width, height: hoverArea.height };
    UniversalPanelRenderer.drawDebugBorders(ctx, panelPos, hoverPos, targetPos);
  }

  getComponent(componentName) { return this.components[componentName]; }
  getUniversalComponent(componentName) { return this.universalComponents[componentName]; }

  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, factory) => this.isPointInHoverArea(mouseX, mouseY, factory),
      drawDebugBorders: (ctx, factory, offsetX, offsetY) => this.drawDebugBorders(ctx, factory, offsetX, offsetY)
    };
  }

  updateDependencies(dependencies = {}) {
    this.spriteManager = dependencies.spriteManager || this.spriteManager;
    this.iconManager = dependencies.iconManager || this.iconManager;
  }
}