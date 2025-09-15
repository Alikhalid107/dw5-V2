export class UniversalBoxState {
  constructor(config) {
    this.width = config.DIMENSIONS?.width || config.boxWidth || 50;
    this.height = config.DIMENSIONS?.height || config.boxHeight || 50;
    this.bounds = null;
    this.isHovered = false;
  }

  setBounds(x, y) {
    this.bounds = { x, y, width: this.width, height: this.height };
  }

  isPointInside(mouseX, mouseY) {
    return this.bounds && mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
           mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;
  }

  updateHoverState(mouseX, mouseY) {
    const wasHovered = this.isHovered;
    this.isHovered = this.isPointInside(mouseX, mouseY);
    return wasHovered !== this.isHovered;
  }
}
