import { BaseImage } from "../gameObjects/BaseImage.js";
import { TreeExtension } from "../gameObjects/TreeExtension.js";

export class BaseSection {
  constructor(x, y, width, height, cfg = {}) {
    this.paddingTop = cfg.treeExtension?.paddingTop ?? 60;
    this.paddingLeft = cfg.treeExtension?.paddingLeft ?? 155;
    this.treeExtensionHeight = cfg.treeExtension?.height ?? 134;
    this.cropLeft = cfg.treeExtension?.cropLeft ?? 0;
    this.cropRight = cfg.treeExtension?.cropRight ?? 0;
    this.baseImage = cfg.baseImage ?? "../public/heliBase.jpg";
    this.treeImage = cfg.treeExtension?.image ?? "../public/treeExtension.png";

    this.objects = this.createObjects(x, y, width, height);
  }

  createObjects(x, y, width, height) {
    const objects = [];

    objects.push(new BaseImage(x, y, width, height, this.baseImage));

    objects.push(
      new TreeExtension(
        x + this.paddingLeft,
        y - this.treeExtensionHeight + this.paddingTop,
        width,
        this.treeExtensionHeight,
        this.cropLeft,
        this.cropRight,
        this.treeImage   // ← pass through
      )
    );

    return objects;
  }

  getObjects() { return this.objects; }
}