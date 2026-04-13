// GarageStructure.js
import { GameObject } from "../core/GameObjectSystem/GameObject.js";

export class GarageStructure extends GameObject {
  constructor(x, y, width, height, image = "../public/garage_structure.png") {
    super(x, y, width, height, -96, image);
  }
}