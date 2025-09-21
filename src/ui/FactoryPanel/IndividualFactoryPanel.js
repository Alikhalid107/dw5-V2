// src/ui/FactoryPanel/IndividualFactoryPanel.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { ConfigurationMerger } from "../../universal/ConfigurationMerger.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { CorePanelComponents } from "./CorePanelComponents.js";
import { OverlayComponents } from "./OverlayComponents.js";

export class IndividualFactoryPanel {
  constructor(factory, factoryType) {
    this.factory = factory;
    this.factoryType = factoryType;
    this.config = ConfigurationMerger.getFactoryPanelConfig(factoryType);
    this.panelWidth = this.config.panelWidth;
    this.panelHeight = this.config.panelHeight;

    // Initialize component groups
    this.coreComponents = new CorePanelComponents(this.config);
    this.overlayComponents = new OverlayComponents();

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
        return this.overlayComponents.clickHandlers.confirmDialog(relativeX, relativeY, factory, factoryManager);
      },
      cancelBadges: (relativeX, relativeY, factory, factoryManager) => {
        return this.overlayComponents.clickHandlers.cancelBadges(relativeX, relativeY, factory, factoryManager);
      },
      productionButtons: (relativeX, relativeY, factory) => {
        return this.coreComponents.clickHandlers.productionButtons(
          relativeX, relativeY, factory, 
          (msg) => this.overlayComponents.showMessage(msg, 3000)
        );
      },
      upgradeButton: (relativeX, relativeY, factory, factoryManager, panelX, panelY) => {
        return this.coreComponents.clickHandlers.upgradeButton(
          relativeX, relativeY, factory, panelX, panelY, this.getComponentPosition.bind(this)
        );
      }
    };
  }

  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return;
    const { x: panelX, y: panelY } = screenPos;

    UniversalPanelRenderer.drawPanelBackground(ctx, panelX, panelY, this.panelWidth, this.panelHeight, this.config);

    this.drawPanelHeader(ctx, panelX, panelY);
    this.drawUniversalComponents(ctx, panelX, panelY, factory);
    this.drawOverlayComponents(ctx, panelX, panelY, factory);
  }

  drawPanelHeader(ctx, panelX, panelY) {
    const hoveredComponent = Object.keys(this.coreComponents.universalComponents).find(
      componentName => this.coreComponents.universalComponents[componentName].state.isHovered
    );

    if (!hoveredComponent) return;

    const comp = this.coreComponents.universalComponents[hoveredComponent];
    const desc = comp.description;
    let headerLines = [];

    if (typeof desc === "function") {
      try {
        const result = desc(this.factory);
        headerLines = Array.isArray(result) ? result : 
          [{ segments: [{ text: result, color: "white", font: "14px Arial" }] }];
      } catch (err) {
        console.warn("description function threw:", err);
      }
    } else if (typeof desc === "string") {
      headerLines = [{ segments: [{ text: desc, color: "white", font: "14px Arial" }] }];
    }

    const lineHeight = 18;
    headerLines.forEach((line, i) => {
      let offsetX = panelX + 10;
      const y = panelY + 20 + i * lineHeight;

      (line.segments || []).forEach(seg => {
        UniversalPanelRenderer.drawText(ctx, seg.text, offsetX, y,
          seg.font || "14px Arial", "left", seg.color || "white");
        offsetX += ctx.measureText(seg.text).width;
      });
    });
  }

  drawUniversalComponents(ctx, panelX, panelY, factory) {
    this.coreComponents.drawUpgradeComponent(
      ctx, panelX, panelY, factory, 
      this.getComponentPosition.bind(this), 
      this.spriteManager, this.iconManager
    );
    
    this.coreComponents.drawProductionComponent(
      ctx, panelX, panelY, factory, 
      this.getComponentPosition.bind(this)
    );
    
    if (factory?.isProducing) {
      const pos = this.getComponentPosition("productionButtons", panelX, panelY);
      this.overlayComponents.drawCancelBadges(ctx, pos.x, pos.y, factory);
    }
  }

  drawOverlayComponents(ctx, panelX, panelY, factory) {
    this.overlayComponents.drawOverlayComponents(ctx, panelX, panelY, factory, this.panelWidth);
  }

  updateHoverStates(mouseX, mouseY, factory) {
    this.coreComponents.updateHoverStates(
      mouseX, mouseY, factory, 
      this.getScreenPosition.bind(this), 
      this.getComponentPosition.bind(this)
    );
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    const relativeX = mouseX - offsetX;
    const relativeY = mouseY - offsetY;
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return false;

    const clickOrder = ["confirmDialog", "cancelBadges", "productionButtons", "upgradeButton"];
    for (const handlerName of clickOrder) {
      const handler = this.clickHandlers[handlerName];
      if (handler?.call(this, relativeX, relativeY, factory, factoryManager, screenPos.x, screenPos.y)) {
        return true;
      }
    }
    return false;
  }

  getComponent(componentName) { 
    return this.coreComponents.getComponent(componentName) || 
           this.overlayComponents.getComponent(componentName);
  }

  getUniversalComponent(componentName) { 
    return this.coreComponents.getUniversalComponent(componentName); 
  }

  drawDebugBorders(ctx, factory, offsetX = 0, offsetY = 0) {
    const panelPos = this.getScreenPosition(factory, offsetX, offsetY);
    const hoverArea = this.calculateHoverArea(factory);
    const targetPos = {
      x: factory.x - offsetX,
      y: factory.y - offsetY,
      width: factory.width,
      height: factory.height,
    };
    const hoverPos = {
      x: hoverArea.x - offsetX,
      y: hoverArea.y - offsetY,
      width: hoverArea.width,
      height: hoverArea.height,
    };
    UniversalPanelRenderer.drawDebugBorders(ctx, panelPos, hoverPos, targetPos);
  }

  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, factory) => this.isPointInHoverArea(mouseX, mouseY, factory),
      drawDebugBorders: (ctx, factory, offsetX, offsetY) => this.drawDebugBorders(ctx, factory, offsetX, offsetY)
    };
  }

  updateDependencies(dependencies = {}) {
    this.spriteManager = dependencies.spriteManager || this.spriteManager;
    this.iconManager = dependencies.iconManager || this.iconManager;
    
    // Update dependencies in component groups
    this.coreComponents.updateDependencies(dependencies);
  }
}