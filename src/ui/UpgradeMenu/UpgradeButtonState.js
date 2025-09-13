import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";
export class UpgradeButtonState {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
    this.width = config.DIMENSIONS.width;
    this.height = config.DIMENSIONS.height;
    this.bounds = null;
    this.isHovered = false;
  }

  setBounds(x, y) {
    this.bounds = { 
      x, 
      y, 
      width: this.width, 
      height: this.height 
    };
  }

  setHovered(isHovered) {
    this.isHovered = isHovered;
  }

  isPointInside(mouseX, mouseY) {
    if (!this.bounds) return false;
    return mouseX >= this.bounds.x && 
           mouseX <= this.bounds.x + this.bounds.width &&
           mouseY >= this.bounds.y && 
           mouseY <= this.bounds.y + this.bounds.height;
  }
}