import { SpriteFrameUtility } from "../utils/SpriteFrameUtility.js";
import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";

/**
 * TowerBuilding — single class for all tower buildings, replacing the four
 * separate files (MilitaryBuilding, RadarBuilding, DetectorBuilding, JammerBuilding).
 *
 * Mirrors the ExtensionBuilding pattern exactly: one class, config-driven via
 * a buildingKey string. Internally branches only where behaviour genuinely
 * differs (rotor+tower sprite pair vs single sprite, levelled vs one-shot).
 *
 * Usage:
 *   new TowerBuilding(baseX, baseY, "left")       → left military building
 *   new TowerBuilding(baseX, baseY, "right")      → right military building
 *   new TowerBuilding(baseX, baseY, "radar")      → radar (rotor + tower)
 *   new TowerBuilding(baseX, baseY, "jammer")     → jammer
 *   new TowerBuilding(baseX, baseY, "detector")   → detector (rotor + tower)
 */
export class TowerBuilding {
  constructor(garageX, garageY, buildingKey) {
    const cfg = TOWER_PANEL_CONFIG.BUILDING[buildingKey];

    this.x           = garageX + cfg.spawnOffsetX;
    this.y           = garageY + cfg.spawnOffsetY;
    this.width       = cfg.displayWidth;
    this.height      = cfg.displayHeight;
    this.buildingKey = buildingKey;
    this.type        = "towerBuilding_" + buildingKey;
    this.zIndex      = cfg.zIndex;

    // Levelled buildings (left / right military)
    this.level    = 1;
    this.maxLevel = cfg.maxLevel ?? null;

    // Primary sprite
    this.sprite = new SpriteFrameUtility(
      cfg.spriteSheet, cfg.totalFrames ?? 1, cfg.totalFrames ?? 1, 1
    );

    // Rotor+tower buildings (radar / detector) have a secondary static tower sprite
    this.isRotorType = !!cfg.tower;
    if (this.isRotorType) {
      this.towerCfg    = cfg.tower;
      this.towerSprite = new SpriteFrameUtility(cfg.tower.spriteSheet, 1, 1, 1);
      this.currentFrame  = 0;
      this.frameTimer    = 0;
      this.frameDuration = cfg.animDuration / cfg.totalFrames;
    }
  }

  // ── Levelled buildings only ──────────────────────────────────────────────────

  upgrade() {
    if (!this.maxLevel || this.level >= this.maxLevel) return false;
    this.level++;
    return true;
  }

  isMaxLevel() {
    if (!this.maxLevel) return true; // one-shot buildings (radar/jammer/detector) are "placed" not levelled
    return this.level >= this.maxLevel;
  }

  getCurrentFrame() {
    return this.level - 1;
  }

  // ── Update (rotor buildings only) ────────────────────────────────────────────

  update(deltaTime) {
    if (!this.isRotorType) return;
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    this.frameTimer += dt;
    while (this.frameTimer >= this.frameDuration) {
      this.frameTimer -= this.frameDuration;
      this.currentFrame = (this.currentFrame + 1) % this.sprite.totalFrames;
    }
  }

  // ── Draw ─────────────────────────────────────────────────────────────────────

  draw(ctx, offsetX = 0, offsetY = 0) {
    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (this.isRotorType) {
      // Tower behind rotor
      if (this.towerSprite.isFrameLoaded()) {
        const tX = drawX + this.towerCfg.offsetX;
        const tY = drawY + this.towerCfg.offsetY;
        this.towerSprite.drawFrame(ctx, 0, tX, tY, this.towerCfg.displayWidth, this.towerCfg.displayHeight);
      }
      if (this.sprite.isFrameLoaded()) {
        this.sprite.drawFrame(ctx, this.currentFrame, drawX, drawY, this.width, this.height);
      }
    } else {
      // Static or levelled single sprite
      if (this.sprite.isFrameLoaded()) {
        const frame = this.maxLevel ? this.getCurrentFrame() : 0;
        this.sprite.drawFrame(ctx, frame, drawX, drawY, this.width, this.height);
      }
    }

    ctx.restore();
  }

  getObjects() { return [this]; }
}