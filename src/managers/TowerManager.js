import { TowerPanel } from "../ui/TowerPanel/TowerPanel.js";
import { TowerBuilding } from "../gameObjects/TowerBuilding.js";

export class TowerManager {
  constructor(baseX, baseY, garageX, garageY, garageWidth, garageHeight, cfg = {}) {
    this.baseX = baseX; this.baseY = baseY;
    this.garageX = garageX; this.garageY = garageY;
    this.garageWidth = garageWidth; this.garageHeight = garageHeight;
    this.cfg = cfg;

    this.panel = new TowerPanel(baseX, baseY, cfg);  // ← pass cfg
    this.showGrid = false;
    this.militaryBuilding = null;
    this.militaryBuildingRight = null;
    this.radarBuilding = null;
    this.jammerBuilding = null;
    this.detectorBuilding = null;
    this.panel.setTowerManager(this);
  }

  // ── Input ──────────────────────────────────────────────────────────────────

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;

    switch (clickedBox.index) {
      case 0: return this.handleMilitaryClick();
      case 1: return this.handleOneShotClick("radarBuilding",    "radar");
      case 2: return this.handleOneShotClick("jammerBuilding",   "jammer");
      case 3: return this.handleOneShotClick("detectorBuilding", "detector");
    }
    return false;
  }

  // ── Click handlers ─────────────────────────────────────────────────────────

  // Radar, jammer, detector are all "place once" buildings — unified into one handler.
  handleOneShotClick(prop, buildingKey) {
  if (this[prop]) return false;
  this[prop] = new TowerBuilding(this.garageX, this.garageY, buildingKey, this.cfg.buildings);
  return true;
}

  handleMilitaryClick() {
  if (!this.militaryBuilding) {
    this.militaryBuilding = new TowerBuilding(this.garageX, this.garageY, "left", this.cfg.buildings);
    return true;
  }
  if (!this.militaryBuilding.isMaxLevel()) { this.militaryBuilding.upgrade(); return true; }
  if (!this.militaryBuildingRight) {
    this.militaryBuildingRight = new TowerBuilding(this.garageX, this.garageY, "right", this.cfg.buildings);
    return true;
  }
  if (!this.militaryBuildingRight.isMaxLevel()) { this.militaryBuildingRight.upgrade(); return true; }
  return false;
}

  // ── Scene ──────────────────────────────────────────────────────────────────

  getObjects() {
    return [
      this.militaryBuilding,
      this.militaryBuildingRight,
      this.radarBuilding,
      this.jammerBuilding,
      this.detectorBuilding,
    ].filter(Boolean).flatMap(b => b.getObjects());
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
    // Only rotor-type buildings need update() — TowerBuilding.update() is a no-op for others
    this.radarBuilding?.update(deltaTime);
    this.detectorBuilding?.update(deltaTime);
  }
}