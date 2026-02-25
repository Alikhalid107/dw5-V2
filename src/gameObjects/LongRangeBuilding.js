import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { GARAGE_CONFIG } from "../config/GarageConfig.js";

export class LongRangeBuilding {
  constructor(garageX, garageY) {
    const cfg = GARAGE_CONFIG.longRange;

    this.x = garageX + cfg.spawnOffsetX;
    this.y = garageY + cfg.spawnOffsetY;
    this.width = cfg.displayWidth;
    this.height = cfg.displayHeight;
    this.type = "longRangeBuilding";
    this.zIndex = cfg.zIndex;

    this.sprite = new SpriteFrameUtility(cfg.spriteSheet, cfg.totalFrames, cfg.totalFrames, 1);

    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDuration = cfg.animDuration / cfg.totalFrames;
  }

  update(deltaTime) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    this.frameTimer += dt;
    while (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.currentFrame = (this.currentFrame + 1) % this.sprite.totalFrames;
    }
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.sprite.isFrameLoaded()) return;

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    this.sprite.drawFrame(ctx, this.currentFrame, drawX, drawY, this.width, this.height);
    ctx.restore();
  }

  getObjects() { return [this]; }
}