export class ProductionButton {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.label = config.label;
    this.hours = config.hours;
    this.bounds = null;
    this.hovered = false;
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
