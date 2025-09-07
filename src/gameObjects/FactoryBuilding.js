import { GameObject } from "../core/GameObjectSystem/GameObject.js";

export class FactoryBuilding extends GameObject {
  constructor(x, y, width, height, zIndex, image, totalFrames = 10, type = "factory") {
    super(x, y, width, height, zIndex, image);
    
    this.type = type;
    this.factoryType = null; // Set by parent
    this.spriteSheet = true;
    this.frameWidth = width;
    this.frameHeight = height;
    this.totalFrames = totalFrames;
    this.currentFrame = 0;
    this.frameSpeed = 0;
    this.level = 1;
  }

  setLevel(level) {
    this.level = level;
    this.currentFrame = Math.max(0, level - 1);
  }

  update() {
    // Buildings are static, no animation needed
  }
}