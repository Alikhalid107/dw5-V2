import { GameObject } from "../../core/GameObjectSystem/GameObject.js";

export class FactoryEffects {
  constructor(factory, factoryProperties = {}) {
    this.factory = factory;
    this.type = factory.type;
    this.effects = [];
    this.effectsConfig = factoryProperties.effects || {};
    this._fromConfig();
  }

  _mkFrameSize(cfg) {
    // preserve original logic: if totalFrames>1 use width/totalFrames else width
    const frameW = cfg.totalFrames > 1 ? Math.floor(cfg.width / cfg.totalFrames) : cfg.width;
    return { frameWidth: frameW, frameHeight: cfg.height };
  }

  _createOne(cfg, idx = 0) {
    const { frameWidth, frameHeight } = this._mkFrameSize(cfg);
    const x = this.factory.x + (cfg.offsetX || 0);
    const y = this.factory.y + (cfg.offsetY || 0);
    const z = this.factory.zIndex + (cfg.zIndex || 0);

    const effect = new GameObject(x, y, frameWidth, frameHeight, z, cfg.image);

    if (cfg.totalFrames > 1) {
      effect.spriteSheet = true;
      effect.frameWidth = frameWidth; effect.frameHeight = frameHeight;
      effect.totalFrames = cfg.totalFrames;
      effect.currentFrame = cfg.startFrame || 0;
      effect.frameSpeed = cfg.frameSpeed || 0; // preserved name & behavior
    }

    Object.assign(effect, {
      type: `factory_effect_${cfg.type || idx}`,
      factoryType: this.factory.type,
      effectType: cfg.effectType || cfg.type,
      loop: cfg.loop !== false,
      animationComplete: false,
      visible: true,
      originalOffsetX: cfg.offsetX || 0,
      originalOffsetY: cfg.offsetY || 0,
      originalzIndex: cfg.zIndex || 0,
      originalWidth: frameWidth,
      originalHeight: frameHeight,
      startFrame: cfg.startFrame || 0
    });

    // preserve non-looping behavior by wrapping update (keeps original logic)
    if (cfg.totalFrames > 1 && cfg.loop === false) {
      const orig = effect.update.bind(effect);
      effect.update = function(deltaTime) {
        if (!this.animationComplete) {
          const prev = this.currentFrame;
          orig(deltaTime);
          if (this.currentFrame === this.totalFrames - 1 && prev !== this.currentFrame) {
            this.animationComplete = true;
          }
        }
      };
    }

    return effect;
  }

  _fromConfig() {
    Object.entries(this.effectsConfig).forEach(([k, cfg]) => {
      if (Array.isArray(cfg)) {
        cfg.forEach((c, i) => this.effects.push(this._createOne({ ...c, type: `${k}_${i}`, effectType: k }, i)));
      } else {
        this.effects.push(this._createOne({ ...cfg, type: k, effectType: k }));
      }
    });
  }

  update(deltaTime) {
    this.effects.forEach(e => {
      e.x = this.factory.x + e.originalOffsetX;
      e.y = this.factory.y + e.originalOffsetY;
      if (e.visible) e.update(deltaTime);
    });
  }

  updateVisuals() {
    this.effects.forEach(e => e.zIndex = this.factory.zIndex + (e.originalzIndex || 0));
  }

  getObjects() { return this.effects.filter(e => e && e.visible); }

  destroy() {
    this.effects.forEach(e => { if (e.image) { e.image.onload = null; e.image.src = ''; } });
    this.effects = [];
  }

  setEffectVisibility(effectType, visible) {
    this.effects.filter(e => e.effectType === effectType).forEach(e => { e.visible = visible; });
  }

  restartAnimations() {
    this.effects.filter(e => e.loop && !e.animationComplete).forEach(e => {
      e.currentFrame = e.startFrame || 0;
      e.frameTimer = 0;
      e.animationComplete = false;
    });
  }
}
