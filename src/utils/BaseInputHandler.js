// BaseInputHandler.js - Updated to handle RadarUI
export class BaseInputHandler {
  constructor(factoryManager, garageUI, radarUI = null) {
    this.factoryManager = factoryManager;
    this.garageUI = garageUI;
    this.radarUI = radarUI; // Add radarUI parameter
  }

  handleMouseMove(mouseX, mouseY) {
    // Handle factory UI mouse move
    this.factoryManager?.handleMouseMove?.(mouseX, mouseY);
    
    // Handle garage UI mouse move
    this.garageUI?.handleMouseMove(mouseX, mouseY);
    
    // Handle radar UI mouse move
    this.radarUI?.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    // Try factory UI first
    if (this.factoryManager?.handleClick?.(mouseX, mouseY)) {
      return true;
    }
    
    // Try garage UI
    if (this.garageUI?.handleClick(mouseX, mouseY)) {
      return true;
    }
    
    // Try radar UI
    if (this.radarUI?.handleClick(mouseX, mouseY)) {
      return true;
    }
    
    return false;
  }
}