import { FLAK_CONFIG } from '../config/FlakConfig.js';

export class FlakBuildSystem {
  constructor() {
    this.building = false;
    this.buildTimer = 0;
    this.buildDuration = FLAK_CONFIG.BUILD_DURATION;
  }

  startBuilding(canBuildCallback) {
    if (this.building || !canBuildCallback()) return false;
    this.building = true;
    this.buildTimer = this.buildDuration;
    return true;
  }

  update(deltaTime) {
    if (!this.building) return false;
    const dtMs = (typeof deltaTime === "number" && deltaTime < 1) ? deltaTime * 1000 : deltaTime;
    this.buildTimer -= dtMs;
    if (this.buildTimer <= 0) {
      this.completeBuild();
      return true;
    }
    return false;
  }

  completeBuild() {
    this.building = false;
    this.buildTimer = 0;
  }

  // ---------- public getters ----------
  isBuilding() { 
    return this.building; 
  }
  
  getBuildProgress() { 
    return this.building ? Math.min(1, Math.max(0, 1 - (this.buildTimer / this.buildDuration))) : 0; 
  }
  
  getRemainingBuildTime() { 
    return this.building ? Math.ceil(this.buildTimer / 1000) : 0; 
  }
}