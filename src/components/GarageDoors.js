import { GameObject } from "../core/GameObject/GameObject";

export class GarageDoors extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, -95, "../public/garage_doors.png");
  }
}
