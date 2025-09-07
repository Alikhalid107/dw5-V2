export class InputHandler {
  setManagers(factoryManager, garageUI) {
    this.factoryManager = factoryManager;
    this.garageUI = garageUI;
  }

  handleMouseMove(mouseX, mouseY) {
    this.factoryManager?.handleMouseMove?.(mouseX, mouseY);
    this.garageUI?.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    if (this.factoryManager?.handleClick?.(mouseX, mouseY)) return true;
    return this.garageUI?.handleClick(mouseX, mouseY) || false;
  }
}