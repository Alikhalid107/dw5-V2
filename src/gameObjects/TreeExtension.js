import { CroppedGameObject } from "./CroppedGameObject";

export class TreeExtension extends CroppedGameObject {
  constructor(x, y, width, height, cropLeft, cropRight, image = "../public/treeExtension.png") {
    const croppedWidth = width - cropLeft - cropRight;
    super(
      x + cropLeft,
      y,
      croppedWidth,
      height,
      -102,
      image,   // ← now configurable
      cropLeft,
      0,
      croppedWidth,
      height
    );
  }
}