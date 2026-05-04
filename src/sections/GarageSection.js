import { GarageStructure } from "../gameObjects/GarageStructure.js";
import { GarageDoors } from "../gameObjects/GarageDoors.js";

export class GarageSection {
  constructor(baseX, baseY, baseWidth, baseHeight, cfg = {}) {
    // Store base dimensions for positioning tool
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    
    // Unified garage system for both base types
    this.garageWidth = cfg.width ?? 263;
    this.garageHeight = cfg.height ?? 181;
    this.garageOffsetX = cfg.offsetX ?? 0;
    this.garageOffsetY = cfg.offsetY ?? -250;  // Base type 1 default: -250
    this.structureImage = cfg.structureImage ?? "../public/garage_structure.png";
    this.doorsImage = cfg.doorsImage ?? "../public/garage_doors.png";
    this.zIndex = cfg.zIndex ?? -95;
    
    this.objects = this.createGarage(baseX, baseY, baseWidth, baseHeight);
  }

  createGarage(baseX, baseY, baseWidth, baseHeight) {
    const objects = [];

    // Calculate garage position (same logic for both base types)
    const baseCenterX = baseX + baseWidth / 2;
    const baseCenterY = baseY + baseHeight / 2;
    const garageX = baseCenterX + this.garageOffsetX;
    const garageY = baseCenterY + this.garageOffsetY;

    // Create garage structure and doors (same for both base types)
    const structureObj = new GarageStructure(
      garageX, 
      garageY, 
      this.garageWidth, 
      this.garageHeight, 
      this.structureImage
    );
    
    const doorsObj = new GarageDoors(
      garageX, 
      garageY, 
      this.garageWidth, 
      this.garageHeight, 
      this.doorsImage
    );

    objects.push(structureObj, doorsObj);

    // Store garage position for other objects to reference
    this.garageX = garageX;
    this.garageY = garageY;
    
    // Store references for positioning tool
    this.garageImageObj = structureObj;
    this.doorsImageObj = doorsObj;

    return objects;
  }

  getObjects() { return this.objects; }
  getGarageX() { return this.garageX; }
  getGarageY() { return this.garageY; }
  getGarageWidth() { return this.garageWidth; }
  getGarageHeight() { return this.garageHeight; }
}