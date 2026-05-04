import { Wall } from "../gameObjects/Wall.js";
import { WALL_CONFIG } from "../config/WallConfig.js";
import { WallPositioning } from "../utils/WallPositioning.js";

export class WallSection {
  constructor(baseX, baseY, baseWidth, baseHeight, cfg = {}, garageRelative = false) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.baseWidth = baseWidth;
    this.baseHeight = baseHeight;
    this.garageRelative = garageRelative; // New parameter for base type 2

    this.wallImages = {
    left: cfg.leftImage ?? WALL_CONFIG.IMAGES.left,
    right: cfg.rightImage ?? WALL_CONFIG.IMAGES.right,
    upgradeLeft: cfg.upgradeLeftImage ?? WALL_CONFIG.UPGRADE.IMAGES.left,
    upgradeRight: cfg.upgradeRightImage ?? WALL_CONFIG.UPGRADE.IMAGES.right,
  };
this.leftWidth          = cfg.leftWidth          ?? cfg.width          ?? WALL_CONFIG.DIMENSIONS.width;
this.leftHeight         = cfg.leftHeight         ?? cfg.height         ?? WALL_CONFIG.DIMENSIONS.height;
this.rightWidth         = cfg.rightWidth         ?? cfg.width          ?? WALL_CONFIG.DIMENSIONS.width;
this.rightHeight        = cfg.rightHeight        ?? cfg.height         ?? WALL_CONFIG.DIMENSIONS.height;
this.upgradeLeftWidth   = cfg.upgradeLeftWidth   ?? cfg.upgradeWidth   ?? WALL_CONFIG.UPGRADE.DIMENSIONS.width;
this.upgradeLeftHeight  = cfg.upgradeLeftHeight  ?? cfg.upgradeHeight  ?? WALL_CONFIG.UPGRADE.DIMENSIONS.height;
this.upgradeRightWidth  = cfg.upgradeRightWidth  ?? cfg.upgradeWidth   ?? WALL_CONFIG.UPGRADE.DIMENSIONS.width;
this.upgradeRightHeight = cfg.upgradeRightHeight ?? cfg.upgradeHeight  ?? WALL_CONFIG.UPGRADE.DIMENSIONS.height;
this.offsetLeft         = cfg.offsetLeft         ?? WALL_CONFIG.OFFSETS.left;
this.offsetRight        = cfg.offsetRight        ?? WALL_CONFIG.OFFSETS.right;
this.upgradeOffsetLeft  = cfg.upgradeOffsetLeft  ?? WALL_CONFIG.UPGRADE.OFFSETS.left;
this.upgradeOffsetRight = cfg.upgradeOffsetRight ?? WALL_CONFIG.UPGRADE.OFFSETS.right;

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
    
    if (this.garageRelative) {
      // Base type 2: Garage-relative positioning
      // baseX, baseY are actually garageX, garageY in this mode
      const leftPos = { 
        x: this.baseX + this.offsetLeft.x, 
        y: this.baseY + this.offsetLeft.y 
      };
      const rightPos = { 
        x: this.baseX + this.offsetRight.x, 
        y: this.baseY + this.offsetRight.y 
      };
      
      this.leftWall = new Wall(
        leftPos.x, leftPos.y,
        this.leftWidth, this.leftHeight,
        WALL_CONFIG.Z_INDEX, this.wallImages.left, 'left'
      );

      this.rightWall = new Wall(
        rightPos.x, rightPos.y,
        this.rightWidth, this.rightHeight,
        WALL_CONFIG.Z_INDEX, this.wallImages.right, 'right'
      );
    } else {
      // Base type 1: Traditional base-relative positioning
      const leftPos = WallPositioning.calculateWallPosition('left', this.baseX, this.baseY, this.baseWidth, this.offsetLeft);
      this.leftWall = new Wall(
        leftPos.x, leftPos.y,
        this.leftWidth, this.leftHeight,
        WALL_CONFIG.Z_INDEX, this.wallImages.left, 'left'
      );

      const rightPos = WallPositioning.calculateWallPosition('right', this.baseX, this.baseY, this.baseWidth, this.offsetRight);
      this.rightWall = new Wall(
        rightPos.x, rightPos.y,
        this.rightWidth, this.rightHeight,
        WALL_CONFIG.Z_INDEX, this.wallImages.right, 'right'
      );
    }

    this.objects.push(this.leftWall, this.rightWall);
  }

  // ---------- configuration methods ----------
  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    if (leftOffsetX !== undefined) this.offsetLeft.x = leftOffsetX;
    if (leftOffsetY !== undefined) this.offsetLeft.y = leftOffsetY;
    if (rightOffsetX !== undefined) this.offsetRight.x = rightOffsetX;
    if (rightOffsetY !== undefined) this.offsetRight.y = rightOffsetY;

    if (this.garageRelative) {
      // Base type 2: Direct garage-relative positioning
      if (this.leftWall) {
        this.leftWall.x = this.baseX + this.offsetLeft.x;
        this.leftWall.y = this.baseY + this.offsetLeft.y;
      }
      if (this.rightWall) {
        this.rightWall.x = this.baseX + this.offsetRight.x;
        this.rightWall.y = this.baseY + this.offsetRight.y;
      }
    } else {
      // Base type 1: Traditional base-relative positioning
      WallPositioning.updateWallPosition(this.leftWall, this.baseX, this.baseY, this.baseWidth, this.offsetLeft);
      WallPositioning.updateWallPosition(this.rightWall, this.baseX, this.baseY, this.baseWidth, this.offsetRight);
    }
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

  this.leftWall.setImage(this.wallImages.upgradeLeft);
  this.rightWall.setImage(this.wallImages.upgradeRight);

  this.leftWall.width  = this.upgradeLeftWidth;
  this.leftWall.height = this.upgradeLeftHeight;
  this.rightWall.width  = this.upgradeRightWidth;
  this.rightWall.height = this.upgradeRightHeight;

  if (this.garageRelative) {
    // Base type 2: Direct garage-relative positioning
    this.leftWall.x = this.baseX + this.upgradeOffsetLeft.x;
    this.leftWall.y = this.baseY + this.upgradeOffsetLeft.y;
    this.rightWall.x = this.baseX + this.upgradeOffsetRight.x;
    this.rightWall.y = this.baseY + this.upgradeOffsetRight.y;
  } else {
    // Base type 1: Traditional base-relative positioning
    const leftPos  = WallPositioning.calculateWallPosition('left',  this.baseX, this.baseY, this.baseWidth, this.upgradeOffsetLeft);
    const rightPos = WallPositioning.calculateWallPosition('right', this.baseX, this.baseY, this.baseWidth, this.upgradeOffsetRight);

    this.leftWall.x = leftPos.x;
    this.leftWall.y = leftPos.y;
    this.rightWall.x = rightPos.x;
    this.rightWall.y = rightPos.y;
  }

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