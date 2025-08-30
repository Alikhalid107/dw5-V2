import { CompositeBase } from "./CompositeBase.js";

export class Base {
  constructor(worldWidth, worldHeight) {
    this.compositeBase = new CompositeBase(worldWidth, worldHeight);
  }

  getObjects() {
    return this.compositeBase.getObjects();
  }

  // ADD THIS MISSING UPDATE METHOD
  update(deltaTime) {
   
    if (this.compositeBase && this.compositeBase.update) {
      this.compositeBase.update(deltaTime);
    }
  }
}