import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";

export class RadarBuilding {
  constructor(garageX, garageY) {
    const cfg = TOWER_PANEL_CONFIG.BUILDING.radar;

    this.x = garageX + cfg.spawnOffsetX;
    this.y = garageY + cfg.spawnOffsetY;
    this.width = cfg.displayWidth;
    this.height = cfg.displayHeight;
    this.type = "radarBuilding";
    this.zIndex = cfg.zIndex;

    this.rotorSprite = new SpriteFrameUtility(cfg.spriteSheet, cfg.totalFrames, cfg.totalFrames, 1);

    // Tower sprite — static, drawn relative to rotor position
    this.towerCfg = cfg.tower;
    this.towerSprite = new SpriteFrameUtility(cfg.tower.spriteSheet, 1, 1, 1);

    this.currentFrame = 0;
    this.frameTimer = 0;
    this.frameDuration = cfg.animDuration / cfg.totalFrames;
  }

  update(deltaTime) {
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    this.frameTimer += dt;
    while (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.currentFrame = (this.currentFrame + 1) % this.rotorSprite.totalFrames;
    }
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Draw tower first (behind rotor)
    if (this.towerSprite.isFrameLoaded()) {
      const tX = drawX + this.towerCfg.offsetX;
      const tY = drawY + this.towerCfg.offsetY;
      this.towerSprite.drawFrame(ctx, 0, tX, tY, this.towerCfg.displayWidth, this.towerCfg.displayHeight);
    }

    // Draw rotor on top
    if (this.rotorSprite.isFrameLoaded()) {
      this.rotorSprite.drawFrame(ctx, this.currentFrame, drawX, drawY, this.width, this.height);
    }

    ctx.restore();
  }

  getObjects() { return [this]; }
}