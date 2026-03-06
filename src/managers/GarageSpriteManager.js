import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { GARAGE_CONFIG } from "../config/GarageConfig.js";
import { FLAK_CONFIG } from "../config/FlakConfig.js";

export class GarageSpriteManager {
  constructor() {
    // Box 2 — longRange sprite
    const lrCfg = GARAGE_CONFIG.longRange;
    this.longRangeSprite = new SpriteFrameUtility(
      lrCfg.spriteSheet, lrCfg.totalFrames, lrCfg.totalFrames, 1
    );
    this.lrFrame = 0;
    this.lrTimer = 0;

    // Box 0 — flak sprite
    const flakCfg = FLAK_CONFIG.BOX_SPRITE;
    this.flakSprite = new SpriteFrameUtility(
      flakCfg.spriteSheet, flakCfg.totalFrames, flakCfg.totalFrames, 1
    );
    this.flakFrame = 0;
    this.flakTimer = 0;
  }

  update(deltaTime, box0Hovered, box2Hovered) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    const lrCfg = GARAGE_CONFIG.longRange;
    const flakCfg = FLAK_CONFIG.BOX_SPRITE;

    // Box 0 — flak: rotate on hover, reset on unhover
    if (box0Hovered) {
      const flakFrameDuration = flakCfg.animDuration / flakCfg.totalFrames;
      this.flakTimer += dt;
      while (this.flakTimer >= flakFrameDuration) {
        this.flakTimer -= flakFrameDuration;
        this.flakFrame = (this.flakFrame + 1) % flakCfg.totalFrames;
      }
    } else {
      this.flakFrame = 45;
      this.flakTimer = 0;
    }

    // Box 2 — longRange: rotate on hover, reset on unhover
    if (box2Hovered) {
      const lrFrameDuration = lrCfg.hoverAnimDuration / lrCfg.totalFrames;
      this.lrTimer += dt;
      while (this.lrTimer >= lrFrameDuration) {
        this.lrTimer -= lrFrameDuration;
        this.lrFrame = (this.lrFrame + 1) % lrCfg.totalFrames;
      }
    } else {
      this.lrFrame = 45;
      this.lrTimer = 0;
    }
  }

  drawFlakInBox(ctx, isHovered, x, y, width, height, panelBounds) {
    if (!this.flakSprite.isFrameLoaded()) return;

    const cfg = FLAK_CONFIG.BOX_SPRITE.box;
    const multiplier = isHovered ? cfg.hoverSizeMultiplier : cfg.sizeMultiplier;

    const frameW = this.flakSprite.frameWidth;
    const frameH = this.flakSprite.frameHeight;

    const scale = Math.min(width / frameW, height / frameH) * multiplier;
    const drawW = frameW * scale;
    const drawH = frameH * scale;

    const drawX = x + (width - drawW) * cfg.anchorX;
    const drawY = y + (height - drawH) * cfg.anchorY;

    ctx.save();
    const clip = panelBounds || { x, y, width, height };
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // frame 0 when not hovered, animated when hovered
    this.flakSprite.drawFrame(ctx, this.flakFrame, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  drawInBox(ctx, isHovered, x, y, width, height, panelBounds) {
    if (!this.longRangeSprite.isFrameLoaded()) return;

    const cfg = GARAGE_CONFIG.longRange.box;
    const multiplier = isHovered ? cfg.hoverSizeMultiplier : cfg.sizeMultiplier;

    const frameW = this.longRangeSprite.frameWidth;
    const frameH = this.longRangeSprite.frameHeight;

    const scale = Math.min(width / frameW, height / frameH) * multiplier;
    const drawW = frameW * scale;
    const drawH = frameH * scale;

    const drawX = x + (width - drawW) * cfg.anchorX;
    const drawY = y + (height - drawH) * cfg.anchorY;

    ctx.save();
    const clip = panelBounds || { x, y, width, height };
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();
    ctx.imageSmoothingEnabled = false;
    this.longRangeSprite.drawFrame(ctx, this.lrFrame, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}