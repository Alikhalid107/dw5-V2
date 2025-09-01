import { Factory } from "./Factory/Factory.js";
import { FactoryUI } from "./Factory/FactoryUI.js";
import { FactoryTypes } from "./Factory/FactoryTypes.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight, options = {}) {
<<<<<<< HEAD
    Object.assign(this, {
      garageX, garageY, garageWidth, garageHeight,
      factoryProperties: FactoryTypes,
      showGrid: false,
      showUpgradeAll: false,
      hoveredFactory: null
    });

    this.factories = this.createFactories();
    this.ui = new FactoryUI(this);
=======
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;

    this.factoryProperties = FactoryTypes;

    // UI state
    this.showGrid = false;
    this.showUpgradeAll = false;
    this.hoveredFactory = null;

    this.factories = this.createFactories();
    this.ui = new FactoryUI(this);
    this.objects = this.getAllObjects();
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
  }

  createFactories() {
    return Object.keys(this.factoryProperties).reduce((acc, type) => {
      acc[type] = new Factory(type, this.factoryProperties[type], this.garageX, this.garageY);
      return acc;
    }, {});
  }

<<<<<<< HEAD
  update(deltaTime) {
    Object.values(this.factories).forEach(factory => {
      if (factory.update(deltaTime)) {
        factory.completeUpgrade();
=======
  getAllObjects() {
    return Object.values(this.factories).flatMap(f => f.getObjects());
  }

  update(deltaTime) {
    Object.values(this.factories).forEach(factory => {
      if (factory.update(deltaTime)) {
        const newLevel = this.completeUpgrade(factory.type);
        console.log(`${factory.type} upgraded to level ${newLevel}`);
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
      }
    });
    this.ui?.update?.(deltaTime);
  }

<<<<<<< HEAD
  handleMouseMove(mouseX, mouseY) {
    // Reset hover states
    Object.values(this.factories).forEach(f => f.isHovered = false);

    // Check factory hover
=======
  // Hover detection that includes panel area
  handleMouseMove(mouseX, mouseY) {
    // reset
    Object.values(this.factories).forEach(f => (f.isHovered = false));

    // any factory hovered?
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      if (this.isPointInsideFactoryWithPanel(mouseX, mouseY, factory)) {
        factory.isHovered = true;
        return true;
      }
      return false;
    });

<<<<<<< HEAD
    // Check upgrade all button hover
    const overUpgradeAll = this.ui?.upgradeAllButton?.isPointInsideWorld?.(mouseX, mouseY) || false;
=======
    const overUpgradeAll = !!(this.ui?.upgradeAllButton?.isPointInsideWorld
      ? this.ui.upgradeAllButton.isPointInsideWorld(mouseX, mouseY)
      : false);
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93

    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
  }

<<<<<<< HEAD
  isPointInsideFactoryWithPanel(mouseX, mouseY, factory) {
    // Direct factory hit
    if (factory.isPointInside(mouseX, mouseY)) return true;

    // Panel hover zone
    const panelWidth = 200;
    const panelHeight = 120;
    const gap = 6;
    const buffer = 6;

    // Panel position (centered above factory)
    const panelX = factory.x + (factory.width / 2) - (panelWidth / 2);
    const panelY = factory.y - panelHeight - gap;

    // Expanded bounds including panel
    const bounds = {
      x: Math.min(panelX, factory.x) - buffer,
      y: panelY - buffer,
      width: Math.max(panelWidth, factory.width) + buffer * 2,
      height: panelHeight + buffer * 2
    };

    return mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
           mouseY >= bounds.y && mouseY <= bounds.y + bounds.height;
  }

  // Factory operations
  startUpgrade(factoryType) {
    return this.factories[factoryType]?.startUpgrade() || false;
  }

  completeUpgrade(factoryType) {
    return this.factories[factoryType]?.completeUpgrade() || 0;
  }

  getFactoryLevel(factoryType) {
    return this.factories[factoryType]?.level || 0;
  }

  getAllFactoryLevels() {
    return Object.keys(this.factories).reduce((acc, type) => {
      acc[type] = this.factories[type].level;
=======
 // NEW tighter hover zone (replace existing isPointInsideFactoryWithPanel)
// Replace existing method with this tighter, factory-aware hover zone
isPointInsideFactoryWithPanel(mouseX, mouseY, factory) {
  // If the pointer is inside the factory sprite itself, it's inside.
  if (factory.isPointInside(mouseX, mouseY)) return true;

  // Panel size (matches IndividualFactoryPanel)
  const panelWidth = 200;
  const panelHeight = 120;

  // Tunable gaps/buffers (tight by default)
  const panelGap = 6;      // gap between factory top and panel bottom (was larger before)
  const topBuffer = 6;     // extra space above the panel
  const bottomBuffer = 6;  // how far below the factory the hover area reaches (small)
  const horizBuffer = 6;   // small left/right buffer

  // Panel world position (centered above factory)
  const panelX = factory.x + (factory.factoryWidth / 2) - (panelWidth / 2);
  const panelY = factory.y - panelHeight - panelGap;

  // Expanded bounding box that includes the panel and the factory, tightly buffered
  const expandedX = Math.min(panelX, factory.x) - horizBuffer;
  const expandedY = panelY - topBuffer;
  const expandedWidth = Math.max(panelWidth, factory.factoryWidth) + horizBuffer * 2;

  // Limit vertical reach so hover zone doesn't go extremely far below the factory:
  // from top of panel down to factory bottom + bottomBuffer
  // Hover zone: just the panel itself + small buffers
const expandedHeight = panelHeight + topBuffer + bottomBuffer;


  return (
    mouseX >= expandedX &&
    mouseX <= expandedX + expandedWidth &&
    mouseY >= expandedY &&
    mouseY <= expandedY + expandedHeight
  );
}



  startUpgrade(factoryType) { return this.factories[factoryType].startUpgrade(); }
  completeUpgrade(factoryType) { return this.factories[factoryType].completeUpgrade(); }

  drawUI(ctx, offsetX, offsetY) { this.ui.drawUI(ctx, offsetX, offsetY); }
  handleClick(mouseX, mouseY) { return this.ui.handleClick(mouseX, mouseY); }

  getObjects() { return this.objects; }
  getFactoryLevel(factoryType) { return this.factories[factoryType]?.level || 0; }

  getAllFactoryLevels() {
    return Object.keys(this.factories).reduce((acc, t) => {
      acc[t] = this.factories[t].level;
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
      return acc;
    }, {});
  }

<<<<<<< HEAD
  isFactoryUpgrading(factoryType) {
    return this.factories[factoryType]?.upgrading || false;
  }

  getRemainingUpgradeTime(factoryType) {
    return this.factories[factoryType]?.getRemainingUpgradeTime() || 0;
  }

  getUpgradeProgress(factoryType) {
    return this.factories[factoryType]?.getUpgradeProgress() || 0;
  }

  // Z-index management
  setFactoryZIndex(factoryType, zIndex) {
    this.factories[factoryType]?.setZIndex(zIndex);
  }

  getFactoryZIndex(factoryType) {
    return this.factories[factoryType]?.zIndex || 7;
  }

  setAllFactoryZIndexes(zIndexMap) {
    Object.keys(zIndexMap).forEach(type => {
      if (this.factories[type]) {
        this.setFactoryZIndex(type, zIndexMap[type]);
      }
    });
  }

  // Object management
  getObjects() {
    return Object.values(this.factories).flatMap(factory => factory.getObjects());
  }

  // UI delegation
  drawUI(ctx, offsetX, offsetY) {
    this.ui.drawUI(ctx, offsetX, offsetY);
  }

  handleClick(mouseX, mouseY) {
    return this.ui.handleClick(mouseX, mouseY);
  }
}
=======
  isFactoryUpgrading(factoryType) { return this.factories[factoryType]?.upgrading || false; }
  getRemainingUpgradeTime(factoryType) { return this.factories[factoryType].getRemainingUpgradeTime(); }
  getUpgradeProgress(factoryType) { return this.factories[factoryType].getUpgradeProgress(); }

  setFactoryZIndex(factoryType, zIndex) {
    if (!this.factories[factoryType]) return;
    this.factories[factoryType].setZIndex(zIndex);
    this.objects = this.getAllObjects();
  }
  getFactoryZIndex(factoryType) { return this.factories[factoryType]?.zIndex || 7; }
  setAllFactoryZIndexes(zIndexMap) {
    Object.keys(zIndexMap).forEach(t => { if (this.factories[t]) this.setFactoryZIndex(t, zIndexMap[t]); });
  }
}
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
