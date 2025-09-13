import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";
export class UpgradeButtonController {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
  }

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
