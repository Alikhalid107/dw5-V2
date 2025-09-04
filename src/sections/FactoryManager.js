import { Factory } from "./Factory/Factory.js";
import { FactoryUI } from "./Factory/FactoryUI.js";
import { FactoryTypes } from "./Factory/FactoryTypes.js";

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
  }

  createFactories() {
    return Object.keys(this.factoryProperties).reduce((acc, type) => {
      acc[type] = new Factory(type, this.factoryProperties[type], this.garageX, this.garageY);
      return acc;
    }, {});
  }

  update(deltaTime) {
    Object.values(this.factories).forEach(factory => factory.update(deltaTime));
    this.ui?.update?.(deltaTime);
  }

  handleMouseMove(mouseX, mouseY) {
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
  }

  isPointInsideFactoryWithPanel(mouseX, mouseY, factory) {
    // First check if mouse is inside the actual factory
    if (factory.isPointInside(mouseX, mouseY)) return true;

    // Get manual hover area configuration from factory properties
    const panelConfig = factory.panelConfig || {
      hoverAreaX: -20,
      hoverAreaY: -140,
      hoverAreaWidth: 250,
      hoverAreaHeight: 260
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

  getObjects() { 
    return Object.values(this.factories).flatMap(factory => factory.getObjects()); 
  }

  drawUI(ctx, offsetX, offsetY) { 
    this.ui.drawUI(ctx, offsetX, offsetY); 
  }
  
  handleClick(mouseX, mouseY) { 
    return this.ui.handleClick(mouseX, mouseY); 
  }
}