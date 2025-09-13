import { PRODUCTION_BUTTONS_CONFIG } from "../../../config/ProductionButtonConfig";

export class ProductionButton {
  constructor(buttonConfig, globalConfig = PRODUCTION_BUTTONS_CONFIG) {


    this.width = buttonConfig.width;
    this.height = buttonConfig.height;
    this.label = buttonConfig.label;
    this.hours = buttonConfig.hours;
    this.bounds = null;
    this.hovered = false;
    this.config = globalConfig;
  }

  setBounds(x, y) {
    this.bounds = { x, y, width: this.width, height: this.height };
  }

  isPointInside(mouseX, mouseY) {
    if (!this.bounds) return false;
    return mouseX >= this.bounds.x && 
           mouseX <= this.bounds.x + this.bounds.width &&
           mouseY >= this.bounds.y && 
           mouseY <= this.bounds.y + this.bounds.height;
  }

  setHovered(isHovered) {
    this.hovered = isHovered;
  }
}
