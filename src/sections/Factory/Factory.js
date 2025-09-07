import { GameObject } from "../../core/GameObjectSystem/GameObject.js";
import { FactoryEffects } from "./FactoryEffects.js";

export class Factory {
  constructor(type, properties = {}, garageX = 0, garageY = 0) {
    Object.assign(this, { type, garageX, garageY, ...properties });
    
    this.maxLevel = this.maxLevel || 15;
    this.zIndex = this.zIndex ?? -97;
    this.x = garageX + this.offsetX;
    this.y = garageY + this.offsetY;
    
    // Production system properties
    this.isProducing = false;
    this.productionTimeRemaining = 0; // in milliseconds
    this.maxProductionTime = 15 * 60 * 60 * 1000; // 15 hours in milliseconds
    this.showProductionComplete = false;
    this.productionCompleteTimer = 0;
    
    this.setupAdditionalBuilding();
    this.mainBuilding = this.createBuilding(this.x, this.y, this.width, this.height, this.zIndex, this.image, 10, "factory");
    this.factoryEffects = new FactoryEffects(this, properties);
    this.updateVisuals();
  }

  setupAdditionalBuilding() {
    this.additionalImage = this.additionalImage || this.image;
    this.additionalOffsetX = this.additionalOffsetX || Math.floor(this.width + 8);
    this.additionalOffsetY = this.additionalOffsetY || 0;
    this.additionalWidth = this.additionalWidth || Math.floor(this.width * 0.65);
    this.additionalHeight = this.additionalHeight || Math.floor(this.height * 0.85);
    this.additionalZIndex = this.additionalZIndex ?? this.zIndex;
  }

  createBuilding(x, y, width, height, zIndex, image, totalFrames, type) {
    const building = new GameObject(x, y, width, height, zIndex, image);
    Object.assign(building, {
      type, factoryType: this.type, spriteSheet: true,
      frameWidth: width, frameHeight: height, totalFrames,
      currentFrame: 0, frameSpeed: 0, update: () => {}
    });
    return building;
  }

  update(deltaMs) {
    this.factoryEffects?.update(deltaMs);
    this.updateProduction(deltaMs);
  }

  updateProduction(deltaMs) {
    if (this.isProducing && this.productionTimeRemaining > 0) {
      this.productionTimeRemaining = Math.max(0, this.productionTimeRemaining - deltaMs);
      
      if (this.productionTimeRemaining <= 0) {
        this.completeProduction();
      }
    }

    // Handle production complete display
    if (this.showProductionComplete) {
      this.productionCompleteTimer += deltaMs;
      if (this.productionCompleteTimer >= 2000) { // Show for 2 seconds
        this.showProductionComplete = false;
        this.productionCompleteTimer = 0;
      }
    }
  }

  // Production methods
  startProduction(hours) {
    const timeMs = hours * 60 * 60 * 1000;
    
    if (!this.isProducing) {
      // Starting new production
      this.isProducing = true;
      this.productionTimeRemaining = Math.min(timeMs, this.maxProductionTime);
    } else {
      // Adding time to existing production
      this.productionTimeRemaining = Math.min(
        this.productionTimeRemaining + timeMs, 
        this.maxProductionTime
      );
    }
    
    return this.productionTimeRemaining >= this.maxProductionTime;
  }

  canStart15HourProduction() {
    return !this.isProducing;
  }

  cancelProduction() {
    this.isProducing = false;
    this.productionTimeRemaining = 0;
    this.showProductionComplete = false;
    this.productionCompleteTimer = 0;
  }

  completeProduction() {
    this.isProducing = false;
    this.productionTimeRemaining = 0;
    this.showProductionComplete = true;
    this.productionCompleteTimer = 0;
  }

  getFormattedProductionTime() {
    if (!this.isProducing || this.productionTimeRemaining <= 0) return "";
    
    const totalSeconds = Math.ceil(this.productionTimeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  updateVisuals() {
    const mainLevel = Math.min(this.level, 10);
    this.mainBuilding.level = mainLevel;
    this.mainBuilding.currentFrame = Math.max(0, mainLevel - 1);

    if (this.level > 10) {
      if (!this.additionalBuilding) {
        const ax = this.x + this.additionalOffsetX;
        const ay = this.y + this.additionalOffsetY;
        this.additionalBuilding = this.createBuilding(
          ax, ay, this.additionalWidth, this.additionalHeight, 
          this.additionalZIndex, this.additionalImage, 6, "factory_additional"
        );
      }
      const secondaryLevel = Math.min(this.level - 10, 6);
      this.additionalBuilding.level = secondaryLevel;
      this.additionalBuilding.currentFrame = Math.max(0, secondaryLevel - 1);
      this.additionalBuilding.x = this.x + this.additionalOffsetX;
      this.additionalBuilding.y = this.y + this.additionalOffsetY;
    } else {
      this.additionalBuilding = null;
    }

    this.factoryEffects?.updateVisuals();
  }

  setLevel(newLevel) {
    this.level = Math.min(Math.max(newLevel, 1), this.maxLevel);
    this.updateVisuals();
  }

  setZIndex(newZIndex) {
    this.zIndex = newZIndex;
    if (this.mainBuilding) this.mainBuilding.zIndex = newZIndex;
    this.factoryEffects?.updateVisuals();
  }

  getObjects() {
    const objects = [this.mainBuilding];
    if (this.additionalBuilding) objects.push(this.additionalBuilding);
    if (this.factoryEffects) objects.push(...this.factoryEffects.getObjects());
    return objects;
  }

  isMaxLevel() { 
    return this.level >= this.maxLevel; 
  }

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

  showEffect(effectType) { 
    this.factoryEffects?.setEffectVisibility(effectType, true); 
  }
  
  hideEffect(effectType) { 
    this.factoryEffects?.setEffectVisibility(effectType, false); 
  }
  
  restartEffectAnimations() { 
    this.factoryEffects?.restartAnimations(); 
  }

  destroy() { 
    this.factoryEffects?.destroy(); 
    this.factoryEffects = null; 
  }
}