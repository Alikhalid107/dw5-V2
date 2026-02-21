import { TowerPanel } from "../gameObjects/TowerPanel.js";
import { MilitaryBuilding } from "../gameObjects/MilitaryBuilding.js";
import { RadarBuilding } from "../gameObjects/RadarBuilding.js";
import { JammerBuilding } from "../gameObjects/JammerBuilding.js";
import { DetectorBuilding } from "../gameObjects/DetectorBuilding.js";

export class TowerManager {
  constructor(baseX, baseY, garageX, garageY, garageWidth, garageHeight) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.panel = new TowerPanel(baseX, baseY);
    this.showGrid = false;
    this.militaryBuilding = null;
    this.militaryBuildingRight = null;
    this.radarBuilding = null;
    this.jammerBuilding = null;    // ← new
    this.detectorBuilding = null;  // ← new
    this.panel.setTowerManager(this);
  }

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;

    switch (clickedBox.index) {
      case 0: return this.handleMilitaryClick();
      case 1: return this.handleRadarClick();
      case 2: return this.handleJammerClick();    // ← new
      case 3: return this.handleDetectorClick();  // ← new
    }
    return false;
  }

  handleJammerClick() {
    if (this.jammerBuilding) {
      console.log("Jammer already placed");
      return false;
    }
    this.jammerBuilding = new JammerBuilding(this.garageX, this.garageY);
    console.log("Jammer building spawned");
    return true;
  }

  handleDetectorClick() {
    if (this.detectorBuilding) {
      console.log("Detector already placed");
      return false;
    }
    this.detectorBuilding = new DetectorBuilding(this.garageX, this.garageY);
    console.log("Detector building spawned");
    return true;
  }

  handleRadarClick() {
    if (this.radarBuilding) {
      console.log("Radar already placed");
      return false;
    }
    this.radarBuilding = new RadarBuilding(this.garageX, this.garageY);
    return true;
  }

  handleMilitaryClick() {
    if (!this.militaryBuilding) {
      this.militaryBuilding = new MilitaryBuilding(this.garageX, this.garageY, this.garageWidth, this.garageHeight, "left");
      return true;
    }
    if (!this.militaryBuilding.isMaxLevel()) {
      this.militaryBuilding.upgrade();
      return true;
    }
    if (!this.militaryBuildingRight) {
      this.militaryBuildingRight = new MilitaryBuilding(this.garageX, this.garageY, this.garageWidth, this.garageHeight, "right");
      return true;
    }
    if (!this.militaryBuildingRight.isMaxLevel()) {
      this.militaryBuildingRight.upgrade();
      return true;
    }
    return false;
  }

  getObjects() {
    const objects = [];
    if (this.militaryBuilding) objects.push(...this.militaryBuilding.getObjects());
    if (this.militaryBuildingRight) objects.push(...this.militaryBuildingRight.getObjects());
    if (this.radarBuilding) objects.push(...this.radarBuilding.getObjects());
    if (this.jammerBuilding) objects.push(...this.jammerBuilding.getObjects());
    if (this.detectorBuilding) objects.push(...this.detectorBuilding.getObjects());
    return objects;
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
    this.radarBuilding?.update(deltaTime);
    this.detectorBuilding?.update(deltaTime);  // ← new
  }
}