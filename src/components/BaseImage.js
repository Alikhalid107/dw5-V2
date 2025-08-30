import { GameObject } from "../core/GameObject.js";

export class BaseImage extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, -98, "../public/heliBase.jpg");
  }
}
