import { Factory } from "./Factory/Factory.js";
import { FactoryUI } from "./Factory/FactoryUI.js";
import { FactoryTypes } from "./Factory/FactoryTypes.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight, options = {}) {
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
  }

  createFactories() {
    return Object.keys(this.factoryProperties).reduce((acc, type) => {
      acc[type] = new Factory(type, this.factoryProperties[type], this.garageX, this.garageY);
      return acc;
    }, {});
  }

  getAllObjects() {
    return Object.values(this.factories).flatMap(f => f.getObjects());
  }

  update(deltaTime) {
    Object.values(this.factories).forEach(factory => {
      if (factory.update(deltaTime)) {
        const newLevel = this.completeUpgrade(factory.type);
        console.log(`${factory.type} upgraded to level ${newLevel}`);
      }
    });
    this.ui?.update?.(deltaTime);
  }

  // Hover detection that includes panel area
  handleMouseMove(mouseX, mouseY) {
    // reset
    Object.values(this.factories).forEach(f => (f.isHovered = false));

    // any factory hovered?
    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      if (this.isPointInsideFactoryWithPanel(mouseX, mouseY, factory)) {
        factory.isHovered = true;
        return true;
      }
      return false;
    });

    const overUpgradeAll = !!(this.ui?.upgradeAllButton?.isPointInsideWorld
      ? this.ui.upgradeAllButton.isPointInsideWorld(mouseX, mouseY)
      : false);

    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
  }

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
      return acc;
    }, {});
  }

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
