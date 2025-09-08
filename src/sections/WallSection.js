import { Wall } from "../gameObjects/Wall.js";
import { WALL_CONFIG } from "../config/WallConfig.js";
import { WallPositioning } from "../utils/WallPositioning.js";

export class WallSection {
  constructor(baseX, baseY, baseWidth, baseHeight) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;

    // Custom offsets (can be modified)
    this.customOffsets = {
      left: {},
      right: {}
    };

    this.leftWall = null;
    this.rightWall = null;
    this.objects = [];

    this.createWalls();
  }

  createWalls() {
    this.objects = [];
    
    // Create left wall
    const leftPos = WallPositioning.calculateWallPosition('left', this.baseX, this.baseY, this.baseWidth, this.customOffsets.left);
    this.leftWall = new Wall(
      leftPos.x,
      leftPos.y,
      WALL_CONFIG.DIMENSIONS.width,
      WALL_CONFIG.DIMENSIONS.height,
      WALL_CONFIG.Z_INDEX,
      WALL_CONFIG.IMAGES.left,
      'left'
    );

    // Create right wall
    const rightPos = WallPositioning.calculateWallPosition('right', this.baseX, this.baseY, this.baseWidth, this.customOffsets.right);
    this.rightWall = new Wall(
      rightPos.x,
      rightPos.y,
      WALL_CONFIG.DIMENSIONS.width,
      WALL_CONFIG.DIMENSIONS.height,
      WALL_CONFIG.Z_INDEX,
      WALL_CONFIG.IMAGES.right,
      'right'
    );

    this.objects.push(this.leftWall, this.rightWall);
  }

  // ---------- configuration methods ----------
  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    if (leftOffsetX !== undefined) this.customOffsets.left.x = leftOffsetX;
    if (leftOffsetY !== undefined) this.customOffsets.left.y = leftOffsetY;
    if (rightOffsetX !== undefined) this.customOffsets.right.x = rightOffsetX;
    if (rightOffsetY !== undefined) this.customOffsets.right.y = rightOffsetY;

    // Update wall positions
    WallPositioning.updateWallPosition(this.leftWall, this.baseX, this.baseY, this.baseWidth, this.customOffsets.left);
    WallPositioning.updateWallPosition(this.rightWall, this.baseX, this.baseY, this.baseWidth, this.customOffsets.right);
  }

  setWallDimensions(width, height) {
    if (this.leftWall) {
      this.leftWall.width = width;
      this.leftWall.height = height;
    }
    if (this.rightWall) {
      this.rightWall.width = width;
      this.rightWall.height = height;
    }
  }

  // ---------- public getters ----------
  getObjects() {
    return this.objects;
  }

  getLeftWall() {
    return this.leftWall;
  }

  getRightWall() {
    return this.rightWall;
  }

  getLeftWallPosition() {
    return this.leftWall ? { x: this.leftWall.x, y: this.leftWall.y } : null;
  }

  getRightWallPosition() {
    return this.rightWall ? { x: this.rightWall.x, y: this.rightWall.y } : null;
  }
}