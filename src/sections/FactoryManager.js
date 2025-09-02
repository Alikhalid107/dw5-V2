import { Factory } from "./Factory/Factory.js";
import { FactoryUI } from "./Factory/FactoryUI.js";
import { FactoryTypes } from "./Factory/FactoryTypes.js";

export class FactoryManager {
  constructor(garageX, garageY, garageWidth, garageHeight, options = {}) {
    Object.assign(this, { garageX, garageY, garageWidth, garageHeight, factoryProperties: FactoryTypes, showGrid: false, showUpgradeAll: false, hoveredFactory: null });
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
    Object.values(this.factories).forEach(factory => {
      if (factory.update(deltaTime)) factory.completeUpgrade();
    });
    this.ui?.update?.(deltaTime);
  }

  handleMouseMove(mouseX, mouseY) {
    Object.values(this.factories).forEach(f => f.isHovered = false);

    const anyFactoryHovered = Object.values(this.factories).some(factory => {
      if (this.isPointInsideFactoryWithPanel(mouseX, mouseY, factory)) { factory.isHovered = true; return true; }
      return false;
    });

    const overUpgradeAll = this.ui?.upgradeAllButton?.isPointInsideWorld?.(mouseX, mouseY) || false;
    this.showGrid = anyFactoryHovered || overUpgradeAll;
    this.showUpgradeAll = overUpgradeAll;
  }

  isPointInsideFactoryWithPanel(mouseX, mouseY, factory) {
    if (factory.isPointInside(mouseX, mouseY)) return true;

    const panelWidth = 200, panelHeight = 120, gap = 6, buffer = 6;
    const panelX = factory.x + (factory.width / 2) - (panelWidth / 2);
    const panelY = factory.y - panelHeight - gap;

    const bounds = {
      x: Math.min(panelX, factory.x) - buffer,
      y: panelY - buffer,
      width: Math.max(panelWidth, factory.width) + buffer * 2,
      height: panelHeight + buffer * 2
    };

    return mouseX >= bounds.x && mouseX <= bounds.x + bounds.width && mouseY >= bounds.y && mouseY <= bounds.y + bounds.height;
  }

  // factory operations
  startUpgrade(factoryType) { return this.factories[factoryType]?.startUpgrade() || false; }
  completeUpgrade(factoryType) { return this.factories[factoryType]?.completeUpgrade() || 0; }
  getFactoryLevel(factoryType) { return this.factories[factoryType]?.level || 0; }
  getAllFactoryLevels() { return Object.keys(this.factories).reduce((acc, type) => { acc[type] = this.factories[type].level; return acc; }, {}); }
  isFactoryUpgrading(factoryType) { return this.factories[factoryType]?.upgrading || false; }
  getRemainingUpgradeTime(factoryType) { return this.factories[factoryType]?.getRemainingUpgradeTime() || 0; }
  getUpgradeProgress(factoryType) { return this.factories[factoryType]?.getUpgradeProgress() || 0; }

  setFactoryZIndex(factoryType, zIndex) { this.factories[factoryType]?.setZIndex(zIndex); }
  getFactoryZIndex(factoryType) { return this.factories[factoryType]?.zIndex || 7; }
  setAllFactoryZIndexes(zIndexMap) { Object.keys(zIndexMap).forEach(type => { if (this.factories[type]) this.setFactoryZIndex(type, zIndexMap[type]); }); }

  getObjects() { return Object.values(this.factories).flatMap(factory => factory.getObjects()); }

  drawUI(ctx, offsetX, offsetY) { this.ui.drawUI(ctx, offsetX, offsetY); }
  handleClick(mouseX, mouseY) { return this.ui.handleClick(mouseX, mouseY); }
}
