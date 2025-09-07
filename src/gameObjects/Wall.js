import { GameObject } from "../core/GameObjectSystem/GameObject.js";

export class Wall extends GameObject {
  constructor(x, y, width, height, zIndex, image, side) {
    super(x, y, width, height, zIndex, image);
    this.type = 'wall';
    this.side = side;
    this.id = `wall-${side}`;
  }
}