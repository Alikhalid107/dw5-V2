import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { EXTENSION_PANEL_CONFIG } from "../config/ExtensionPanelConfig.js";

export class ExtensionBuilding {
  constructor(garageX, garageY, buildingKey) {
    const cfg = EXTENSION_PANEL_CONFIG.BUILDING[buildingKey];

    this.x = garageX + cfg.spawnOffsetX;
    this.y = garageY + cfg.spawnOffsetY;
    this.width = cfg.displayWidth;
    this.height = cfg.displayHeight;
    this.level = 1;
    this.maxLevel = cfg.maxLevel;
    this.buildingKey = buildingKey;
    this.type = "extensionBuilding_" + buildingKey;
    this.zIndex = cfg.zIndex;

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

  getObjects() { return [this]; }
}