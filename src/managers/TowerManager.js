import { TowerPanel } from "../gameObjects/TowerPanel.js";
import { MilitaryBuilding } from "../gameObjects/MilitaryBuilding.js";

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
    this.militaryBuilding = null;      // left building
    this.militaryBuildingRight = null; // right building — spawns after left is maxed
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
      case 1: console.log("Radar clicked"); return true;
      case 2: console.log("Jammer clicked"); return true;
      case 3: console.log("Detector clicked"); return true;
    }
    return false;
  }

  handleMilitaryClick() {
    // Phase 1 — left building not yet maxed
    if (!this.militaryBuilding) {
      this.militaryBuilding = new MilitaryBuilding(
        this.garageX, this.garageY,
        this.garageWidth, this.garageHeight,
        "left"
      );
      console.log("Left military building spawned at level 1");
      return true;
    }

    if (!this.militaryBuilding.isMaxLevel()) {
      this.militaryBuilding.upgrade();
      console.log(`Left military building level ${this.militaryBuilding.level}`);
      return true;
    }

    // Phase 2 — left is maxed, now handle right building
    if (!this.militaryBuildingRight) {
      this.militaryBuildingRight = new MilitaryBuilding(
        this.garageX, this.garageY,
        this.garageWidth, this.garageHeight,
        "right"
      );
      console.log("Right military building spawned at level 1");
      return true;
    }

    if (!this.militaryBuildingRight.isMaxLevel()) {
      this.militaryBuildingRight.upgrade();
      console.log(`Right military building level ${this.militaryBuildingRight.level}`);
      return true;
    }

    console.log("Both military buildings are max level");
    return false;
  }

  getObjects() {
    const objects = [];
    if (this.militaryBuilding) objects.push(...this.militaryBuilding.getObjects());
    if (this.militaryBuildingRight) objects.push(...this.militaryBuildingRight.getObjects());
    return objects;
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
  }
}