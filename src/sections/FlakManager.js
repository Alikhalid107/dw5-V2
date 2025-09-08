import { Flak } from "../gameObjects/Flak.js";
import { FLAK_CONFIG } from '../config/FlakConfig.js';
import { FlakPositioning } from '../utils/FlakPositioning.js';
import { FlakBuildSystem } from './FlakBuildSystem.js';

export class FlakManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    this.flakScaleFactor = FLAK_CONFIG.DEFAULT_SCALE_FACTOR;
    this.currentFlakCount = 0;
    this.maxFlakCapacity = FLAK_CONFIG.MAX_FLAK_CAPACITY;
    this.objects = [];

    // Composition: delegate positioning and building logic
    this.positioning = new FlakPositioning(garageX, garageY, garageWidth, garageHeight);
    this.buildSystem = new FlakBuildSystem();

    this.initializeFirstFlaks();
  }

  // ---------- flak creation ----------
  createFlakAt(side, rowIndex) {
    const positionData = this.positioning.calculateFlakPosition(side, rowIndex, this.currentFlakCount);
    const f = new Flak(0, positionData.baseY, this.flakScaleFactor);
    f.zIndex = positionData.zIndex;
    f.type = "flak";

    this.positioning.scheduleAsyncPositioning(f, positionData.getTargetX);

    this.objects.push(f);
    this.currentFlakCount++;
    return f;
  }

  // ---------- init ----------
  initializeFirstFlaks() {
    this.createFlakAt("left", 0);
    this.createFlakAt("right", 0);
  }

  // ---------- build flow ----------
  startBuilding() {
    return this.buildSystem.startBuilding(() => this.canBuild());
  }

  update(deltaTime) {
    const buildCompleted = this.buildSystem.update(deltaTime);
    if (buildCompleted) {
      this.addNewFlak();
    }
    return buildCompleted;
  }

  addNewFlak() {
    if (this.currentFlakCount >= this.maxFlakCapacity) return false;

    const suggestedRow = Math.max(0, this.positioning.getCurrentRowIndex(this.currentFlakCount));
    const rowIndex = this.positioning.findRowWithSpace(this.currentFlakCount, suggestedRow);
    if (rowIndex === -1) return false;

    const side = this.positioning.determineSideForNewFlak(rowIndex, this.currentFlakCount);
    if (!side) return false;

    this.createFlakAt(side, rowIndex);
    return true;
  }

  cleanup() {
    this.positioning.cleanup();
    this.objects = [];
  }

  // ---------- public getters / setters ----------
  isBuilding() { return this.buildSystem.isBuilding(); }
  getBuildProgress() { return this.buildSystem.getBuildProgress(); }
  getRemainingBuildTime() { return this.buildSystem.getRemainingBuildTime(); }
  canBuild() { return !this.buildSystem.isBuilding() && this.currentFlakCount < this.maxFlakCapacity; }
  getMaxFlakCapacity() { return this.maxFlakCapacity; }

  getObjects() { return this.objects || []; }
  getAllFlaks() { return this.objects.filter(o => o?.type === "flak" || o?.constructor?.name === "Flak"); }
  getCurrentFlakCount() { return this.getAllFlaks().length; }
  getTotalFlakCount() { return this.currentFlakCount; }

  setFlakScale(scale) {
    const targetCount = this.currentFlakCount;
    this.flakScaleFactor = scale;
    this.cleanup();
    this.currentFlakCount = 0;
    this.initializeFirstFlaks();
    while (this.currentFlakCount < targetCount) {
      if (!this.addNewFlak()) break;
    }
  }

  updateFlakRowConfig(index, newConfig) {
    if (index >= 0 && index < FLAK_CONFIG.ROWS.length) {
      FLAK_CONFIG.ROWS[index] = { ...FLAK_CONFIG.ROWS[index], ...newConfig };
    }
  }
}