import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { EXTENSION_PANEL_CONFIG } from "../config/ExtensionPanelConfig.js";

export class ExtensionSpriteManager {
  constructor() {
    const cfg = EXTENSION_PANEL_CONFIG.BUILDING;

    // Box 0 — ministry: static frame 0, bigger on hover
    this.ministrySprite = new SpriteFrameUtility(
      cfg.ministry.spriteSheet, cfg.ministry.totalFrames, cfg.ministry.totalFrames, 1
    );

    // Box 2 — militaryOffice: animates frames 0-2 on hover
    this.officeSprite = new SpriteFrameUtility(
      cfg.militaryOffice.spriteSheet, cfg.militaryOffice.totalFrames, cfg.militaryOffice.totalFrames, 1
    );
    this.officeFrame = 0;
    this.officeTimer = 0;
    this.officeFrameDuration = 300; // ms per frame on hover

    // Box 3 — groupLimit: animates frames 0-2 on hover
    this.groupSprite = new SpriteFrameUtility(
      cfg.groupLimit.spriteSheet, cfg.groupLimit.totalFrames, cfg.groupLimit.totalFrames, 1
    );
    this.groupFrame = 0;
    this.groupTimer = 0;
    this.groupFrameDuration = 300;
  }

  update(deltaTime, box2Hovered, box3Hovered) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;

    // Box 2 — office hover animation
    if (box2Hovered) {
      this.officeTimer += dt;
      while (this.officeTimer >= this.officeFrameDuration) {
        this.officeTimer -= this.officeFrameDuration;
        this.officeFrame = (this.officeFrame + 1) % 3;
      }
    } else {
      this.officeFrame = 0;
      this.officeTimer = 0;
    }

    // Box 3 — group hover animation
    if (box3Hovered) {
      this.groupTimer += dt;
      while (this.groupTimer >= this.groupFrameDuration) {
        this.groupTimer -= this.groupFrameDuration;
        this.groupFrame = (this.groupFrame + 1) % 3;
      }
    } else {
      this.groupFrame = 0;
      this.groupTimer = 0;
    }
  }

  drawForBox(ctx, boxIndex, isHovered, x, y, width, height, panelBounds) {
    const sizes = EXTENSION_PANEL_CONFIG.SPRITES.sizes;

    switch (boxIndex) {
      case 0: this._draw(ctx, this.ministrySprite, 0, isHovered, x, y, width, height, panelBounds, sizes.extA); break;
      case 2: this._draw(ctx, this.officeSprite, this.officeFrame, isHovered, x, y, width, height, panelBounds, sizes.extC); break;
      case 3: this._draw(ctx, this.groupSprite, this.groupFrame, isHovered, x, y, width, height, panelBounds, sizes.extD); break;
    }
  }

  _draw(ctx, sprite, frame, isHovered, x, y, width, height, panelBounds, sizeCfg) {
    if (!sprite.isFrameLoaded()) return;

    const multiplier = isHovered ? sizeCfg.hover : sizeCfg.normal;
    const frameW = sprite.frameWidth;
    const frameH = sprite.frameHeight;

    const scale = Math.min(width / frameW, height / frameH) * multiplier;
    const drawW = frameW * scale;
    const drawH = frameH * scale;

    const drawX = x + (width - drawW) * (sizeCfg.anchorX ?? 0.5);
    const drawY = y + (height - drawH) * (sizeCfg.anchorY ?? 0.5);

    ctx.save();
    const clip = panelBounds || { x, y, width, height };
    ctx.beginPath();
    ctx.rect(clip.x, clip.y, clip.width, clip.height);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    sprite.drawFrame(ctx, frame, drawX, drawY, drawW, drawH);
    ctx.restore();
  }
}