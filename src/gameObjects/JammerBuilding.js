import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";

export class JammerBuilding {
  constructor(garageX, garageY) {
    const cfg = TOWER_PANEL_CONFIG.BUILDING.jammer;

    this.x = garageX + cfg.spawnOffsetX;
    this.y = garageY + cfg.spawnOffsetY;
    this.width = cfg.displayWidth;
    this.height = cfg.displayHeight;
    this.type = "jammerBuilding";
    this.zIndex = cfg.zIndex ?? -88;

    this.sprite = new SpriteFrameUtility(cfg.spriteSheet, 1, 1, 1);
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.sprite.isFrameLoaded()) return;

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    this.sprite.drawFrame(ctx, 0, drawX, drawY, this.width, this.height);
    ctx.restore();
  }

  getObjects() { return [this]; }
}