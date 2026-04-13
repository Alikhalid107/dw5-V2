import { CompositeBase } from "../sections/CompositeBase.js";

export class Base {
  constructor(worldWidth, worldHeight, type1Count = 0, type2Count = 1 ) {
    this.compositeBases = [];

    for (let i = 0; i < type1Count; i++) {
      this.compositeBases.push(new CompositeBase(worldWidth, worldHeight, 1));
    }

    for (let i = 0; i < type2Count; i++) {
      this.compositeBases.push(new CompositeBase(worldWidth, worldHeight, 2));
    }
  }

  getObjects() {
    return this.compositeBases.flatMap(b => b.getObjects());
  }

  update(deltaTime) {
    this.compositeBases.forEach(b => b.update(deltaTime));
  }

  handleMouseMove(mouseX, mouseY) {
    this.compositeBases.forEach(b => b.handleMouseMove(mouseX, mouseY));
  }

  handleClick(mouseX, mouseY) {
    return this.compositeBases.some(b => b.handleClick(mouseX, mouseY));
  }

  drawUI(ctx, offsetX, offsetY) {
    this.compositeBases.forEach(b => b.drawUI(ctx, offsetX, offsetY));
  }
}