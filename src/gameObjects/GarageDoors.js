// GarageDoors.js
import { GameObject } from "../core/GameObjectSystem/GameObject";

export class GarageDoors extends GameObject {
  constructor(x, y, width, height, image = "../public/garage_doors.png") {
    super(x, y, width, height, -95, image);
  }
}