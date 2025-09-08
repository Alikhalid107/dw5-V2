export class BaseInputHandler {
  constructor(factoryManager, garageUI) {
    this.factoryManager = factoryManager;
    this.garageUI = garageUI;
  }

  handleMouseMove(mouseX, mouseY) {
    this.factoryManager?.handleMouseMove?.(mouseX, mouseY);
    this.garageUI?.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    // Factory manager gets first priority for clicks
    if (this.factoryManager?.handleClick?.(mouseX, mouseY)) {
      return true;
    }
    
    // Garage UI handles remaining clicks
    return this.garageUI?.handleClick(mouseX, mouseY) || false;
  }
}