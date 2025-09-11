// FactorySpriteManager.js - Handles factory sprite loading and management
import { SpriteFrameUtility } from '../../utils/SpriteFrameUtility.js';
export class FactorySpriteManager {
  constructor() {
    this.factorySprites = {};
    this.spritePaths = {
      'concrete': 'concreteFactory.png',
      'steel': 'steelFactory.png',
      'carbon': 'carbonFactory.png',
      'oil': 'oilFactory.png'
    };
    this.loadSprites();
  }

  loadSprites() {
    for (const [type, path] of Object.entries(this.spritePaths)) {
      this.factorySprites[type] = new SpriteFrameUtility(path, 10);
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