import { GameObject } from "../core/GameObjectSystem/GameObject.js";
export class FactoryEffect extends GameObject {
  constructor(x, y, width, height, zIndex, image, config = {}) {
    const { frameWidth, frameHeight } = config.totalFrames > 1 
      ? { frameWidth: Math.floor(width / config.totalFrames), frameHeight: height }
      : { frameWidth: width, frameHeight: height };

    super(x, y, frameWidth, frameHeight, zIndex, image);

    this.type = `factory_effect_${config.type || 'default'}`;
    this.effectType = config.effectType || config.type;
    this.visible = true;
    
    // Animation properties
    if (config.totalFrames > 1) {
      this.spriteSheet = true;
      this.frameWidth = frameWidth;
      this.frameHeight = frameHeight;
      this.totalFrames = config.totalFrames;
      this.currentFrame = config.startFrame || 0;
      this.frameSpeed = config.frameSpeed || 0;
      this.loop = config.loop !== false;
      this.animationComplete = false;
      this.startFrame = config.startFrame || 0;
      
      if (!this.loop) {
        this.setupNonLoopingAnimation();
      }
    }

    // Store original offsets for position updates
    this.originalOffsetX = config.offsetX || 0;
    this.originalOffsetY = config.offsetY || 0;
    this.originalzIndex = config.zIndex || 0;
  }

  setupNonLoopingAnimation() {
    const originalUpdate = this.update.bind(this);
    this.update = function(deltaTime) {
      if (!this.animationComplete) {
        const prevFrame = this.currentFrame;
        originalUpdate(deltaTime);
        if (this.currentFrame === this.totalFrames - 1 && prevFrame !== this.currentFrame) {
          this.animationComplete = true;
        }
      }
    };
  }

  updatePosition(factoryX, factoryY) {
    this.x = factoryX + this.originalOffsetX;
    this.y = factoryY + this.originalOffsetY;
  }

  updateZIndex(factoryZIndex) {
    this.zIndex = factoryZIndex + this.originalzIndex;
  }

  restart() {
    if (this.loop && !this.animationComplete) {
      this.currentFrame = this.startFrame || 0;
      this.frameTimer = 0;
      this.animationComplete = false;
    }
  }

  setVisibility(visible) {
    this.visible = visible;
  }
}
