import { BaseSection } from "../sections/BaseSection.js";
import { GarageSection } from "../sections/GarageSection.js";
import { FlakManager } from "../sections/FlakManager.js";
import { WallSection } from "../sections/WallSection.js";
import { FlagManager } from "../sections/FlagManager.js";
import { FactoryManager } from "../sections/FactoryManager.js";
import { GarageUI } from "./GarageUI.js";

export class CompositeBase {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.baseWidth = 1500;
    this.baseHeight = 500;
    this.objects = this.createCompositeBase();
  }

  createCompositeBase() {
    const randX = Math.floor(Math.random() * (this.worldWidth - this.baseWidth));
    const randY = Math.floor(Math.random() * (this.worldHeight - this.baseHeight));
    const objects = [];

    // Create sections
    this.baseSection = new BaseSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...this.baseSection.getObjects());

    this.garageSection = new GarageSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...this.garageSection.getObjects());

    // Create managers using garage bounds
    const gx = this.garageSection.getGarageX();
    const gy = this.garageSection.getGarageY();
    const gw = this.garageSection.getGarageWidth();
    const gh = this.garageSection.getGarageHeight();

    this.flakManager = new FlakManager(gx, gy, gw, gh);
    objects.push(...this.flakManager.getObjects());

    this.garageUI = new GarageUI(this.flakManager, gx, gy, gw, gh);

    this.wallSection = new WallSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...this.wallSection.getObjects());

    this.flagManager = new FlagManager(gx, gy, gw, gh);
    objects.push(...this.flagManager.getObjects());

    this.factoryManager = new FactoryManager(gx, gy, gw, gh);
    objects.push(...this.factoryManager.getObjects());

    return objects;
  }

  getObjects() { return this.objects; }

  update(deltaTime) {
    this.flagManager?.update(deltaTime);
    this.garageUI?.update(deltaTime);
    this.factoryManager?.update(deltaTime);

    if (this.flakManager?.update) {
      const buildCompleted = this.flakManager.update(deltaTime);
      if (buildCompleted) this.updateFlakObjects();
    }

    this.updateFactoryObjects();
  }

  updateFlakObjects() {
    this.objects = this.objects.filter(obj => 
      obj && obj.type !== "flak" && obj.constructor?.name !== "Flak"
    );
    this.objects.push(...(this.flakManager?.getObjects() || []));
  }

  updateFactoryObjects() {
    if (!this.factoryManager) return;
    
    const currentFactoryObjects = this.factoryManager.getObjects();
    const currentCount = this.objects.filter(obj => 
      obj.type === "factory" || obj.type === "factory_additional"
    ).length;
    
    if (currentCount !== currentFactoryObjects.length) {
      this.objects = this.objects.filter(obj => 
        obj.type !== "factory" && obj.type !== "factory_additional"
      );
      this.objects.push(...currentFactoryObjects);
    }
  }

  handleMouseMove(mouseX, mouseY) {
    this.factoryManager?.handleMouseMove?.(mouseX, mouseY);
    this.garageUI?.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    if (this.factoryManager?.handleClick?.(mouseX, mouseY)) return true;
    return this.garageUI?.handleClick(mouseX, mouseY) || false;
  }

  drawUI(ctx, offsetX, offsetY) {
    this.factoryManager?.drawUI?.(ctx, offsetX, offsetY);
    this.garageUI?.drawUI(ctx, offsetX, offsetY);
  }

  // Proxy methods
  getFlakCount() { return this.flakManager?.getTotalFlakCount() || 2; }
  isFlakBuilding() { return this.flakManager?.isBuilding() || false; }
  buildFlak() { return this.flakManager?.startBuilding() || false; }
  getFlakBuildProgress() { return this.flakManager?.getBuildProgress() || 0; }
  getRemainingFlakBuildTime() { return this.flakManager?.getRemainingBuildTime() || 0; }
  canBuildFlak() { return this.flakManager?.canBuild() || false; }
  getFlakCapacity() { return this.flakManager?.getMaxFlakCapacity() || 50; }
  setFlakScale(newScale) { 
    this.flakManager.setFlakScale(newScale); 
    this.updateFlakObjects(); 
  }
  getTotalFlakCount() { return this.flakManager.getTotalFlakCount(); }
  getAllFlaks() { return this.flakManager.getAllFlaks(); }
  updateFlakRowConfig(rowIndex, newConfig) { this.flakManager.updateFlakRowConfig(rowIndex, newConfig); }
  setWallOffsets(lx, ly, rx, ry) { this.wallSection.setWallOffsets(lx, ly, rx, ry); }
  getLeftWall() { return this.wallSection.getLeftWall(); }
  getRightWall() { return this.wallSection.getRightWall(); }
}