// BaseInputHandler.js 
export class BaseInputHandler {
  constructor(factoryManager, garageUI,) {
    this.factoryManager = factoryManager;
    this.garageUI = garageUI;
  }

 handleMouseMove(mouseX, mouseY) {
  this.factoryManager.handleMouseMove(mouseX, mouseY);
  
  // Updated method call for unified GarageUI
  this.garageUI.handleMouseMove(mouseX, mouseY);
  // Optional: you can use showPanel if needed for other logic
}

  // To this:
handleClick(mouseX, mouseY) {
  return this.garageUI.handleClick(mouseX, mouseY) || this.factoryManager.handleClick(mouseX, mouseY);
}
// (handleClick stays the same)
}