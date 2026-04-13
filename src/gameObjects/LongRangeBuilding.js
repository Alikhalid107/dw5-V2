import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { GARAGE_CONFIG } from "../config/GarageConfig.js";

export class LongRangeBuilding {
  constructor(garageX, garageY, cfg = {}) {
  const baseCfg = GARAGE_CONFIG.longRange;

  this.x = garageX + (cfg.spawnOffsetX ?? baseCfg.spawnOffsetX);
  this.y = garageY + (cfg.spawnOffsetY ?? baseCfg.spawnOffsetY);

  // ← always fall back to baseCfg for everything else
  this.width        = baseCfg.displayWidth;
  this.height       = baseCfg.displayHeight;
  this.type         = "longRangeBuilding";
  this.zIndex       = baseCfg.zIndex;

  this.sprite = new SpriteFrameUtility(
    baseCfg.spriteSheet, baseCfg.totalFrames, baseCfg.totalFrames, 1
  );

  this.currentFrame  = 0;
  this.frameTimer    = 0;
  this.frameDuration = baseCfg.animDuration / baseCfg.totalFrames;
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