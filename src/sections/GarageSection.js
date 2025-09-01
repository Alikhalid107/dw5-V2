import { GarageStructure } from "../components/GarageStructure.js";
import { GarageDoors } from "../components/GarageDoors.js";

export class GarageSection {
  constructor(baseX, baseY, baseWidth, baseHeight) {
    this.garageWidth = 263;
    this.garageHeight = 181;

    this.garageOffsetY = -250;
    this.doorsOffsetY = 0;

    this.objects = this.createObjects(baseX, baseY, baseWidth, baseHeight);
  }

  createObjects(baseX, baseY, baseWidth, baseHeight) {
    const objects = [];

    // Garage
    const garageX = baseX + (baseWidth - this.garageWidth) / 2;
    const garageY = baseY + baseHeight + this.garageOffsetY;

    const structure = new GarageStructure(garageX, garageY, this.garageWidth, this.garageHeight);
    objects.push(structure);

    // Doors
    const doorsX = garageX + (this.garageWidth - this.garageWidth) / 2;
    const doorsY = garageY + this.doorsOffsetY;
    objects.push(new GarageDoors(doorsX, doorsY, this.garageWidth, this.garageHeight));

    this.garageX = garageX;
    this.garageY = garageY;

    return objects;
  }

  getObjects() {
    return this.objects;
  }

  getGarageX() { return this.garageX; }
  getGarageY() { return this.garageY; }
  getGarageWidth() { return this.garageWidth; }
  getGarageHeight() { return this.garageHeight; }
}
