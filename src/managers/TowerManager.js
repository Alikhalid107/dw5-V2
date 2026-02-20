import { TowerPanel } from "../gameObjects/TowerPanel.js";

export class TowerManager {
  constructor(baseX, baseY) {  // ← receive base coords
    this.baseX = baseX;
    this.baseY = baseY;
    this.panel = new TowerPanel(baseX, baseY);  // ← pass down
    this.showGrid = false;
  }

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;
    console.log(`Tower box ${clickedBox.index} clicked — "${clickedBox.label}"`);
    // You'll add building placement logic here later
    return true;
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
  if (this.panel.isVisible) {
    this.panel.components.update(deltaTime);
  }
}
}