import { GameObject } from "../../core/GameObject.js";

export class Factory {
  constructor(type, properties, garageX, garageY) {
    this.type = type;
    this.name = properties.name;
    this.image = properties.image;
    this.offsetX = properties.offsetX;
    this.offsetY = properties.offsetY;
    this.level = properties.level;
    this.upgrading = properties.upgrading;
    this.upgradeTimer = properties.upgradeTimer;
    this.upgradeTime = properties.upgradeTime;
    this.maxLevel = properties.maxLevel;
    this.zIndex = properties.zIndex || -97; // Default zIndex if not specified
    
    // Use individual factory dimensions
    this.factoryWidth = properties.width;
    this.factoryHeight = properties.height;
    
    this.garageX = garageX;
    this.garageY = garageY;
    
    this.x = this.garageX + this.offsetX;
    this.y = this.garageY + this.offsetY;
    
    // Create main factory object
    this.mainBuilding = this.createMainBuilding();
  }
  
  createMainBuilding() {
    const factoryObj = new GameObject(
      this.x, this.y,
      this.factoryWidth,
      this.factoryHeight,
      this.zIndex, // Use the factory's zIndex
      this.image
    );
    
    factoryObj.type = "factory";
    factoryObj.factoryType = this.type;
    factoryObj.spriteSheet = true;
    factoryObj.frameWidth = this.factoryWidth;
    factoryObj.frameHeight = this.factoryHeight;
    factoryObj.totalFrames = 10; // 10 frames for levels 1-10
    factoryObj.currentFrame = this.level - 1; // Level 1 = frame 0, Level 10 = frame 9
    factoryObj.level = this.level;
    factoryObj.frameSpeed = 0; // No animation - frames are controlled by level
    
    // Override the update method to prevent any automatic animation
    factoryObj.update = function() {
      // NO ANIMATION - frame is controlled by factory level only
    };
    
    return factoryObj;
  }
  
  update(deltaMs) {
    if (this.upgrading) {
      this.upgradeTimer += deltaMs;
      
      if (this.upgradeTimer >= this.upgradeTime) {
        return true; // Upgrade complete
      }
    }
    return false;
  }
  
  startUpgrade() {
    if (this.upgrading || this.isMaxLevel()) {
      return false;
    }
    
    this.upgrading = true;
    this.upgradeTimer = 0;
    return true;
  }
  
  completeUpgrade() {
    // CRITICAL FIX: Ensure level never exceeds maxLevel
    if (this.isMaxLevel()) {
      // If already at max level, just stop upgrading
      this.upgrading = false;
      this.upgradeTimer = 0;
      return this.level;
    }
    
    this.upgrading = false;
    this.upgradeTimer = 0;
    this.level = Math.min(this.level + 1, this.maxLevel); // Ensure level doesn't exceed max
    this.updateVisuals();
    return this.level;
  }
  
  // Method to cancel ongoing upgrade (used by upgrade all)
  cancelUpgrade() {
    this.upgrading = false;
    this.upgradeTimer = 0;
  }
  
  // Method to set level directly (used by upgrade all)
  setLevel(newLevel) {
    this.level = Math.min(Math.max(newLevel, 1), this.maxLevel); // Clamp between 1 and maxLevel
    this.upgrading = false;
    this.upgradeTimer = 0;
    this.updateVisuals();
  }
  
  updateVisuals() {
    this.mainBuilding.level = this.level;
    // Directly set the frame based on level (level 1 = frame 0, level 10 = frame 9)
    this.mainBuilding.currentFrame = Math.min(this.level - 1, 9);
  }
  
  // Method to update zIndex if needed during runtime
  setZIndex(newZIndex) {
    this.zIndex = newZIndex;
    this.mainBuilding.zIndex = newZIndex;
  }
  
  isMaxLevel() {
    return this.level >= this.maxLevel;
  }
  
  getObjects() {
    return [this.mainBuilding];
  }
  
  isPointInside(x, y) {
    return (
      x >= this.x && x <= this.x + this.factoryWidth &&
      y >= this.y && y <= this.y + this.factoryHeight
    );
  }
  
  // Get remaining upgrade time in seconds
  getRemainingUpgradeTime() {
    if (!this.upgrading) {
      return 0;
    }
    
    const remainingMs = this.upgradeTime - this.upgradeTimer;
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }
  
  // Get upgrade progress (0 to 1)
  getUpgradeProgress() {
    if (!this.upgrading) return 0;
    return Math.min(this.upgradeTimer / this.upgradeTime, 1);
  }
}