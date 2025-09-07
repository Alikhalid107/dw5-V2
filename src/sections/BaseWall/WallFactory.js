import { Wall } from "../../gameObjects/Wall.js";

export class WallFactory {
  constructor(baseX, baseY, baseWidth, baseHeight, config) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.config = config;
    
    this.leftWall = null;
    this.rightWall = null;
    this.objects = [];
  }

  createWalls() {
    this.objects = [];
    
    // Left wall
    const leftWallX = this.baseX + this.config.leftWallOffsetX;
    const leftWallY = this.baseY + this.config.leftWallOffsetY;

    this.leftWall = new Wall(
      leftWallX,
      leftWallY,
      this.config.wallWidth,
      this.config.wallHeight,
      this.config.wallZIndex,
      this.config.leftWallImage,
      'left'
    );

    // Right wall
    const rightWallX = this.baseX + this.baseWidth + this.config.rightWallOffsetX;
    const rightWallY = this.baseY + this.config.rightWallOffsetY;

    this.rightWall = new Wall(
      rightWallX,
      rightWallY,
      this.config.wallWidth,
      this.config.wallHeight,
      this.config.wallZIndex,
      this.config.rightWallImage,
      'right'
    );

    this.objects.push(this.leftWall, this.rightWall);
    return this.objects;
  }

  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    if (leftOffsetX !== undefined) this.config.leftWallOffsetX = leftOffsetX;
    if (leftOffsetY !== undefined) this.config.leftWallOffsetY = leftOffsetY;
    if (rightOffsetX !== undefined) this.config.rightWallOffsetX = rightOffsetX;
    if (rightOffsetY !== undefined) this.config.rightWallOffsetY = rightOffsetY;

    // Update wall positions
    this.leftWall.x = this.baseX + this.config.leftWallOffsetX;
    this.leftWall.y = this.baseY + this.config.leftWallOffsetY;
    this.rightWall.x = this.baseX + this.baseWidth + this.config.rightWallOffsetX;
    this.rightWall.y = this.baseY + this.config.rightWallOffsetY;
  }

  setWallDimensions(width, height) {
    this.config.wallWidth = width;
    this.config.wallHeight = height;
    this.leftWall.width = width;
    this.leftWall.height = height;
    this.rightWall.width = width;
    this.rightWall.height = height;
  }

  getLeftWall() { return this.leftWall; }
  getRightWall() { return this.rightWall; }

  getLeftWallPosition() { 
    return { x: this.leftWall.x, y: this.leftWall.y }; 
  }

  getRightWallPosition() { 
    return { x: this.rightWall.x, y: this.rightWall.y }; 
  }
}