import { Factory } from "../sections/Factory/Factory.js";
import { FactoryUICoordinator } from "./FactoryUICoordinator.js";
import { FactoryTypes } from "../config/FactoryConfig.js";
import { ProductionTimerOverlay } from "../ui/ProductionMenu/ProductionTimerOverlay.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    Object.assign(this, { 
      garageX, garageY, garageWidth, garageHeight, 
      factoryProperties: FactoryTypes, 
      showGrid: false, 
      showUpgradeAll: false,
      activeConfirmationDialog: null
    });
    
    this.factories = this.createFactories();
    this.ui = new FactoryUICoordinator(this);
    this.productionOverlays = this.createProductionOverlays();
  }

  createFactories() {
    return Object.keys(this.factoryProperties).reduce((acc, type) => {
      acc[type] = new Factory(type, this.factoryProperties[type], this.garageX, this.garageY);
      return acc;
    }, {});
  }

  createProductionOverlays() {
    return Object.keys(this.factories).reduce((acc, type) => {
      acc[type] = new ProductionTimerOverlay(this.factories[type]);
      return acc;
    }, {});
  }

  update(deltaTime) {
    Object.values(this.factories).forEach(factory => factory.update(deltaTime));
    this.ui?.update?.(deltaTime);
  }

  handleMouseMove(mouseX, mouseY) {
    // Keep existing mouse move logic exactly the same
    if (this.activeConfirmationDialog) {
      this.showGrid = true;
      const factory = this.factories[this.activeConfirmationDialog];
      if (factory) {
        factory.isHovered = true;
        const panel = this.ui.factoryPanels[this.activeConfirmationDialog];
        if (panel) {
          panel.updateHoverState(mouseX, mouseY);
        }
      }
      return;
    }

    Object.values(this.factories).forEach(f => f.isHovered = false);

    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      // Use the consolidated positioning system
      const panel = this.ui.factoryPanels[factory.type];
      if (panel && panel.positioning.isPointInHoverArea(mouseX, mouseY, factory)) { 
        factory.isHovered = true; 
        return true; 
      }
      return false;
    });

    const overUpgradeAll = this.ui?.upgradeAllButton?.isPointInsideWorld?.(mouseX, mouseY) || false;
    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
    
    Object.entries(this.ui.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factories[type];
      if (factory.isHovered) {
        panel.updateHoverState(mouseX, mouseY);
      }
    });
  }

  // REMOVED: isPointInsideFactoryWithPanel - now handled by positioning system

  setConfirmationDialog(factoryType, show) {
    if (show) {
      this.activeConfirmationDialog = factoryType;
      this.showGrid = true;
      const factory = this.factories[factoryType];
      if (factory) {
        factory.isHovered = true;
      }
    } else {
      this.activeConfirmationDialog = null;
      const factory = this.factories[factoryType];
      if (factory) {
        factory.isHovered = false;
      }
    }
  }

  // Keep all existing proxy methods
  getFactoryLevel(factoryType) { return this.factories[factoryType]?.level || 0; }
  getAllFactoryLevels() { 
    return Object.keys(this.factories).reduce((acc, type) => { 
      acc[type] = this.factories[type].level; 
      return acc; 
    }, {}); 
  }
  setFactoryZIndex(factoryType, zIndex) { this.factories[factoryType]?.setZIndex(zIndex); }
  getFactoryZIndex(factoryType) { return this.factories[factoryType]?.zIndex || 7; }
  setAllFactoryZIndexes(zIndexMap) { 
    Object.keys(zIndexMap).forEach(type => { 
      if (this.factories[type]) this.setFactoryZIndex(type, zIndexMap[type]); 
    }); 
  }

  // Production methods
  startFactoryProduction(factoryType, hours) {
    return this.factories[factoryType]?.startProduction(hours) || false;
  }
  cancelFactoryProduction(factoryType) {
    this.factories[factoryType]?.cancelProduction();
  }
  isFactoryProducing(factoryType) {
    return this.factories[factoryType]?.isProducing || false;
  }
  getFactoryProductionTime(factoryType) {
    return this.factories[factoryType]?.getFormattedProductionTime() || "";
  }

  getObjects() { 
    return Object.values(this.factories).flatMap(factory => factory.getObjects()); 
  }

  drawUI(ctx, offsetX, offsetY) { 
    this.ui.drawUI(ctx, offsetX, offsetY);
    
    // Draw debug borders for all factories
    Object.entries(this.ui.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factories[type];
      if (factory) {
        panel.positioning.drawDebugBorders(ctx, factory, offsetX, offsetY);
      }
    });
    
    Object.values(this.productionOverlays).forEach(overlay => {
      overlay.draw(ctx, offsetX, offsetY);
    });

    if (this.activeConfirmationDialog) {
      const factory = this.factories[this.activeConfirmationDialog];
      const panel = this.ui.factoryPanels[this.activeConfirmationDialog];
      if (factory && panel && panel.confirmationDialog) {
        panel.confirmationDialog.draw(ctx, offsetX, offsetY, panel.width);
      }
    }
  }
  
  handleClick(mouseX, mouseY) { 
    return this.ui.handleClick(mouseX, mouseY); 
  }
}