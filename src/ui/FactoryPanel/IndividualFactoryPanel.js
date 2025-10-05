// src/ui/FactoryPanel/IndividualFactoryPanel.js
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

    // Create core components first - they will auto-calculate panel dimensions
    this.coreComponents = new CorePanelComponents(this.config);
    this.overlayComponents = new OverlayComponents();

    // Use auto-calculated dimensions from coreComponents
    // Only fall back to config if explicitly set AND coreComponents failed
    this.panelWidth = this.coreComponents?.panelWidth ;
    this.panelHeight = this.coreComponents?.panelHeight ;

    this.setupComponentCommunication();
  }

  setupComponentCommunication() {
    this.coreComponents.setMessageCallback((message) => {
      this.overlayComponents.showMessage(message);
    });
  }

  calculatePanelPosition(factory) {
    // Pass panel dimensions to position calculator
    const configWithDimensions = {
      ...this.config,
      panelWidth: this.panelWidth,
      panelHeight: this.panelHeight
    };
    return UniversalPositionCalculator.calculatePanelPosition(factory, configWithDimensions);
  }

  calculateHoverArea(factory) {
    const configWithDimensions = {
      ...this.config,
      panelWidth: this.panelWidth,
      panelHeight: this.panelHeight
    };
    return UniversalPositionCalculator.calculateHoverArea(factory, configWithDimensions);
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
    this.coreComponents.drawFactoryGrid(ctx, panelX, panelY, factory);
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
      let offsetX = panelX + 1;
      const y = panelY + 60 + i * lineHeight;

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

    // Set factory manager reference
    this.setFactoryManager(factoryManager);

    // Priority order: overlay components first, then core components
    return this.overlayComponents.handleClick(relativeX, relativeY, factory, factoryManager) ||
           this.coreComponents.handleFactoryGridClick(relativeX, relativeY, factory, screenPos.x, screenPos.y);
  }

  setFactoryManager(factoryManager) {
    this.factoryManager = factoryManager;
    if (this.overlayComponents && factoryManager) {
      this.overlayComponents.factoryManager = factoryManager;
    }
  }

  isConfirmationDialogVisible() {
    return this.overlayComponents?.isConfirmationDialogVisible() || false;
  }

  showProductionMessage(message) {
    this.overlayComponents.showMessage(message);
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

  // NEW METHOD: Update box count and recalculate panel dimensions
  updateBoxCount(totalBoxes) {
    this.coreComponents.updateBoxCount(totalBoxes);
    this.panelWidth = this.coreComponents.panelWidth;
    this.panelHeight = this.coreComponents.panelHeight;
    console.log(`Updated panel dimensions: ${this.panelWidth}x${this.panelHeight}`);
  }

  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, factory) => this.isPointInHoverArea(mouseX, mouseY, factory),
      drawDebugBorders: (ctx, factory, offsetX, offsetY) => this.drawDebugBorders(ctx, factory, offsetX, offsetY)
    };
  }
}