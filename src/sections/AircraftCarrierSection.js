import { GameObject } from "../core/GameObjectSystem/GameObject.js";

export class AircraftCarrierSection {
  constructor(garageX, garageY, cfg = {}) {
    this.garageX = garageX;
    this.garageY = garageY;
    
    this.structureImage = cfg.structureImage || "airCraftCarrierStructure.png";
    this.doorImage = cfg.doorImage || "airCraftCarrierDoor.png";
    this.width = cfg.width || 516;
    this.height = cfg.height || 238;
    this.offsetX = cfg.offsetX || 0;
    this.offsetY = cfg.offsetY || 0;
    this.zIndex = cfg.zIndex || -94;
    
    this.objects = this.createAircraftCarrier();
  }

  createAircraftCarrier() {
    const objects = [];
    
    const carrierX = this.garageX + this.offsetX;
    const carrierY = this.garageY + this.offsetY;
    
    // Create structure
    const structureObj = new GameObject(
      carrierX,
      carrierY,
      this.width,
      this.height,
      this.zIndex,
      this.structureImage
    );
    
    // Create door
    const doorObj = new GameObject(
      carrierX,
      carrierY,
      this.width,
      this.height,
      this.zIndex + 1, // Door renders above structure
      this.doorImage
    );
    
    objects.push(structureObj, doorObj);
    
    // Store references for positioning tool
    this.structureObj = structureObj;
    this.doorObj = doorObj;
    
    return objects;
  }

  getObjects() {
    return this.objects;
  }

  // Methods for positioning tool
  updatePosition(offsetX, offsetY) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    
    const carrierX = this.garageX + offsetX;
    const carrierY = this.garageY + offsetY;
    
    if (this.structureObj) {
      this.structureObj.x = carrierX;
      this.structureObj.y = carrierY;
    }
    
    if (this.doorObj) {
      this.doorObj.x = carrierX;
      this.doorObj.y = carrierY;
    }
  }

  getStructure() {
    return this.structureObj;
  }

  getDoor() {
    return this.doorObj;
  }
}
