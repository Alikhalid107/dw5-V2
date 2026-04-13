import { GarageStructure } from "../gameObjects/GarageStructure.js";
import { GarageDoors } from "../gameObjects/GarageDoors.js";

export class GarageSection {
  constructor(baseX, baseY, baseWidth, baseHeight, cfg = {}) {
    this.garageWidth = cfg.width ?? 263;
    this.garageHeight = cfg.height ?? 181;
    this.garageOffsetY = cfg.offsetY ?? -250;
    this.structureImage = cfg.structureImage ?? "../public/garage_structure.png";
    this.doorsImage = cfg.doorsImage ?? "../public/garage_doors.png";

    this.objects = this.createObjects(baseX, baseY, baseWidth, baseHeight);
  }

  createObjects(baseX, baseY, baseWidth, baseHeight) {
    const objects = [];

    const garageX = baseX + (baseWidth - this.garageWidth) / 2;
    const garageY = baseY + baseHeight + this.garageOffsetY;

    objects.push(new GarageStructure(garageX, garageY, this.garageWidth, this.garageHeight, this.structureImage));
    objects.push(new GarageDoors(garageX, garageY, this.garageWidth, this.garageHeight, this.doorsImage));

    this.garageX = garageX;
    this.garageY = garageY;

    return objects;
  }

  getObjects() { return this.objects; }
  getGarageX() { return this.garageX; }
  getGarageY() { return this.garageY; }
  getGarageWidth() { return this.garageWidth; }
  getGarageHeight() { return this.garageHeight; }
}