import { GameObject } from "../core/GameObject/GameObject.js";

export class WallSection {
  constructor(baseX, baseY, baseWidth, baseHeight) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;

    // Default wall dimensions
    this.wallWidth = 485;
    this.wallHeight = 59;

    // Default offsets (you can adjust these)
    this.leftWallOffsetX = 200;
    this.leftWallOffsetY = 415;
    this.rightWallOffsetX = -715;
    this.rightWallOffsetY = 415;

    this.objects = this.createWalls();
  }

  createWalls() {
    const objects = [];

    // Left wall
    const leftWallX = this.baseX + this.leftWallOffsetX;
    const leftWallY = this.baseY + this.leftWallOffsetY;

    const leftWall = new GameObject(
      leftWallX,
      leftWallY,
      this.wallWidth,
      this.wallHeight,
      5, // zIndex
      'simpleWallLeft.png' // Replace with your wall image
    );
    leftWall.id = 'wall-left';
    leftWall.type = 'wall';
    leftWall.side = 'left';

    // Right wall
    const rightWallX = this.baseX + this.baseWidth + this.rightWallOffsetX;
    const rightWallY = this.baseY + this.rightWallOffsetY;

    const rightWall = new GameObject(
      rightWallX,
      rightWallY,
      this.wallWidth,
      this.wallHeight,
      5, // zIndex
      'simpleWallRight.png' // Replace with your wall image
    );
    rightWall.id = 'wall-right';
    rightWall.type = 'wall';
    rightWall.side = 'right';

    objects.push(leftWall, rightWall);

    // Save references
    this.leftWall = leftWall;
    this.rightWall = rightWall;

    return objects;
  }

  getObjects() {
    return this.objects;
  }

  // Method to adjust wall positions
  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    if (leftOffsetX !== undefined) this.leftWallOffsetX = leftOffsetX;
    if (leftOffsetY !== undefined) this.leftWallOffsetY = leftOffsetY;
    if (rightOffsetX !== undefined) this.rightWallOffsetX = rightOffsetX;
    if (rightOffsetY !== undefined) this.rightWallOffsetY = rightOffsetY;

    // Update wall positions
    this.leftWall.x = this.baseX + this.leftWallOffsetX;
    this.leftWall.y = this.baseY + this.leftWallOffsetY;
    this.rightWall.x = this.baseX + this.baseWidth + this.rightWallOffsetX;
    this.rightWall.y = this.baseY + this.rightWallOffsetY;
  }

  // Method to update wall dimensions
  setWallDimensions(width, height) {
    this.wallWidth = width;
    this.wallHeight = height;
    this.leftWall.width = width;
    this.leftWall.height = height;
    this.rightWall.width = width;
    this.rightWall.height = height;
  }

  // Get individual walls
  getLeftWall() {
    return this.leftWall;
  }

  getRightWall() {
    return this.rightWall;
  }

  // Get wall positions for reference
  getLeftWallPosition() {
    return { x: this.leftWall.x, y: this.leftWall.y };
  }

  getRightWallPosition() {
    return { x: this.rightWall.x, y: this.rightWall.y };
  }
}