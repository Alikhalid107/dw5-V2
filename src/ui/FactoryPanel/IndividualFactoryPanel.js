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

    this.coreComponents = new CorePanelComponents(this.config);
    this.overlayComponents = new OverlayComponents();

    this.setupComponentCommunication();
  }

  setupComponentCommunication() {
    this.coreComponents.setCancelDialogCallback((factory, factoryInstance) => {
      // Store the factory manager reference for proper dialog handling
      if (this.factoryManager) {
        this.overlayComponents.showConfirmationDialog(this.factoryManager, factory.type, factoryInstance);
      } else {
        console.warn("Factory manager not set - cannot show confirmation dialog");
      }
    });

    this.coreComponents.setMessageCallback((message) => {
      this.overlayComponents.showMessage(message);
    });
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

  isPointInHoverArea(mouseX, mouseY, factory) {
    const area = this.calculateHoverArea(factory);
    return mouseX >= area.x && mouseX <= area.x + area.width &&
           mouseY >= area.y && mouseY <= area.y + area.height;
  }

  draw(ctx, offsetX = 0, offsetY = 0, factory = this.factory) {
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return;
    
    const { x: panelX, y: panelY } = screenPos;

    UniversalPanelRenderer.drawPanelBackground(ctx, panelX, panelY, this.panelWidth, this.panelHeight, this.config);
    this.drawPanelHeader(ctx, panelX, panelY);
    this.coreComponents.drawFactoryGrid(ctx, panelX, panelY, factory, this.spriteManager, this.iconManager);
    this.overlayComponents.draw(ctx, panelX, panelY, factory, this.panelWidth);
  }

  drawPanelHeader(ctx, panelX, panelY) {
    const hoveredComponent = this.coreComponents.getUniversalComponent("factoryGrid");
    if (!hoveredComponent) return;

    const desc = hoveredComponent.description;
    let headerLines = [];

    if (typeof desc === "function") {
      try {
        const result = desc(this.factory);
        headerLines = Array.isArray(result) ? result : 
          [{ segments: [{ text: result, color: "white", font: "14px Arial" }] }];
      } catch (err) {
        console.warn("Description function error:", err);
      }
    } else if (typeof desc === "string") {
      headerLines = [{ segments: [{ text: desc, color: "white", font: "14px Arial" }] }];
    }

    const lineHeight = 18;
    headerLines.forEach((line, i) => {
      let offsetX = panelX + 10;
      const y = panelY + 20 + i * lineHeight;

      (line.segments || []).forEach((seg) => {
        ctx.font = seg.font || "14px Arial";
        ctx.fillStyle = seg.color || "white";
        ctx.textAlign = "left";
        ctx.fillText(seg.text, offsetX, y);
        offsetX += ctx.measureText(seg.text).width;
      });
    });
  }

  updateHoverStates(mouseX, mouseY, factory) {
    this.coreComponents.updateHoverStates(mouseX, mouseY, factory, this.getScreenPosition.bind(this));
  }

  handleClick(mouseX, mouseY, offsetX = 0, offsetY = 0, factory = this.factory, factoryManager = null) {
    const relativeX = mouseX - offsetX;
    const relativeY = mouseY - offsetY;
    const screenPos = this.getScreenPosition(factory, offsetX, offsetY);
    if (!screenPos.isValid) return false;

    // Set and store factory manager reference
    this.setFactoryManager(factoryManager);

    // Priority order: overlay components first, then core components
    return this.overlayComponents.handleClick(relativeX, relativeY, factory, factoryManager) ||
           this.coreComponents.handleFactoryGridClick(relativeX, relativeY, factory, screenPos.x, screenPos.y);
  }

  setFactoryManager(factoryManager) {
    this.factoryManager = factoryManager;
    // Ensure overlay components also have the factory manager reference
    if (this.overlayComponents && factoryManager) {
      this.overlayComponents.factoryManager = factoryManager;
    }
  }

  // Add method to check if confirmation dialog should be shown
  isConfirmationDialogVisible() {
    return this.overlayComponents?.isConfirmationDialogVisible() || false;
  }

  showProductionMessage(message) {
    this.overlayComponents.showMessage(message);
  }

  getUniversalComponent(componentName) {
    return this.coreComponents.getUniversalComponent(componentName);
  }

  updateDependencies(dependencies = {}) {
    this.spriteManager = dependencies.spriteManager || this.spriteManager;
    this.iconManager = dependencies.iconManager || this.iconManager;
    this.coreComponents.updateDependencies(dependencies);
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
}