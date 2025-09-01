import { GameObject } from "../core/GameObject.js";

export class GarageStructure extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, -96, "../public/garage_structure.png");
  }
}
