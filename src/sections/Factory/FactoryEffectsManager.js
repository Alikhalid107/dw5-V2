import { FactoryEffect } from "../../gameObjects/FactoryEffect.js";

export class FactoryEffectsManager {
  constructor(factory, effectsConfig = {}) {
    this.factory = factory;
    this.effectsConfig = effectsConfig;
    this.effects = [];
    this.createEffects();
  }

  createEffects() {
    Object.entries(this.effectsConfig).forEach(([key, config]) => {
      if (Array.isArray(config)) {
        config.forEach((cfg, index) => {
          const effect = new FactoryEffect(
            this.factory.x, this.factory.y,
            cfg.width, cfg.height, 
            this.factory.zIndex + (cfg.zIndex || 0),
            cfg.image,
            { ...cfg, type: `${key}_${index}`, effectType: key }
          );
          this.effects.push(effect);
        });
      } else {
        const effect = new FactoryEffect(
          this.factory.x, this.factory.y,
          config.width, config.height,
          this.factory.zIndex + (config.zIndex || 0),
          config.image,
          { ...config, type: key, effectType: key }
        );
        this.effects.push(effect);
      }
    });
  }

  update(deltaTime) {
    this.effects.forEach(effect => {
      effect.updatePosition(this.factory.x, this.factory.y);
      if (effect.visible) {
        effect.update(deltaTime);
      }
    });
  }

  updateVisuals() {
    this.effects.forEach(effect => {
      effect.updateZIndex(this.factory.zIndex);
    });
  }

  getObjects() {
    return this.effects.filter(effect => effect && effect.visible);
  }

  setEffectVisibility(effectType, visible) {
    this.effects
      .filter(effect => effect.effectType === effectType)
      .forEach(effect => effect.setVisibility(visible));
  }

  restartAnimations() {
    this.effects.forEach(effect => effect.restart());
  }

  destroy() {
    this.effects.forEach(effect => {
      if (effect.image) {
        effect.image.onload = null;
        effect.image.src = '';
      }
    });
    this.effects = [];
  }
}