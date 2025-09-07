import { CroppedGameObject } from "./CroppedGameObject";

export class TreeExtension extends CroppedGameObject {
  constructor(x, y, width, height, cropLeft, cropRight) {
    const croppedWidth = width - cropLeft - cropRight;
    super(
      x + cropLeft,
      y,
      croppedWidth,
      height,
      -98,
      "../public/treeExtension.png",
      cropLeft,
      0,
      croppedWidth,
      height
    );
  }
}
