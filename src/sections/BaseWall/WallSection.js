import { WallFactory } from "./WallFactory.js";
import { WallConfig } from "../../config/WallConfig.js";


export class WallSection {
  constructor(baseX, baseY, baseWidth, baseHeight) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;

    // Use configuration
    this.config = new WallConfig();
    
    // Create walls using factory
    this.wallFactory = new WallFactory(baseX, baseY, baseWidth, baseHeight, this.config);
    this.objects = this.wallFactory.createWalls();
    
    // Save references
    this.leftWall = this.wallFactory.getLeftWall();
    this.rightWall = this.wallFactory.getRightWall();
  }

  getObjects() {
    return this.objects;
  }

  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    this.wallFactory.setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY);
  }

  setWallDimensions(width, height) {
    this.wallFactory.setWallDimensions(width, height);
  }

  getLeftWall() {
    return this.wallFactory.getLeftWall();
  }

  getRightWall() {
    return this.wallFactory.getRightWall();
  }

  getLeftWallPosition() {
    return this.wallFactory.getLeftWallPosition();
  }

  getRightWallPosition() {
    return this.wallFactory.getRightWallPosition();
  }
}