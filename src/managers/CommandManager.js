import { CommandPanel } from "../ui/CommandPanel/CommandPanel.js";
import { CommandBuilding } from "../gameObjects/CommandBuilding.js";

export class CommandManager {
  constructor(baseX, baseY, garageX, garageY, compositeBase = null) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.garageX = garageX;
    this.garageY = garageY;
    this.compositeBase = compositeBase;  // ← for destroy base (box 2)
    this.panel = new CommandPanel(baseX, baseY);
    this.showGrid = false;
    this.panel.setCommandManager(this);

    this.commandBuilding = null;
  }

  handleMouseMove(mouseX, mouseY) {
    this.panel.updateHover(mouseX, mouseY);
    this.showGrid = this.panel.isVisible;
    if (this.panel.isVisible) {
      this.panel.components.update(0); // hover state driven
    }
  }

  handleClick(mouseX, mouseY) {
    const clickedBox = this.panel.handleClick(mouseX, mouseY);
    if (!clickedBox) return false;

    switch (clickedBox.index) {
      case 0: return this.handleCommandCenterClick();
      case 1: console.log("Oil pump clicked — functionality pending"); return true;
      case 2: return this.handleDestroyBase();
      case 3: console.log("Crane clicked — functionality pending"); return true;
      case 4: console.log("Clock clicked — functionality pending"); return true;
    }
    return false;
  }

  handleCommandCenterClick() {
    if (!this.commandBuilding) {
      this.commandBuilding = new CommandBuilding(this.garageX, this.garageY);
      return true;
    }
    if (this.commandBuilding.isMaxLevel()) return false;
    this.commandBuilding.upgrade();
    return true;
  }

  handleDestroyBase() {
    if (!this.compositeBase) return false;
    // Hide all objects
    this.compositeBase.objects.forEach(obj => {
      if (obj) obj.visible = false;
    });
    this.compositeBase.destroyed = true;
    console.log("Base destroyed");
    return true;
  }

  update(deltaTime) {
    if (this.panel.isVisible) {
      this.panel.components.update(deltaTime);
    }
  }

  drawUI(ctx, offsetX, offsetY) {
    this.panel.draw(ctx, offsetX, offsetY);
  }

  getObjects() {
    const objects = [];
    if (this.commandBuilding) objects.push(...this.commandBuilding.getObjects());
    return objects;
  }
}