// src/ui/FactoryPanel/CorePanelComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { UniversalBoxController } from "../universalSystem/UniversalBoxController.js";
import { UniversalBoxState } from "../universalSystem/UniversalBoxState.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { UpgradeButton } from "../UpgradeMenu/UpgradeButton.js";
import { ProductionButtons } from "../ProductionMenu/ProductionButtons.js";
import { UPGRADE_REQUIREMENTS } from "../../config/FactoryConfig.js";

export class CorePanelComponents {
  constructor(config) {
    this.config = config;
    
    this.createComponents();
    this.setupEventHandlers();
  }

  createComponents() {
    const sizes = UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes;
    const createBox = (width, height) => ({
      controller: new UniversalBoxController(this.config),
      state: new UniversalBoxState({ boxWidth: width, boxHeight: height, DIMENSIONS: { width, height } })
    });

    this.universalComponents = {
      upgradeBox: { ...createBox(sizes.upgradeButtonWidth, sizes.upgradeButtonHeight), description: this.getUpgradeDescription },
      productionBox: { ...createBox(sizes.productionButtonWidth, sizes.productionButtonHeight), description: "Choose production cycle duration" }
    };

    this.components = {
      upgradeButton: new UpgradeButton(),
      productionButtons: new ProductionButtons()
    };
  }

  getUpgradeDescription = (factory) => {
    const req = UPGRADE_REQUIREMENTS[factory.type];
    const nextLevel = factory.level + 1;

    if (!req?.levels[nextLevel]) {
      return [{ segments: [{ text: "Max level reached", color: "red", font: "14px Arial" }] }];
    }

    const { cost, time } = req.levels[nextLevel];
    const { name: resName, color: resColor } = req.resource;

    return [
      { segments: [{ text: factory.name, color: "white", font: "14px Arial" }] },
      { segments: [{ text: `Build time: ${time} sec`, color: "white", font: "11px Arial" }] },
      { segments: [
        { text: `Upgrade to Level ${nextLevel} - Cost: ${cost} `, color: "white", font: "12px Arial" },
        { text: resName, color: resColor, font: "12px Arial" }
      ]}
    ];
  }

  setupEventHandlers() {
    this.clickHandlers = {
      productionButtons: (relativeX, relativeY, factory, messageCallback) => 
        this.components.productionButtons.handleClick(relativeX, relativeY, factory, messageCallback),
      
      upgradeButton: (relativeX, relativeY, factory, panelX, panelY, getComponentPosition) => 
        this.handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY, getComponentPosition)
    };
  }

  handleUpgradeClick(relativeX, relativeY, factory, panelX, panelY, getComponentPosition) {
    const upgradePos = getComponentPosition("upgradeButton", 0, 0);
    const component = this.universalComponents.upgradeBox;
    component.state.setBounds(panelX + upgradePos.x, panelY + upgradePos.y);

    const clicked = component.controller.handleClick(relativeX, relativeY, component.state, { factory }, "upgrade");
    
    if (clicked && factory.level < factory.maxLevel) {
      factory.level++;
      factory.updateVisuals?.();
      factory.updateSprite?.();
      return true;
    }
    return false;
  }

  drawComponent(ctx, componentType, panelX, panelY, factory, getComponentPosition, spriteManager, iconManager) {
    const isUpgrade = componentType === 'upgrade';
    const componentKey = isUpgrade ? 'upgradeBox' : 'productionBox';
    const positionKey = isUpgrade ? 'upgradeButton' : 'productionButtons';
    
    const pos = getComponentPosition(positionKey, panelX, panelY);
    const component = this.universalComponents[componentKey];
    component.state.setBounds(pos.x, pos.y);

    UniversalPanelRenderer.drawUniversalBox(ctx, component.state, componentType, {
      factory,
      isHovered: component.state.isHovered,
      spriteManager: isUpgrade ? spriteManager || factory.spriteManager : undefined,
      iconManager: isUpgrade ? iconManager || factory.iconManager : undefined
    });

    if (isUpgrade) {
      if (!factory.isMaxLevel() || factory.upgrading) {
        this.components.upgradeButton.draw(ctx, pos.x, pos.y, factory);
      }
    } else {
      this.components.productionButtons.draw(ctx, pos.x, pos.y, factory);
    }
  }

  drawUpgradeComponent(ctx, panelX, panelY, factory, getComponentPosition, spriteManager, iconManager) {
    this.drawComponent(ctx, 'upgrade', panelX, panelY, factory, getComponentPosition, spriteManager, iconManager);
  }

  drawProductionComponent(ctx, panelX, panelY, factory, getComponentPosition) {
    this.drawComponent(ctx, 'production', panelX, panelY, factory, getComponentPosition);
  }

  updateHoverStates(mouseX, mouseY, factory, getScreenPosition, getComponentPosition) {
    const screenPos = getScreenPosition(factory);
    if (!screenPos.isValid) return;

    // Update upgrade hover
    this.updateComponentHover(mouseX, mouseY, 'upgradeBox', 'upgradeButton', screenPos, getComponentPosition);
    
    // Update production hover with dynamic descriptions
    this.components.productionButtons.updateHoverState(mouseX, mouseY);
    const hoveredButton = this.components.productionButtons.buttons?.find(b => b.hovered);
    const productionComponent = this.universalComponents.productionBox;

    if (hoveredButton) {
      productionComponent.state.isHovered = true;
      productionComponent.description = hoveredButton.hours === 1 
        ? "Quick 1-hour cycle for immediate results"
        : "Efficient 15-hour cycle for maximum output";
    } else {
      this.updateComponentHover(mouseX, mouseY, 'productionBox', 'productionButtons', screenPos, getComponentPosition);
    }
  }

  updateComponentHover(mouseX, mouseY, componentKey, positionKey, screenPos, getComponentPosition) {
    const pos = getComponentPosition(positionKey, screenPos.x, screenPos.y);
    const component = this.universalComponents[componentKey];
    component.state.setBounds(pos.x, pos.y);
    component.controller.updateHoverState(mouseX, mouseY, component.state);
  }

  getComponent(name) { return this.components[name]; }
  getUniversalComponent(name) { return this.universalComponents[name]; }
  updateDependencies(deps = {}) { 
    this.spriteManager = deps.spriteManager || this.spriteManager;
    this.iconManager = deps.iconManager || this.iconManager;
  }
}