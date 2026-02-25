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

 upgradeWalls() {
  if (this.wallsUpgraded) return false;

  this.leftWall.setImage(WALL_CONFIG.UPGRADE.IMAGES.left);
  this.rightWall.setImage(WALL_CONFIG.UPGRADE.IMAGES.right);

  this.leftWall.width = WALL_CONFIG.UPGRADE.DIMENSIONS.width;
  this.leftWall.height = WALL_CONFIG.UPGRADE.DIMENSIONS.height;
  this.rightWall.width = WALL_CONFIG.UPGRADE.DIMENSIONS.width;
  this.rightWall.height = WALL_CONFIG.UPGRADE.DIMENSIONS.height;

  // Apply upgrade-specific positions
  const leftPos = WallPositioning.calculateWallPosition(
    'left', this.baseX, this.baseY, this.baseWidth,
    WALL_CONFIG.UPGRADE.OFFSETS.left
  );
  const rightPos = WallPositioning.calculateWallPosition(
    'right', this.baseX, this.baseY, this.baseWidth,
    WALL_CONFIG.UPGRADE.OFFSETS.right
  );

  this.leftWall.x = leftPos.x;
  this.leftWall.y = leftPos.y;
  this.rightWall.x = rightPos.x;
  this.rightWall.y = rightPos.y;

  this.wallsUpgraded = true;
  return true;
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