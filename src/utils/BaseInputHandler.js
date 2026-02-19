// BaseInputHandler.js 
export class BaseInputHandler {
  constructor(factoryManager, garageUI,) {
    this.factoryManager = factoryManager;
    this.garageUI = garageUI;
  }

handleMouseMove(mouseX, mouseY) {
  this.factoryManager.handleMouseMove(mouseX, mouseY);
  this.garageUI.handleMouseMove(mouseX, mouseY);
  this.towerManager?.handleMouseMove(mouseX, mouseY);  // ← add
}

handleClick(mouseX, mouseY) {
  return this.garageUI.handleClick(mouseX, mouseY) ||
         this.factoryManager.handleClick(mouseX, mouseY) ||
         this.towerManager?.handleClick(mouseX, mouseY);  // ← add
}
// (handleClick stays the same)
}