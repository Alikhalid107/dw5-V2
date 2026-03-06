import { ExtensionPanel } from "../ui/ExtensionPanel/ExtensionPanel.js";
import { ExtensionBuilding } from "../gameObjects/ExtensionBuilding.js";

export class ExtensionManager {
  constructor(baseX, baseY, garageX, garageY, factoryManager = null) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.garageX = garageX;
    this.garageY = garageY;
    this.factoryManager = factoryManager;
    this.panel = new ExtensionPanel(baseX, baseY);
    this.showGrid = false;
    this.panel.setExtensionManager(this);

    // Buildings
    this.ministryBuilding = null;
    this.officeBuilding = null;
    this.groupBuilding = null;

    // Upgrade all state
    this.upgradingAll = false;
    this.upgradeAllUsed = false;

    this.upgradeAllTimer = 0;
    this.upgradeAllTime = 1000;
  }

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;

    switch (clickedBox.index) {
      case 0: return this.handleMinistryClick();
      case 1: return this.startUpgradeAll();
      case 2: return this.handleOfficeClick();
      case 3: return this.handleGroupClick();
    }
    return false;
  }

  handleMinistryClick() {
    if (!this.ministryBuilding) {
      this.ministryBuilding = new ExtensionBuilding(this.garageX, this.garageY, "ministry");
      return true;
    }
    if (this.ministryBuilding.isMaxLevel()) return false;
    this.ministryBuilding.upgrade();
    return true;
  }

  handleOfficeClick() {
    if (!this.officeBuilding) {
      this.officeBuilding = new ExtensionBuilding(this.garageX, this.garageY, "militaryOffice");
      return true;
    }
    if (this.officeBuilding.isMaxLevel()) return false;
    this.officeBuilding.upgrade();
    return true;
  }

  handleGroupClick() {
    if (!this.groupBuilding) {
      this.groupBuilding = new ExtensionBuilding(this.garageX, this.garageY, "groupLimit");
      return true;
    }
    if (this.groupBuilding.isMaxLevel()) return false;
    this.groupBuilding.upgrade();
    return true;
  }

  startUpgradeAll() {
    if (this.upgradingAll) return false;
    const canUpgradeAny = Object.values(this.factoryManager?.factories || {})
      .some(factory => !factory.isMaxLevel());
    if (!canUpgradeAny) return false;
    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    return true;
  }

// completeUpgradeAll
  completeUpgradeAll(objectUpdater, objects) {
  Object.values(this.factoryManager?.factories || {}).forEach(factory => {
    factory.setLevel(factory.maxLevel);
  });
  objectUpdater?.updateFactoryObjects?.(objects);
  this.upgradingAll = false;
  this.upgradeAllTimer = 0;
  this.upgradeAllUsed = true;  // ← add
}

  getObjects() {
    const objects = [];
    if (this.ministryBuilding) objects.push(...this.ministryBuilding.getObjects());
    if (this.officeBuilding) objects.push(...this.officeBuilding.getObjects());
    if (this.groupBuilding) objects.push(...this.groupBuilding.getObjects());
    return objects;
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
  }
}