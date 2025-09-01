import { IndividualFactoryPanel } from "./FactoryMenu/IndividualFactoryPanel.js";
import { UpgradeAllButton } from "./FactoryMenu/UpgradeAllButton.js";
import { UpgradeTimer } from "./FactoryMenu/UpgradeTimer.js";

export class FactoryUI {
  constructor(factoryManager, flakManager = null) {
    this.factoryManager = factoryManager;
    this.flakManager = flakManager;

    this.factoryPanels = this.createFactoryPanels();
    this.upgradeTimers = this.createUpgradeTimers();
    this.upgradeAllButton = this.createUpgradeAllButton();

    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
  }

  createFactoryPanels() {
    return Object.fromEntries(
      Object.entries(this.factoryManager.factories).map(([type, factory]) => [type, new IndividualFactoryPanel(factory, type)])
    );
  }

  createUpgradeTimers() {
    return Object.values(this.factoryManager.factories).map(f => new UpgradeTimer(f));
  }

  createUpgradeAllButton() {
    const offsetX = -280, offsetY = 100;
    const buttonX = this.factoryManager.garageX + this.factoryManager.garageWidth / 2 + offsetX;
    const buttonY = this.factoryManager.garageY + offsetY;
    return new UpgradeAllButton(this.factoryManager, buttonX, buttonY);
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.factoryManager.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    // overlay intentionally not always drawn
    // this.drawGridOverlay(ctx, offsetX, offsetY);

    Object.entries(this.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered) panel.draw(ctx, offsetX, offsetY, factory);
    });

    this.drawUpgradeTimers(ctx, offsetX, offsetY);

    if (this.factoryManager.showUpgradeAll) this.drawUpgradeAllButton(ctx, offsetX, offsetY);
  }

  drawGridOverlay(ctx, offsetX, offsetY) {
    ctx.fillStyle = "rgba(145, 163, 174,0)";
    ctx.fillRect(this.factoryManager.garageX - offsetX, this.factoryManager.garageY - offsetY, this.factoryManager.garageWidth, this.factoryManager.garageHeight);
  }

  drawUpgradeTimers(ctx, offsetX, offsetY) { this.upgradeTimers.forEach(t => t.draw(ctx, offsetX, offsetY)); }
  drawUpgradeAllButton(ctx, offsetX, offsetY) { this.upgradeAllButton.draw(ctx, offsetX, offsetY); }

  update(deltaTime) {
    if (this.upgradeAllButton.update(deltaTime)) this.completeUpgradeAll();
  }

  startUpgradeAll() { return this.upgradeAllButton.startUpgrade(); }

  completeUpgradeAll() {
    this.upgradeAllButton.completeUpgrade();
    Object.values(this.factoryManager.factories).forEach(factory => {
      if (factory.upgrading) {
        factory.upgrading = false;
        factory.upgradeTimer = 0;
      }
      if (!factory.isMaxLevel()) {
        factory.level = factory.maxLevel;
        factory.updateVisuals();
        console.log(`${factory.type} factory upgraded to max level ${factory.maxLevel}`);
      }
    });
  }

  handleClick(mouseX, mouseY) {
    for (const [type, panel] of Object.entries(this.factoryPanels)) {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered && panel.handleClick(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY)) {
        console.log(`Attempting to upgrade ${type} factory`);
        return this.factoryManager.startUpgrade(type);
      }
    }

    if (this.factoryManager.showUpgradeAll && this.upgradeAllButton.isPointInside(mouseX, mouseY, 0, 0)) {
      return this.startUpgradeAll();
    }

    return false;
  }
}
