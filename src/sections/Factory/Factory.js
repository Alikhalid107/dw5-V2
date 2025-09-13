import { FactoryBuilding } from "../../gameObjects/FactoryBuilding.js";
import { FactoryProductionSystem } from "./FactoryProductionSystem.js";
import { FactoryEffectsManager } from "./FactoryEffectsManager.js";

export class Factory {
  constructor(type, properties = {}, garageX = 0, garageY = 0) {
    Object.assign(this, { 
      type, garageX, garageY, ...properties,
      maxLevel: properties.maxLevel || 15,
      zIndex: properties.zIndex ?? -97,
      x: garageX + properties.offsetX,
      y: garageY + properties.offsetY,
      isHovered: false
    });
    
    this.productionSystem = new FactoryProductionSystem();
    this.setupBuildings();
    this.effectsManager = new FactoryEffectsManager(this, properties.effects);
    this.updateVisuals();
  }

  setupBuildings() {
    this.mainBuilding = new FactoryBuilding(
      this.x, this.y, this.width, this.height, 
      this.zIndex, this.image, 10, "factory"
    );
    this.mainBuilding.factoryType = this.type;
    this.setupAdditionalBuilding();
  }

  setupAdditionalBuilding() {
    Object.assign(this, {
      additionalImage: this.additionalImage || this.image,
      additionalOffsetX: this.additionalOffsetX || Math.floor(this.width + 8),
      additionalOffsetY: this.additionalOffsetY || 0,
      additionalWidth: this.additionalWidth || Math.floor(this.width * 0.65),
      additionalHeight: this.additionalHeight || Math.floor(this.height * 0.85),
      additionalZIndex: this.additionalZIndex ?? this.zIndex
    });
  }

  update(deltaMs) {
    this.effectsManager?.update(deltaMs);
    this.productionSystem.update(deltaMs);
  }

  updateVisuals() {
    this.mainBuilding.setLevel(Math.min(this.level, 10));

    if (this.level > 10) {
      if (!this.additionalBuilding) {
        this.additionalBuilding = new FactoryBuilding(
          this.x + this.additionalOffsetX, this.y + this.additionalOffsetY,
          this.additionalWidth, this.additionalHeight,
          this.additionalZIndex, this.additionalImage, 6, "factory_additional"
        );
        this.additionalBuilding.factoryType = this.type;
      }
      this.additionalBuilding.setLevel(Math.min(this.level - 10, 6));
      this.additionalBuilding.x = this.x + this.additionalOffsetX;
      this.additionalBuilding.y = this.y + this.additionalOffsetY;
    } else {
      this.additionalBuilding = null;
    }
    this.effectsManager?.updateVisuals();
  }

  setLevel(newLevel) {
    this.level = Math.min(Math.max(newLevel, 1), this.maxLevel);
    this.updateVisuals();
  }

  setZIndex(newZIndex) {
    this.zIndex = newZIndex;
    if (this.mainBuilding) this.mainBuilding.zIndex = newZIndex;
    this.effectsManager?.updateVisuals();
  }

  getObjects() {
    const objects = [this.mainBuilding];
    if (this.additionalBuilding) objects.push(this.additionalBuilding);
    if (this.effectsManager) objects.push(...this.effectsManager.getObjects());
    return objects;
  }

  // Production proxy methods
  startProduction(hours) { return this.productionSystem.startProduction(hours); }
  cancelProduction() { this.productionSystem.cancelProduction(); }
  get isProducing() { return this.productionSystem.isProducing; }
  getFormattedProductionTime() { return this.productionSystem.getFormattedProductionTime(); }

  // Visual effect methods  
  showEffect(effectType) { this.effectsManager?.setEffectVisibility(effectType, true); }
  hideEffect(effectType) { this.effectsManager?.setEffectVisibility(effectType, false); }
  restartEffectAnimations() { this.effectsManager?.restartAnimations(); }

  // Utility methods
  isMaxLevel() { return this.level >= this.maxLevel; }
  isPointInside(x, y) {
    if (x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height) {
      return true;
    }
    if (this.additionalBuilding) {
      const ax = this.x + this.additionalOffsetX;
      const ay = this.y + this.additionalOffsetY;
      return x >= ax && x <= ax + this.additionalWidth && y >= ay && y <= ay + this.additionalHeight;
    }
    return false;
  }

  getCombinedBounds() {
    let bounds = { x: this.x, y: this.y, width: this.width, height: this.height };
    if (this.additionalBuilding) {
      const ax = this.x + this.additionalOffsetX;
      const ay = this.y + this.additionalOffsetY;
      const left = Math.min(bounds.x, ax);
      const top = Math.min(bounds.y, ay);
      const right = Math.max(bounds.x + bounds.width, ax + this.additionalWidth);
      const bottom = Math.max(bounds.y + bounds.height, ay + this.additionalHeight);
      bounds = { x: left, y: top, width: right - left, height: bottom - top };
    }
    return bounds;
  }

  destroy() { 
    this.effectsManager?.destroy(); 
    this.effectsManager = null; 
  }
}