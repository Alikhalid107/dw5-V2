import { GameObject } from "../core/GameObjectSystem/GameObject.js";

export class BaseImage extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, -102, "../public/heliBase.jpg");
  }
}
