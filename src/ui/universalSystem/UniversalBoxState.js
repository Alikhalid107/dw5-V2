export class UniversalBoxState {
  constructor(config) {
    this.width = config.DIMENSIONS?.width || config.boxWidth || config.width || 50;
    this.height = config.DIMENSIONS?.height || config.boxHeight || config.height || 50;
    this.bounds = null;
    this.isHovered = false;
    this.config = config;
  }

  setBounds(x, y, width = this.width, height = this.height) {
    this.bounds = { x, y, width, height };
  }

  isPointInside(mouseX, mouseY) {
    if (!this.bounds) return false;
    return mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
           mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;
  }

  updateHoverState(mouseX, mouseY) {
    const wasHovered = this.isHovered;
    this.isHovered = this.isPointInside(mouseX, mouseY);
    return wasHovered !== this.isHovered;
  }

  getCenter() {
    return this.bounds ? {
      x: this.bounds.x + this.bounds.width / 2,
      y: this.bounds.y + this.bounds.height / 2
    } : null;
  }

  isValid() {
    return this.bounds && isFinite(this.bounds.x) && isFinite(this.bounds.y) && 
           this.bounds.width > 0 && this.bounds.height > 0;
  }

  getBoundsWithOffset(offsetX = 0, offsetY = 0) {
    return this.bounds ? {
      x: this.bounds.x + offsetX,
      y: this.bounds.y + offsetY,
      width: this.bounds.width,
      height: this.bounds.height
    } : null;
  }

  isPointInsideWithOffset(mouseX, mouseY, offsetX = 0, offsetY = 0) {
    const offsetBounds = this.getBoundsWithOffset(offsetX, offsetY);
    return offsetBounds ? 
      mouseX >= offsetBounds.x && mouseX <= offsetBounds.x + offsetBounds.width &&
      mouseY >= offsetBounds.y && mouseY <= offsetBounds.y + offsetBounds.height : false;
  }

  get x() { return this.bounds?.x || 0; }
  get y() { return this.bounds?.y || 0; }
  get boxWidth() { return this.width; }
  get boxHeight() { return this.height; }

  toString() {
    return `UniversalBoxState(bounds: ${JSON.stringify(this.bounds)}, hovered: ${this.isHovered}, size: ${this.width}x${this.height})`;
  }
}