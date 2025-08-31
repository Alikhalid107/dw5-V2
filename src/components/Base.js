import { CompositeBase } from "./CompositeBase.js";

export class Base {
  constructor(worldWidth, worldHeight) {
    this.compositeBase = new CompositeBase(worldWidth, worldHeight);
  }

  getObjects() {
    return this.compositeBase.getObjects();
  }

  update(deltaTime) {
    this.compositeBase?.update(deltaTime);
  }

  handleMouseMove(mouseX, mouseY) {
    return this.compositeBase?.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    return this.compositeBase?.handleClick(mouseX, mouseY);
  }

  drawUI(ctx, offsetX, offsetY) {
    return this.compositeBase?.drawUI(ctx, offsetX, offsetY);
  }
}