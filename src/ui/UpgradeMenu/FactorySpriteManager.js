import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";
import { SpriteFrameUtility } from "../../utils/SpriteFrameUtility";
export class FactorySpriteManager {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
    this.factorySprites = {};
    this.spritePaths = config.SPRITES.spritePaths;
    this.spriteFrames = config.SPRITES.spriteFrames;
    this.loadSprites();
  }

  loadSprites() {
    for (const [type, path] of Object.entries(this.spritePaths)) {
      this.factorySprites[type] = new SpriteFrameUtility(path, this.spriteFrames);
    }
  }

  getSprite(factoryType) {
    return this.factorySprites[factoryType];
  }

  isSpriteLoaded(factoryType) {
    const sprite = this.getSprite(factoryType);
    return sprite && sprite.isFrameLoaded();
  }
}