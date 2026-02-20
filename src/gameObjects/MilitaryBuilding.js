import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";

export class MilitaryBuilding {
  constructor(garageX, garageY, garageWidth, garageHeight, side = "left") {
    const cfg = TOWER_PANEL_CONFIG.BUILDING[side];

    this.x = garageX + cfg.spawnOffsetX;
    this.y = garageY + cfg.spawnOffsetY;
    this.width = cfg.displayWidth;
    this.height = cfg.displayHeight;
    this.level = 1;
    this.maxLevel = cfg.maxLevel;
    this.side = side;
    this.type = "militaryBuilding";
    this.zIndex = cfg.zIndex ;

    this.sprite = new SpriteFrameUtility(
      cfg.spriteSheet, cfg.totalFrames, cfg.totalFrames, 1
    );
  }

  upgrade() {
    if (this.level >= this.maxLevel) return false;
    this.level++;
    return true;
  }

  isMaxLevel() {
    return this.level >= this.maxLevel;
  }

  getCurrentFrame() {
    return this.level - 1;
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.sprite.isFrameLoaded()) return;

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;
    this.sprite.drawFrame(ctx, this.getCurrentFrame(), drawX, drawY, this.width, this.height);
    ctx.restore();
  }

  getObjects() {
    return [this];
  }
}