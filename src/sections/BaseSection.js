import { BaseImage } from "../components/BaseImage.js";
import { TreeExtension } from "../components/TreeExtension.js";

export class BaseSection {
  constructor(x, y, width, height) {
    this.paddingTop = 60;
    this.paddingLeft = 155;
    this.treeExtensionHeight = 134;

    this.cropLeft = 0;
    this.cropRight = 0;

    this.objects = this.createObjects(x, y, width, height);
  }

  createObjects(x, y, width, height) {
    const objects = [];

    // Base image
    objects.push(new BaseImage(x, y, width, height));

    // Tree extension
    objects.push(
      new TreeExtension(
        x + this.paddingLeft,
        y - this.treeExtensionHeight + this.paddingTop,
        width,
        this.treeExtensionHeight,
        this.cropLeft,
        this.cropRight
      )
    );

    return objects;
  }

  getObjects() {
    return this.objects;
  }
}
