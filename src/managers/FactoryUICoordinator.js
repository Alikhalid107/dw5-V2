import { IndividualFactoryPanel } from "../ui/FactoryPanel/IndividualFactoryPanel.js";
// ← UpgradeAllButton import removed

export class FactoryUICoordinator {
  constructor(factoryManager) {
    this.factoryManager = factoryManager;
    this.factoryPanels = this.createFactoryPanels();
    // ← upgradeAllButton removed
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

  // ← createUpgradeAllButton removed

  drawUI(ctx, offsetX, offsetY) {
    if (!this.factoryManager.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    // Draw visible factory panels only
    Object.entries(this.factoryPanels).forEach(([type, panel]) => {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered || this.factoryManager.activeConfirmationDialog === type) {
        panel.draw(ctx, offsetX, offsetY, factory);
      }
    });

    // ← upgradeAllButton draw removed
  }

  update(deltaTime) {
    // ← upgradeAllButton update removed
  }

  handleClick(mouseX, mouseY) {
    for (const [type, panel] of Object.entries(this.factoryPanels)) {
      const factory = this.factoryManager.factories[type];
      if (factory.isHovered || this.factoryManager.activeConfirmationDialog === type) {
        if (panel.handleClick(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY, factory, this.factoryManager)) {
          return true;
        }
      }
    }
    // ← upgradeAllButton click removed
    return false;
  }
}