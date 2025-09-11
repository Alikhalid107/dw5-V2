// UpgradeButtonController.js - Handles interaction logic
export class UpgradeButtonController {
  canUpgrade(factory) {
    return !factory.upgrading && !factory.isMaxLevel();
  }

  handleClick(mouseX, mouseY, state, factory) {
    if (!state.isPointInside(mouseX, mouseY)) return false;
    return this.canUpgrade(factory);
  }

  updateHoverState(mouseX, mouseY, state) {
    state.setHovered(state.isPointInside(mouseX, mouseY));
  }
}