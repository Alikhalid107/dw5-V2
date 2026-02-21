import { BaseSection } from "./BaseSection.js";
import { GarageSection } from "./GarageSection.js";
import { FlakManager } from "./FlakManager.js";
import { WallSection } from "./WallSection.js";
import { FlagManager } from "../managers/FlagManager.js";
import { FactoryManager } from "../managers/FactoryManager.js";
import { GarageUI } from "../ui/GarageUI/GarageUI.js";
import { TowerManager } from "../managers/TowerManager.js";
import { BaseInputHandler } from "../utils/BaseInputHandler.js";
import { BaseObjectUpdater } from "../utils/BaseObjectUpdater.js";

export class CompositeBase {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.baseWidth = 1500;
    this.baseHeight = 500;
    
    this.initializeSections();
    this.objects = this.createCompositeBase();
    
    
    this.inputHandler = new BaseInputHandler(this.factoryManager, this.garageUI,);
    this.objectUpdater = new BaseObjectUpdater(this.flakManager, this.factoryManager);

  }

  initializeSections() {
    const randX = Math.floor(Math.random() * (this.worldWidth - this.baseWidth));
    const randY = Math.floor(Math.random() * (this.worldHeight - this.baseHeight));
    
    this.baseSection = new BaseSection(randX, randY, this.baseWidth, this.baseHeight);
    this.garageSection = new GarageSection(randX, randY, this.baseWidth, this.baseHeight);
    
    const gx = this.garageSection.getGarageX();
    const gy = this.garageSection.getGarageY();
    const gw = this.garageSection.getGarageWidth();
    const gh = this.garageSection.getGarageHeight();

    this.flakManager = new FlakManager(gx, gy, gw, gh);
    this.garageUI = new GarageUI(this.flakManager, gx, gy, gw, gh);
    
   
    
    this.wallSection = new WallSection(randX, randY, this.baseWidth, this.baseHeight);
    this.flagManager = new FlagManager(gx, gy, gw, gh);
    this.factoryManager = new FactoryManager(gx, gy, gw, gh);
this.towerManager = new TowerManager(randX, randY, gx, gy, gw, gh);  }

  createCompositeBase() {
  const objects = [];
  objects.push(...this.baseSection.getObjects());
  objects.push(...this.garageSection.getObjects());
  objects.push(...this.flakManager.getObjects());
  objects.push(...this.wallSection.getObjects());
  objects.push(...this.flagManager.getObjects());
  objects.push(...this.factoryManager.getObjects());
  objects.push(...this.towerManager.getObjects()); // ← add
  return objects;
}

  getObjects() { return this.objects; }

  update(deltaTime) {
  this.flagManager?.update(deltaTime);
  this.garageUI?.update(deltaTime);
  this.factoryManager?.update(deltaTime);
  this.towerManager?.update(deltaTime);

  if (this.towerManager?.militaryBuilding &&
      !this.objects.includes(this.towerManager.militaryBuilding)) {
    this.objects.push(this.towerManager.militaryBuilding);
  }

  if (this.towerManager?.militaryBuildingRight &&
      !this.objects.includes(this.towerManager.militaryBuildingRight)) {
    this.objects.push(this.towerManager.militaryBuildingRight);
  }

  // ← THIS WAS MISSING
  if (this.towerManager?.radarBuilding &&
      !this.objects.includes(this.towerManager.radarBuilding)) {
    this.objects.push(this.towerManager.radarBuilding);
  }
  if (this.towerManager?.jammerBuilding &&
    !this.objects.includes(this.towerManager.jammerBuilding)) {
  this.objects.push(this.towerManager.jammerBuilding);
}

if (this.towerManager?.detectorBuilding &&
    !this.objects.includes(this.towerManager.detectorBuilding)) {
  this.objects.push(this.towerManager.detectorBuilding);
}

  if (this.flakManager?.update) {
    const buildCompleted = this.flakManager.update(deltaTime);
    if (buildCompleted) {
      this.objectUpdater.updateFlakObjects(this.objects);
    }
  }

  this.objectUpdater.updateFactoryObjects(this.objects);
}

  handleMouseMove(mouseX, mouseY) {
    this.inputHandler.handleMouseMove(mouseX, mouseY);
    this.towerManager?.handleMouseMove(mouseX, mouseY);  // add in BaseInputHandler too

  }

 handleClick(mouseX, mouseY) {
  return this.inputHandler.handleClick(mouseX, mouseY) ||
         this.towerManager?.handleClick(mouseX, mouseY);  // ← add this
}

  drawUI(ctx, offsetX, offsetY) {
    this.factoryManager?.drawUI?.(ctx, offsetX, offsetY);
    this.garageUI?.drawUI(ctx, offsetX, offsetY);
    this.towerManager?.drawUI?.(ctx, offsetX, offsetY);

  }
  


  // ---------- Flak Management ----------
  getFlakCount() { return this.flakManager?.getTotalFlakCount() || 2; }
  isFlakBuilding() { return this.flakManager?.isBuilding() || false; }
  buildFlak() { 
    const result = this.flakManager?.startBuilding() || false;
    if (result) this.objectUpdater.updateFlakObjects(this.objects);
    return result;
  }
  getFlakBuildProgress() { return this.flakManager?.getBuildProgress() || 0; }
  getRemainingFlakBuildTime() { return this.flakManager?.getRemainingBuildTime() || 0; }
  canBuildFlak() { return this.flakManager?.canBuild() || false; }
  getFlakCapacity() { return this.flakManager?.getMaxFlakCapacity() || 50; }
  setFlakScale(newScale) { 
    this.flakManager?.setFlakScale(newScale);
    this.objectUpdater.updateFlakObjects(this.objects);
  }
  getTotalFlakCount() { return this.flakManager?.getTotalFlakCount() || 0; }
  getAllFlaks() { return this.flakManager?.getAllFlaks() || []; }
  updateFlakRowConfig(rowIndex, newConfig) { this.flakManager?.updateFlakRowConfig(rowIndex, newConfig); }

  // ---------- Wall Management ----------
  setWallOffsets(lx, ly, rx, ry) { this.wallSection?.setWallOffsets(lx, ly, rx, ry); }
  getLeftWall() { return this.wallSection?.getLeftWall(); }
  getRightWall() { return this.wallSection?.getRightWall(); }
}