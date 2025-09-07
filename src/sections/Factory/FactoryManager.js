import { Factory } from "./Factory.js";
import { FactoryUI } from "./FactoryUI.js";
import { FactoryTypes } from "./FactoryTypes.js";
import { ProductionTimerOverlay } from "../../ui/ProductionMenu/ProductionTimerOverlay.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    Object.assign(this, { 
      garageX, garageY, garageWidth, garageHeight, 
      factoryProperties: FactoryTypes, 
      showGrid: false, 
      showUpgradeAll: false 
    });
    
    this.factories = this.createFactories();
    this.ui = new FactoryUI(this);
    
    // Create production timer overlays for each factory
    this.activeConfirmationDialog = null; // Track which factory type has active dialog
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
    // Don't change showGrid based on hover if confirmation dialog is active
    if (this.activeConfirmationDialog) {
      this.showGrid = true; // Keep grid visible when dialog is open
      
      // Still update hover states for the factory with active dialog
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

    // Existing hover logic for when no dialog is active
    Object.values(this.factories).forEach(f => f.isHovered = false);

    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      if (this.isPointInsideFactoryWithPanel(mouseX, mouseY, factory)) { 
        factory.isHovered = true; 
        return true; 
      }
      return false;
    });

    const overUpgradeAll = this.ui?.upgradeAllButton?.isPointInsideWorld?.(mouseX, mouseY) || false;
    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
    
    // Update hover states for factory panels
    Object.entries(this.ui.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factories[type];
      if (factory.isHovered) {
        panel.updateHoverState(mouseX, mouseY);
      }
    });
  }

  // Add method to manage confirmation dialogs
  setConfirmationDialog(factoryType, show) {
    if (show) {
      this.activeConfirmationDialog = factoryType;
      this.showGrid = true; // Force grid visibility
      
      // Ensure the factory is marked as hovered
      const factory = this.factories[factoryType];
      if (factory) {
        factory.isHovered = true;
      }
    } else {
      this.activeConfirmationDialog = null;
      // Reset hover state for the factory
      const factory = this.factories[factoryType];
      if (factory) {
        factory.isHovered = false;
      }
    }
  }

  isPointInsideFactoryWithPanel(mouseX, mouseY, factory) {
    // First check if mouse is inside the actual factory
    if (factory.isPointInside(mouseX, mouseY)) return true;

    // Get manual hover area configuration from factory properties
    const panelConfig = factory.panelConfig || {
      hoverAreaX: -20,
      hoverAreaY: -140,
      hoverAreaWidth: 250,
      hoverAreaHeight: 300 // Increased height to account for production buttons
    };

    // Calculate hover area bounds using manual configuration
    const hoverBounds = {
      x: factory.x + panelConfig.hoverAreaX,
      y: factory.y + panelConfig.hoverAreaY,
      width: panelConfig.hoverAreaWidth,
      height: panelConfig.hoverAreaHeight
    };

    // Check if mouse is inside the manually configured hover area
    return mouseX >= hoverBounds.x && 
           mouseX <= hoverBounds.x + hoverBounds.width && 
           mouseY >= hoverBounds.y && 
           mouseY <= hoverBounds.y + hoverBounds.height;
  }

  // Factory operations
  getFactoryLevel(factoryType) { 
    return this.factories[factoryType]?.level || 0; 
  }
  
  getAllFactoryLevels() { 
    return Object.keys(this.factories).reduce((acc, type) => { 
      acc[type] = this.factories[type].level; 
      return acc; 
    }, {}); 
  }

  setFactoryZIndex(factoryType, zIndex) { 
    this.factories[factoryType]?.setZIndex(zIndex); 
  }
  
  getFactoryZIndex(factoryType) { 
    return this.factories[factoryType]?.zIndex || 7; 
  }
  
  setAllFactoryZIndexes(zIndexMap) { 
    Object.keys(zIndexMap).forEach(type => { 
      if (this.factories[type]) this.setFactoryZIndex(type, zIndexMap[type]); 
    }); 
  }

  // Production system methods
  startFactoryProduction(factoryType, hours) {
    const factory = this.factories[factoryType];
    if (factory) {
      return factory.startProduction(hours);
    }
    return false;
  }

  cancelFactoryProduction(factoryType) {
    const factory = this.factories[factoryType];
    if (factory) {
      factory.cancelProduction();
    }
  }

  isFactoryProducing(factoryType) {
    const factory = this.factories[factoryType];
    return factory ? factory.isProducing : false;
  }

  getFactoryProductionTime(factoryType) {
    const factory = this.factories[factoryType];
    return factory ? factory.getFormattedProductionTime() : "";
  }

  getObjects() { 
    return Object.values(this.factories).flatMap(factory => factory.getObjects()); 
  }

  drawUI(ctx, offsetX, offsetY) { 
    this.ui.drawUI(ctx, offsetX, offsetY);
    
    // Draw production timer overlays - these should always be visible when active
    Object.values(this.productionOverlays).forEach(overlay => {
      overlay.draw(ctx, offsetX, offsetY);
    });

    // Always draw confirmation dialog if active, regardless of hover
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