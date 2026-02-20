import { SpriteFrameUtility } from "./SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";

export class TowerSpriteManager {
  constructor() {
    const { spritePaths } = TOWER_PANEL_CONFIG.SPRITES;

    // Box 0: military_central_left.png — 5 frames, 930x117, only show frame 0
    this.militarySprite = new SpriteFrameUtility(
      spritePaths.towerA, 5, 5, 1
    );

    // Box 1: radar.png — 72 frames, 2952x33
    this.radarSprite = new SpriteFrameUtility(
      spritePaths.towerB, 72, 72, 1
    );

    // Box 2: jammer.png — 1 frame, 65x120
    this.jammerSprite = new SpriteFrameUtility(
      spritePaths.towerC, 1, 1, 1
    );

    // Box 3: detector.png — 72 frames, 3312x48
    this.detectorSprite = new SpriteFrameUtility(
      spritePaths.towerD, 72, 72, 1
    );

    // Animation state for animated boxes (box 1 and 3)
    // 3 seconds to cycle all 72 frames = 72/3 = 24 fps
    this.radarFrame = 0;
    this.detectorFrame = 0;
    this.radarTimer = 0;
    this.detectorTimer = 0;
    this.frameDuration = (1200 / 72); // ms per frame
  }

  update(deltaTime, box1Hovered, box3Hovered) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime; // normalize to ms

    if (box1Hovered) {
      this.radarTimer += dt;
      while (this.radarTimer >= this.frameDuration) {
        this.radarTimer -= this.frameDuration;
        this.radarFrame = (this.radarFrame + 1) % 72;
      }
    } else {
      // Reset to first frame when not hovered
      this.radarFrame = 0;
      this.radarTimer = 0;
    }

    if (box3Hovered) {
      this.detectorTimer += dt;
      while (this.detectorTimer >= this.frameDuration) {
        this.detectorTimer -= this.frameDuration;
        this.detectorFrame = (this.detectorFrame + 1) % 72;
      }
    } else {
      this.detectorFrame = 0;
      this.detectorTimer = 0;
    }
  }

  drawForBox(ctx, boxIndex, isHovered, x, y, width, height, panelBounds) {
  const sizeKeys = ["towerA", "towerB", "towerC", "towerD"];
  const key = sizeKeys[boxIndex];

  switch (boxIndex) {
    case 0:
  const sizeA = TOWER_PANEL_CONFIG.SPRITES.sizes.towerA;

  this.drawStatic(ctx, this.militarySprite, 0, x, y, width, height, isHovered, panelBounds, key, {
    anchorX: sizeA.anchorX ?? 0.5,
    anchorY: sizeA.anchorY ?? 0.5
  });
  break;
    case 1: this.drawStatic(ctx, this.radarSprite, this.radarFrame, x, y, width, height, isHovered, panelBounds, key); break;
    case 2:
        
    const sizeC = TOWER_PANEL_CONFIG.SPRITES.sizes.towerC;
    this.drawStatic(ctx, this.jammerSprite, 0, x, y, width, height, isHovered, panelBounds, key,{
        anchorX: sizeC.anchorX ?? 0.5,
        anchorY: sizeC.anchorY ?? 0.5
    });
     break;
    case 3: this.drawStatic(ctx, this.detectorSprite, this.detectorFrame, x, y, width, height, isHovered, panelBounds, key); break;
  }
}

 drawStatic(ctx, sprite, frameIndex, x, y, width, height, isHovered, panelBounds, spriteKey, anchor = { anchorX: 0.5, anchorY: 0.5 }) {
  if (!sprite.isFrameLoaded()) return;

  const sizes = TOWER_PANEL_CONFIG.SPRITES.sizes[spriteKey] || { normal: 1.0, hover: 1.2 };
  const multiplier = isHovered ? sizes.hover : sizes.normal;

  const frameW = sprite.frameWidth;
  const frameH = sprite.frameHeight;

  const scale = Math.min(width / frameW, height / frameH) * multiplier;
  const drawW = frameW * scale;
  const drawH = frameH * scale;

  // Anchor-based positioning instead of always centering
  const drawX = x + (width - drawW) * anchor.anchorX;
  const drawY = y + (height - drawH) * anchor.anchorY;

  ctx.save();

  const clip = panelBounds || { x, y, width, height };
  ctx.beginPath();
  ctx.rect(clip.x, clip.y, clip.width, clip.height);
  ctx.clip();

  ctx.imageSmoothingEnabled = false;
  ctx.imageSmoothingQuality = "high"; // "low", "medium", "high"

  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;

  sprite.drawFrame(ctx, frameIndex, drawX, drawY, drawW, drawH);
  ctx.restore();
}
}