import { GameObject } from "../../core/GameObject.js";

export class Factory {
  constructor(type, properties, garageX, garageY) {
    // Basic properties
    Object.assign(this, {
      type,
      garageX,
      garageY,
      upgrading: false,
      upgradeTimer: 0,
      additionalBuilding: null,
      ...properties
    });

    // Position and default values
    this.maxLevel = this.maxLevel || 15;
    this.zIndex = this.zIndex ?? -97;
    this.x = garageX + this.offsetX;
    this.y = garageY + this.offsetY;

    // Additional building defaults
    this.additionalImage = this.additionalImage || this.image;
    this.additionalOffsetX = this.additionalOffsetX || Math.floor(this.width + 8);
    this.additionalOffsetY = this.additionalOffsetY || 0;
    this.additionalWidth = this.additionalWidth || Math.floor(this.width * 0.65);
    this.additionalHeight = this.additionalHeight || Math.floor(this.height * 0.85);
    this.additionalZIndex = this.additionalZIndex ?? this.zIndex;

    // Create main building and update visuals
    this.mainBuilding = this.createBuilding(
      this.x, this.y, this.width, this.height, this.zIndex, this.image, 10, "factory"
    );
    this.updateVisuals();
  }

  createBuilding(x, y, width, height, zIndex, image, totalFrames, type) {
    const building = new GameObject(x, y, width, height, zIndex, image);
    Object.assign(building, {
      type,
      factoryType: this.type,
      spriteSheet: true,
      frameWidth: width,
      frameHeight: height,
      totalFrames,
      currentFrame: 0,
      frameSpeed: 0,
      update: () => {}
    });
    return building;
  }

  update(deltaMs) {
    if (!this.upgrading) return false;
    
    this.upgradeTimer += deltaMs;
    return this.upgradeTimer >= this.upgradeTime;
  }

  startUpgrade() {
    if (this.upgrading || this.isMaxLevel()) return false;
    this.upgrading = true;
    this.upgradeTimer = 0;
    return true;
  }

  completeUpgrade() {
    if (this.isMaxLevel()) {
      this.upgrading = false;
      this.upgradeTimer = 0;
      return this.level;
    }

    this.upgrading = false;
    this.upgradeTimer = 0;
    this.level = Math.min(this.level + 1, this.maxLevel);
    this.updateVisuals();
    return this.level;
  }

  updateVisuals() {
    // Update main building (levels 1-10)
    const mainLevel = Math.min(this.level, 10);
    this.mainBuilding.level = mainLevel;
    this.mainBuilding.currentFrame = Math.max(0, mainLevel - 1);

    // Handle additional building (levels 11-15)
    if (this.level > 10) {
      if (!this.additionalBuilding) {
        const ax = this.x + this.additionalOffsetX;
        const ay = this.y + this.additionalOffsetY;
        this.additionalBuilding = this.createBuilding(
          ax, ay, this.additionalWidth, this.additionalHeight, 
          this.additionalZIndex, this.additionalImage, 6, "factory_additional"
        );
      }
      
      const secondaryLevel = Math.min(this.level - 10, 6);
      this.additionalBuilding.level = secondaryLevel;
      this.additionalBuilding.currentFrame = Math.max(0, secondaryLevel - 1);
      
      // Keep position in sync
      this.additionalBuilding.x = this.x + this.additionalOffsetX;
      this.additionalBuilding.y = this.y + this.additionalOffsetY;
    } else {
      this.additionalBuilding = null;
    }
  }

  cancelUpgrade() {
    this.upgrading = false;
    this.upgradeTimer = 0;
  }

  setLevel(newLevel) {
    this.level = Math.min(Math.max(newLevel, 1), this.maxLevel);
    this.upgrading = false;
    this.upgradeTimer = 0;
    this.updateVisuals();
  }

  setZIndex(newZIndex) {
    this.zIndex = newZIndex;
    if (this.mainBuilding) this.mainBuilding.zIndex = newZIndex;
  }

  getObjects() {
    const objects = [this.mainBuilding];
    if (this.additionalBuilding) objects.push(this.additionalBuilding);
    return objects;
  }

  isMaxLevel() {
    return this.level >= this.maxLevel;
  }

  isPointInside(x, y) {
    // Check main building
    if (x >= this.x && x <= this.x + this.width && 
        y >= this.y && y <= this.y + this.height) {
      return true;
    }

    // Check additional building if it exists
    if (this.additionalBuilding) {
      const ax = this.x + this.additionalOffsetX;
      const ay = this.y + this.additionalOffsetY;
      return x >= ax && x <= ax + this.additionalWidth && 
             y >= ay && y <= ay + this.additionalHeight;
    }

    return false;
  }

  getCombinedBounds() {
    let bounds = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };

    if (this.additionalBuilding) {
      const ax = this.x + this.additionalOffsetX;
      const ay = this.y + this.additionalOffsetY;
      
      const left = Math.min(bounds.x, ax);
      const top = Math.min(bounds.y, ay);
      const right = Math.max(bounds.x + bounds.width, ax + this.additionalWidth);
      const bottom = Math.max(bounds.y + bounds.height, ay + this.additionalHeight);
      
      bounds = { x: left, y: top, width: right - left, height: bottom - top };
    }

    return bounds;
  }

  getRemainingUpgradeTime() {
    if (!this.upgrading) return 0;
    const remainingMs = this.upgradeTime - this.upgradeTimer;
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  getUpgradeProgress() {
    return this.upgrading ? Math.min(this.upgradeTimer / this.upgradeTime, 1) : 0;
  }
}