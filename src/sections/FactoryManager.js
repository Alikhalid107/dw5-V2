import { Factory } from "./Factory/Factory.js";
import { FactoryUI } from "./Factory/FactoryUI.js";
import { FactoryTypes } from "./Factory/FactoryTypes.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight, options = {}) {
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    
    // Factory types configuration
    this.factoryProperties = FactoryTypes;
    
    // UI State
    this.showGrid = false;
    this.hoveredFactory = null;
    
    // Create factories
    this.factories = this.createFactories();
    
    // Create UI manager
    this.ui = new FactoryUI(this);
    
    // Get all objects
    this.objects = this.getAllObjects();
  }
  
  createFactories() {
    const factories = {};
    
    Object.keys(this.factoryProperties).forEach(type => {
      factories[type] = new Factory(
        type,
        this.factoryProperties[type],
        this.garageX,
        this.garageY
      );
    });
    
    return factories;
  }
  
  getAllObjects() {
    return Object.values(this.factories).flatMap(factory => factory.getObjects());
  }
  
  update(deltaTime) {
    // Update factory upgrades
    Object.values(this.factories).forEach(factory => {
      if (factory.update(deltaTime)) {
        const newLevel = this.completeUpgrade(factory.type);
        console.log(`${factory.type} upgraded to level ${newLevel}`);
      }
    });
    
    // Update UI (for upgrade all timer)
    this.ui?.update?.(deltaTime);
  }
  
  // Handle mouse hover over garage area
  handleMouseMove(mouseX, mouseY) {
    const isOverGarage = (
      mouseX >= this.garageX &&
      mouseX <= this.garageX + this.garageWidth &&
      mouseY >= this.garageY &&
      mouseY <= this.garageY + this.garageHeight
    );
    
    this.showGrid = isOverGarage;
    
    // Check which factory is being hovered
    this.hoveredFactory = null;
    if (isOverGarage) {
      for (const factory of Object.values(this.factories)) {
        if (factory.isPointInside(mouseX, mouseY)) {
          this.hoveredFactory = factory.type;
          break;
        }
      }
    }
  }
  
  // Start factory upgrade
  startUpgrade(factoryType) {
    return this.factories[factoryType].startUpgrade();
  }
  
  // Complete factory upgrade
  completeUpgrade(factoryType) {
    return this.factories[factoryType].completeUpgrade();
  }
  
  // Draw upgrade grid and UI
  drawUI(ctx, offsetX, offsetY) {
    this.ui.drawUI(ctx, offsetX, offsetY);
  }
  
  // Handle clicks on factory buttons
  handleClick(mouseX, mouseY) {
    return this.ui.handleClick(mouseX, mouseY);
  }
  
  getObjects() {
    return this.objects;
  }
  
  // Get factory level
  getFactoryLevel(factoryType) {
    return this.factories[factoryType]?.level || 0;
  }
  
  // Get all factory levels
  getAllFactoryLevels() {
    const levels = {};
    Object.keys(this.factories).forEach(type => {
      levels[type] = this.factories[type].level;
    });
    return levels;
  }
  
  // Check if factory is currently upgrading
  isFactoryUpgrading(factoryType) {
    return this.factories[factoryType]?.upgrading || false;
  }
  
  // Simplified - factories always exist in this context
  getRemainingUpgradeTime(factoryType) {
    return this.factories[factoryType].getRemainingUpgradeTime();
  }
  
  // Simplified - factories always exist in this context
  getUpgradeProgress(factoryType) {
    return this.factories[factoryType].getUpgradeProgress();
  }
  
  // Method to update factory zIndex during runtime
  setFactoryZIndex(factoryType, zIndex) {
    if (this.factories[factoryType]) {
      this.factories[factoryType].setZIndex(zIndex);
      // Refresh objects array to reflect zIndex changes
      this.objects = this.getAllObjects();
    }
  }
  
  // Method to get factory zIndex
  getFactoryZIndex(factoryType) {
    return this.factories[factoryType]?.zIndex || 7;
  }
  
  // Method to set all factory zIndexes at once
  setAllFactoryZIndexes(zIndexMap) {
    Object.keys(zIndexMap).forEach(factoryType => {
      if (this.factories[factoryType]) {
        this.setFactoryZIndex(factoryType, zIndexMap[factoryType]);
      }
    });
  }
}