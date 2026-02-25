import { ExtensionPanel } from "../gameObjects/ExtensionPanel.js";

export class ExtensionManager {
  constructor(baseX, baseY, factoryManager = null) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.factoryManager = factoryManager;
    this.panel = new ExtensionPanel(baseX, baseY);
    this.showGrid = false;
    this.panel.setExtensionManager(this);

    // Upgrade all state — same as UpgradeAllButton
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
    this.upgradeAllTime = 1000; // ms
  }

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;

    switch (clickedBox.index) {
      case 0: console.log("Ext A clicked"); return true;
      case 1: return this.startUpgradeAll();  // ← box 2
      case 2: console.log("Ext C clicked"); return true;
      case 3: console.log("Ext D clicked"); return true;
    }
    return false;
  }

  startUpgradeAll() {
    if (this.upgradingAll) return false;

    const canUpgradeAny = Object.values(this.factoryManager?.factories || {})
      .some(factory => !factory.isMaxLevel());

    if (!canUpgradeAny) return false;

    this.upgradingAll = true;
    this.upgradeAllTimer = 0;
    console.log("Upgrade all started...");
    return true;
  }

  completeUpgradeAll(objectUpdater, objects) {
    Object.values(this.factoryManager?.factories || {}).forEach(factory => {
      factory.setLevel(factory.maxLevel);
    });
    objectUpdater?.updateFactoryObjects?.(objects);
    this.upgradingAll = false;
    this.upgradeAllTimer = 0;
    console.log("All factories upgraded to max level");
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
    // no timer update here — done in CompositeBase
  }
}