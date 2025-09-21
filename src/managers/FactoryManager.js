// Fixed FactoryManager.js
import { FactoryConfig } from "../config/FactoryConfig.js";
import { ProductionTimerOverlay } from "../ui/ProductionMenu/ProductionTimerOverlay.js";
import { Factory } from "../sections/Factory/Factory.js";
import { FactoryUICoordinator } from "./FactoryUICoordinator.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    Object.assign(this, { 
      garageX, garageY, garageWidth, garageHeight, 
      factoryProperties: FactoryConfig, 
      showGrid: false, 
      showUpgradeAll: false,
      activeConfirmationDialog: null
    });
    
    this.factories = this.createFactories();
    this.ui = new FactoryUICoordinator(this);
    this.productionOverlays = this.createProductionOverlays();
  }

  createFactories() {
    return Object.fromEntries(
      Object.keys(this.factoryProperties).map(type => [
        type, new Factory(type, this.factoryProperties[type], this.garageX, this.garageY)
      ])
    );
  }

  createProductionOverlays() {
    return Object.fromEntries(
      Object.keys(this.factories).map(type => [
        type, new ProductionTimerOverlay(this.factories[type])
      ])
    );
  }

  update(deltaTime) {
    Object.values(this.factories).forEach(factory => factory.update(deltaTime));
    this.ui?.update?.(deltaTime);
  }

  handleMouseMove(mouseX, mouseY) {
    // Handle confirmation dialog state
    if (this.activeConfirmationDialog) {
      this.showGrid = true;
      const factory = this.factories[this.activeConfirmationDialog];
      if (factory) {
        factory.isHovered = true;
        this.ui.factoryPanels[this.activeConfirmationDialog]?.updateHoverStates?.(mouseX, mouseY, factory);
      }
      return;
    }

    // Reset hover states and check for new hovers
    Object.values(this.factories).forEach(f => f.isHovered = false);

    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      const panel = this.ui.factoryPanels[factory.type];
      if (panel?.positioning?.isPointInHoverArea(mouseX, mouseY, factory)) { 
        factory.isHovered = true; 
        return true; 
      }
      return false;
    });

    const overUpgradeAll = this.ui?.upgradeAllButton?.isPointInsideWorld?.(mouseX, mouseY) || false;
    
    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
    
    // Update panel hover states with correct method name
    Object.entries(this.ui.factoryPanels).forEach(([type, panel]) => {
      if (this.factories[type].isHovered) {
        panel.updateHoverStates?.(mouseX, mouseY, this.factories[type]);
      }
    });
  }

  setConfirmationDialog(factoryType, show) {
    this.activeConfirmationDialog = show ? factoryType : null;
    this.showGrid = show;
    const factory = this.factories[factoryType];
    if (factory) factory.isHovered = show;
  }

  // Factory management methods
  getFactoryLevel(factoryType) { return this.factories[factoryType]?.level || 0; }
  getAllFactoryLevels() { 
    return Object.fromEntries(Object.keys(this.factories).map(type => [type, this.factories[type].level])); 
  }
  setFactoryZIndex(factoryType, zIndex) { this.factories[factoryType]?.setZIndex(zIndex); }
  getFactoryZIndex(factoryType) { return this.factories[factoryType]?.zIndex || 7; }
  setAllFactoryZIndexes(zIndexMap) { 
    Object.entries(zIndexMap).forEach(([type, zIndex]) => this.factories[type]?.setZIndex(zIndex)); 
  }

  // Production methods
  startFactoryProduction(factoryType, hours) { return this.factories[factoryType]?.startProduction(hours) || false; }
  cancelFactoryProduction(factoryType) { this.factories[factoryType]?.cancelProduction(); }
  isFactoryProducing(factoryType) { return this.factories[factoryType]?.isProducing || false; }
  getFactoryProductionTime(factoryType) { return this.factories[factoryType]?.getFormattedProductionTime() || ""; }

  // Rendering methods
  getObjects() { return Object.values(this.factories).flatMap(factory => factory.getObjects()); }

  drawUI(ctx, offsetX, offsetY) { 
    this.ui.drawUI(ctx, offsetX, offsetY);
    
    // Draw debug borders and production overlays
    Object.entries(this.ui.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factories[type];
      if (factory && panel.positioning) {
        panel.positioning.drawDebugBorders(ctx, factory, offsetX, offsetY);
      }
    });
    
    Object.values(this.productionOverlays).forEach(overlay => overlay.draw(ctx, offsetX, offsetY));

    // Draw confirmation dialog if active
    if (this.activeConfirmationDialog) {
      const factory = this.factories[this.activeConfirmationDialog];
      const panel = this.ui.factoryPanels[this.activeConfirmationDialog];
      if (factory && panel?.confirmationDialog) {
        panel.confirmationDialog.draw(ctx, offsetX, offsetY, panel.width);
      }
    }
  }
  
  handleClick(mouseX, mouseY) { return this.ui.handleClick(mouseX, mouseY); }
}