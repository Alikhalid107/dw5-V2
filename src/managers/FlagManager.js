import { GameObject } from "../core/GameObjectSystem/GameObject";
export class FlagManager {
  constructor(garageX, garageY, garageWidth, garageHeight, options = {}) {
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;

    this.offsetX = options.offsetX ?? 27;
    this.offsetY = options.offsetY ?? 15;
    this.flagWidth = options.flagWidth ?? 18;
    this.flagHeight = options.flagHeight ?? 27;
    this.frameCount = options.frameCount ?? 34;
    this.frameSpeed = options.frameSpeed ?? 55; // Faster for testing
    this.flagImage = options.flagImage ?? "greenFlag.png";
    this.shadowImage = options.shadowImage ?? "flagShadow.png";
    this.shadowOffsetY = options.shadowOffsetY ?? -25;

    this.flags = this.createFlags();
    
    // FORCE animation with setInterval as backup
    this.startForceAnimation();
  }

  createFlags() {
    const flags = [];
    const x = this.garageX + this.offsetX;
    const y = this.garageY + this.garageHeight / 2 - this.flagHeight / 2 + this.offsetY;

    // Shadow
    const shadow = new GameObject(x, y + this.shadowOffsetY, this.flagWidth, this.flagHeight / 4, 5, this.shadowImage);
    shadow.type = "shadow";
    flags.push(shadow);

    // Flag with EXPLICIT animation setup
    const flag = new GameObject(x, y, this.flagWidth, this.flagHeight, 6, this.flagImage);
    flag.type = "flag";
    flag.spriteSheet = true;
    flag.frameWidth = 612 / this.frameCount;
    flag.frameHeight = this.flagHeight;
    flag.totalFrames = this.frameCount;
    flag.currentFrame = 0;
    flag.frameSpeed = this.frameSpeed;
    flag.frameTimer = 0;
    flag.animationDirection = 1;

  
    flags.push(flag);
    return flags;
  }

  // BACKUP animation method using setInterval
  startForceAnimation() {
   
    
    setInterval(() => {
      for (const flag of this.flags) {
        if (flag.type === "flag" && flag.spriteSheet) {
          // Force frame change every interval
          flag.currentFrame += flag.animationDirection;
          
          if (flag.currentFrame >= flag.totalFrames - 1) {
            flag.currentFrame = flag.totalFrames - 1;
            flag.animationDirection = -1;
          } else if (flag.currentFrame <= 0) {
            flag.currentFrame = 0;
            flag.animationDirection = 1;
          }
          
         
        }
      }
    }, this.frameSpeed);
  }

  update(deltaTime) {
    // Primary update method - but we have setInterval as backup

  }

  getObjects() {
    return this.flags;
  }

  setAnimationSpeed(speed) {
    this.frameSpeed = speed;
    for (const flag of this.flags) {
      if (flag.type === "flag") {
        flag.frameSpeed = speed;
      }
    }
  }
}