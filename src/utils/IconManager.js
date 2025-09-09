import { SpriteFrameUtility } from './SpriteFrameUtility.js';
import { UI_ICONS_CONFIG } from '../config/UIIconsConfig.js';

export class IconManager {
  constructor() {
    this.spriteUtil = new SpriteFrameUtility(
      UI_ICONS_CONFIG.SPRITE_PATH,
      UI_ICONS_CONFIG.TOTAL_FRAMES,
      UI_ICONS_CONFIG.COLS,
      UI_ICONS_CONFIG.ROWS
    );
  }

  // Easy methods for common usage
  drawCheckMark(ctx, x, y, size = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('CHECK_MARK');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, size, size);
  }

  drawCrossMark(ctx, x, y, size = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('CROSS_MARK');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, size, size);
  }

  drawConcreteIcon(ctx, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('CONCRETE_MIXER');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  drawSteelIcon(ctx, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('STEEL_FURNACE');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  drawCarbonIcon(ctx, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('CARBON_PLANT');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  drawOilIcon(ctx, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('OIL_REFINERY');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  drawCrane(ctx, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('CRANE');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  drawGear(ctx, x, y, size = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('GEAR');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, size, size);
  }

  drawExplosion(ctx, x, y, size = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex('EXPLOSION');
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, size, size);
  }

  // Generic method for any frame
  drawIcon(ctx, iconName, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex(iconName);
    this.spriteUtil.drawFrame(ctx, frameIndex, x, y, width, height);
  }

  // Check if icons are loaded
  isLoaded() {
    return this.spriteUtil.isFrameLoaded();
  }

  // Get bounds for click detection
  getIconBounds(iconName, x, y, width = null, height = null) {
    const frameIndex = UI_ICONS_CONFIG.getFrameIndex(iconName);
    return this.spriteUtil.getFrameBounds(frameIndex, x, y, width, height);
  }
}