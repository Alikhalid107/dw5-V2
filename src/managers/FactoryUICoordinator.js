import { IndividualFactoryPanel } from "../ui/FactoryPanel/IndividualFactoryPanel.js";
import { UpgradeAllButton } from "../ui/UpgradeAllButton.js";

export class FactoryUICoordinator {
  constructor(factoryManager) {
    this.factoryManager = factoryManager;
    this.factoryPanels = this.createFactoryPanels();
    this.upgradeAllButton = this.createUpgradeAllButton();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
  }

  createFactoryPanels() {
    return Object.fromEntries(
      Object.entries(this.factoryManager.factories).map(([type, factory]) =>
        [type, new IndividualFactoryPanel(factory, type)]
      )
    );
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

    // Draw factory panels
    Object.entries(this.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered || this.factoryManager.activeConfirmationDialog === type) {
        panel.draw(ctx, offsetX, offsetY, factory);
      }
    });

    // Draw upgrade all button
    if (this.factoryManager.showUpgradeAll) {
      this.upgradeAllButton.draw(ctx, offsetX, offsetY);
    }
  }

  update(deltaTime) {
    if (this.upgradeAllButton.update(deltaTime)) {
      this.completeUpgradeAll();
    }
  }

  completeUpgradeAll() {
    this.upgradeAllButton.completeUpgrade();
    Object.values(this.factoryManager.factories).forEach(factory => {
      if (!factory.isMaxLevel()) {
        factory.level = factory.maxLevel;
        factory.updateVisuals();
      }
    });
  }

  handleClick(mouseX, mouseY) {
    // Handle factory panel clicks
    for (const [type, panel] of Object.entries(this.factoryPanels)) {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered || this.factoryManager.activeConfirmationDialog === type) {
        const clickResult = panel.handleClick(
          mouseX, mouseY, 
          this.currentOffsetX, this.currentOffsetY,
          factory, this.factoryManager
        );
        if (clickResult) return true;
      }
    }

    // Handle upgrade all button
    if (this.factoryManager.showUpgradeAll && 
        this.upgradeAllButton.isPointInside(mouseX, mouseY, 0, 0)) {
      return this.upgradeAllButton.startUpgrade();
    }

    return false;
  }
}