import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { AnimatedSpriteState } from "../utils/AnimatedSpriteState.js";
import { COMMAND_PANEL_CONFIG } from "../config/CommandPanelConfig.js";

export class CommandSpriteManager {
 constructor() {
  const cfg = COMMAND_PANEL_CONFIG.SPRITES;

  // Box 1 — oilPump
  this.oilSprite = new SpriteFrameUtility(
    cfg.oilPump.spriteSheet, cfg.oilPump.totalFrames, cfg.oilPump.totalFrames, 1
  );
  this.oilAnim = new AnimatedSpriteState(
    cfg.oilPump.totalFrames,
    cfg.oilPump.animDuration / cfg.oilPump.totalFrames,
    cfg.oilPump.staticFrame
  );

  // Box 2 — explosionBase
  this.explosionSprite = new SpriteFrameUtility(
    cfg.explosionBase.spriteSheet, cfg.explosionBase.totalFrames, cfg.explosionBase.totalFrames, 1
  );
  this.explosionAnim = new AnimatedSpriteState(
    cfg.explosionBase.totalFrames,
    cfg.explosionBase.animDuration / cfg.explosionBase.totalFrames,
    cfg.explosionBase.staticFrame
  );

  // Box 4 — clockBase
  this.clockSprite = new SpriteFrameUtility(
    cfg.clockBase.spriteSheet, cfg.clockBase.totalFrames, cfg.clockBase.totalFrames, 1
  );
  this.clockAnim = new AnimatedSpriteState(
    cfg.clockBase.totalFrames,
    cfg.clockBase.animDuration / cfg.clockBase.totalFrames,
    cfg.clockBase.staticFrame
  );
}

  update(deltaTime, box1Hovered, box2Hovered, box4Hovered) {
    this.oilAnim.update(deltaTime, box1Hovered);
    this.explosionAnim.update(deltaTime, box2Hovered);
    this.clockAnim.update(deltaTime, box4Hovered);
  }

  drawForBox(ctx, boxIndex, isHovered, x, y, width, height, panelBounds, iconManager, commandBuilding) {
    switch (boxIndex) {
      case 0: this._drawCommandCenter(ctx, isHovered, x, y, width, height, panelBounds, commandBuilding); break;
      case 1: this._drawSprite(ctx, this.oilSprite, this._getFrame(this.oilAnim, isHovered, COMMAND_PANEL_CONFIG.SPRITES.oilPump.staticFrame), isHovered, x, y, width, height, panelBounds, COMMAND_PANEL_CONFIG.SPRITES.oilPump.box); break;
      case 2: this._drawSprite(ctx, this.explosionSprite, this._getFrame(this.explosionAnim, isHovered, COMMAND_PANEL_CONFIG.SPRITES.explosionBase.staticFrame), isHovered, x, y, width, height, panelBounds, COMMAND_PANEL_CONFIG.SPRITES.explosionBase.box); break;
      case 3: this._drawCrane(ctx, isHovered, x, y, width, height, panelBounds, iconManager); break;
      case 4: this._drawSprite(ctx, this.clockSprite, this._getFrame(this.clockAnim, isHovered, COMMAND_PANEL_CONFIG.SPRITES.clockBase.staticFrame), isHovered, x, y, width, height, panelBounds, COMMAND_PANEL_CONFIG.SPRITES.clockBase.box); break;
    }
  }

  _getFrame(anim, isHovered, staticFrame) {
    return isHovered ? anim.frame : staticFrame;
  }

  _drawCommandCenter(ctx, isHovered, x, y, width, height, panelBounds, commandBuilding) {
  const cfg = COMMAND_PANEL_CONFIG.BUILDING.commandCenter;

  if (!this._cmdSprite) {
    this._cmdSprite = new SpriteFrameUtility(
      cfg.spriteSheet, cfg.totalFrames, cfg.totalFrames, 1
    );
  }

  // When building exists use its current level frame, otherwise staticFrame
  const frame = cfg.staticFrame;

  // Use box config for positioning — tunable via config
  const sizeCfg = cfg.box || {
    sizeMultiplier: 1.0,
    hoverSizeMultiplier: 1.2,
    anchorX: 0.5,
    anchorY: 0.5,
  };

  this._drawSprite(ctx, this._cmdSprite, frame, isHovered, x, y, width, height, panelBounds, sizeCfg);
}

  _drawCrane(ctx, isHovered, x, y, width, height, panelBounds, iconManager) {
  if (!iconManager?.isLoaded()) return;
  const cfg = COMMAND_PANEL_CONFIG.SPRITES.crane.box;
  const multiplier = isHovered ? cfg.hoverSizeMultiplier : cfg.sizeMultiplier;
  const size = Math.min(width, height) * multiplier;
  const drawX = x + (width - size) * cfg.anchorX;
  const drawY = y + (height - size) * cfg.anchorY;

  ctx.save();
  // ← clip to BOX bounds
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  iconManager.drawCrane(ctx, drawX, drawY, size, size);
  ctx.restore();
}

  _drawSprite(ctx, sprite, frame, isHovered, x, y, width, height, panelBounds, sizeCfg) {
  if (!sprite.isFrameLoaded()) return;

  const multiplier = isHovered ? sizeCfg.hoverSizeMultiplier : sizeCfg.sizeMultiplier;
  const frameW = sprite.frameWidth;
  const frameH = sprite.frameHeight;

  const scale = Math.min(width / frameW, height / frameH) * multiplier;
  const drawW = frameW * scale;
  const drawH = frameH * scale;

  const drawX = x + (width - drawW) * (sizeCfg.anchorX ?? 0.5);
  const drawY = y + (height - drawH) * (sizeCfg.anchorY ?? 0.5);

  ctx.save();
  // ← clip to BOX bounds, not panel bounds
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  sprite.drawFrame(ctx, frame, drawX, drawY, drawW, drawH);
  ctx.restore();
}
}