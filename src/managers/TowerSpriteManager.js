import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";
import { AnimatedSpriteState } from "../utils/AnimatedSpriteState.js";

export class TowerSpriteManager {
  constructor() {
    const { spritePaths } = TOWER_PANEL_CONFIG.SPRITES;
    const frameDuration = 1200 / 72; // ms per frame (3s cycle over 72 frames)

    // Box 0: military_central_left.png — 5 frames, static (frame 0 only)
    this.militarySprite = new SpriteFrameUtility(spritePaths.towerA, 5, 5, 1);

    // Box 1: radar.png — 72 frames, animated on hover
    this.radarSprite = new SpriteFrameUtility(spritePaths.towerB, 72, 72, 1);
    this.radarAnim   = new AnimatedSpriteState(72, frameDuration);

    // Box 2: jammer.png — 1 frame, static
    this.jammerSprite = new SpriteFrameUtility(spritePaths.towerC, 1, 1, 1);

    // Box 3: detector.png — 72 frames, animated on hover
    this.detectorSprite = new SpriteFrameUtility(spritePaths.towerD, 72, 72, 1);
    this.detectorAnim   = new AnimatedSpriteState(72, frameDuration);
  }

  update(deltaTime, box1Hovered, box3Hovered) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    this.radarAnim.update(dt, box1Hovered);
    this.detectorAnim.update(dt, box3Hovered);
  }

  drawForBox(ctx, boxIndex, isHovered, x, y, width, height, panelBounds) {
    switch (boxIndex) {
      case 0: {
        const sizeA = TOWER_PANEL_CONFIG.SPRITES.sizes.towerA;
        this.drawStatic(ctx, this.militarySprite, 0, x, y, width, height, isHovered, panelBounds, "towerA", {
          anchorX: sizeA.anchorX ?? 0.5,
          anchorY: sizeA.anchorY ?? 0.5,
        });
        break;
      }
      case 1:
        this.drawStatic(ctx, this.radarSprite, this.radarAnim.frame, x, y, width, height, isHovered, panelBounds, "towerB");
        break;
      case 2: {
        const sizeC = TOWER_PANEL_CONFIG.SPRITES.sizes.towerC;
        this.drawStatic(ctx, this.jammerSprite, 0, x, y, width, height, isHovered, panelBounds, "towerC", {
          anchorX: sizeC.anchorX ?? 0.5,
          anchorY: sizeC.anchorY ?? 0.5,
        });
        break;
      }
      case 3:
        this.drawStatic(ctx, this.detectorSprite, this.detectorAnim.frame, x, y, width, height, isHovered, panelBounds, "towerD");
        break;
    }
  }

  drawStatic(ctx, sprite, frameIndex, x, y, width, height, isHovered, panelBounds, spriteKey, anchor = { anchorX: 0.5, anchorY: 0.5 }) {
    if (!sprite.isFrameLoaded()) return;

    const sizes      = TOWER_PANEL_CONFIG.SPRITES.sizes[spriteKey] || { normal: 1.0, hover: 1.2 };
    const multiplier = isHovered ? sizes.hover : sizes.normal;

    const frameW = sprite.frameWidth;
    const frameH = sprite.frameHeight;

    const scale  = Math.min(width / frameW, height / frameH) * multiplier;
    const drawW  = frameW * scale;
    const drawH  = frameH * scale;
    const drawX  = x + (width  - drawW) * anchor.anchorX;
    const drawY  = y + (height - drawH) * anchor.anchorY;

    ctx.save();
    const clip = panelBounds || { x, y, width, height };
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();

    ctx.imageSmoothingEnabled        = false;
    ctx.imageSmoothingQuality        = "high";
    ctx.mozImageSmoothingEnabled     = false;
    ctx.webkitImageSmoothingEnabled  = false;
    ctx.msImageSmoothingEnabled      = false;

    sprite.drawFrame(ctx, frameIndex, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}