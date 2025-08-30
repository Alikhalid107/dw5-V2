import { BaseSection } from "../sections/BaseSection.js";
import { GarageSection } from "../sections/GarageSection.js";
import { FlakManager } from "../sections/FlakManager.js";
import { WallSection } from "../sections/WallSection.js";
import { FlagManager } from "../sections/FlagManager.js";
import { FactoryManager } from "../sections/FactoryManager.js";


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

    // Base + Tree
    const baseSection = new BaseSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...baseSection.getObjects());

    // Garage
    const garageSection = new GarageSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...garageSection.getObjects());

    // Flaks
    const flakManager = new FlakManager(
      garageSection.getGarageX(),
      garageSection.getGarageY(),
      garageSection.getGarageWidth(),
      garageSection.getGarageHeight()
    );
    objects.push(...flakManager.getObjects());

    // Walls
    const wallSection = new WallSection(randX, randY, this.baseWidth, this.baseHeight);
    objects.push(...wallSection.getObjects());

    // Flags (spawn relative to garage)
    const flagManager = new FlagManager(
      garageSection.getGarageX(),
      garageSection.getGarageY(),
      garageSection.getGarageWidth(),
      garageSection.getGarageHeight()
    );
    objects.push(...flagManager.getObjects());

    // Factories (spawn relative to garage)
    const factoryManager = new FactoryManager(
      garageSection.getGarageX(),
      garageSection.getGarageY(),
      garageSection.getGarageWidth(),
      garageSection.getGarageHeight()
    );
    objects.push(...factoryManager.getObjects());

    // Save references
    this.baseSection = baseSection;
    this.garageSection = garageSection;
    this.flakManager = flakManager;
    this.wallSection = wallSection;
    this.flagManager = flagManager;
    this.factoryManager = factoryManager;

    return objects;
  }

  getObjects() {
    return this.objects;
  }

  // Update dynamic objects
  update(deltaTime) {
    if (this.flagManager) {
      this.flagManager.update(deltaTime);
    }

    // Update FlakManager and handle upgrades
    if (this.flakManager?.update) {
      if (this.flakManager.update(deltaTime)) {
        // Flak upgrade completed, update objects array
        this.updateFlakObjects();
      }
    }

    if (this.factoryManager) {
      this.factoryManager.update(deltaTime);
    }

    // Handle factory level changes dynamically
    if (this.factoryManager) {
      const currentFactoryObjects = this.factoryManager.getObjects();
      
      // Check if factory objects have changed
      const currentFactoryCount = this.objects.filter(obj => 
        obj.type === "factory" || obj.type === "factory_additional"
      ).length;
      
      if (currentFactoryCount !== currentFactoryObjects.length) {
        this.objects = this.objects.filter(obj => 
          obj.type !== "factory" && obj.type !== "factory_additional"
        );
        this.objects.push(...currentFactoryObjects);
      }
    }
  }

  // Update flak objects in the main objects array when flak level changes
  updateFlakObjects() {
    // Remove old flak objects
    this.objects = this.objects.filter(obj => !(obj instanceof Flak));
    
    // Add new flak objects
    this.objects.push(...this.flakManager.getObjects());
  }

  // Handle mouse movement for factory hover detection
  handleMouseMove(mouseX, mouseY) {
    if (this.factoryManager) {
      this.factoryManager.handleMouseMove(mouseX, mouseY);
    }
  }

  // Handle mouse clicks for factory upgrades
  handleClick(mouseX, mouseY) {
    if (this.factoryManager) {
      return this.factoryManager.handleClick(mouseX, mouseY);
    }
    return false;
  }

  // Draw UI elements (call this after drawing all objects)
  drawUI(ctx, offsetX, offsetY) {
    if (this.factoryManager) {
      this.factoryManager.drawUI(ctx, offsetX, offsetY);
    }
  }

  // Factory-related helper methods
  getFactoryLevel(factoryType) {
    return this.factoryManager?.getFactoryLevel(factoryType) || 0;
  }

  getAllFactoryLevels() {
    return this.factoryManager?.getAllFactoryLevels() || {};
  }

  upgradeFactory(factoryType) {
    return this.factoryManager?.startUpgrade(factoryType) || false;
  }

  // FlakManager helper methods
  getFlakLevel() {
    return this.flakManager?.getLevel() || 1;
  }

  upgradeFlak() {
    if (this.flakManager?.startUpgrade()) {
      return true;
    }
    return false;
  }

  isFlakUpgrading() {
    return this.flakManager?.isUpgrading() || false;
  }

  getFlakUpgradeProgress() {
    return this.flakManager?.getUpgradeProgress() || 0;
  }

  getRemainingFlakUpgradeTime() {
    return this.flakManager?.getRemainingUpgradeTime() || 0;
  }

  getCurrentFlakCount() {
    return this.flakManager?.getCurrentFlakCount() || 2;
  }

  isFlakMaxLevel() {
    return this.flakManager?.isMaxLevel() || false;
  }

  // Existing proxy helper methods (Flaks + Walls)
  setFlakScale(newScale) {
    this.flakManager.setFlakScale(newScale);
    this.updateFlakObjects(); // Update objects array after scale change
  }

  getTotalFlakCount() {
    return this.flakManager.getTotalFlakCount();
  }

  getAllFlaks() {
    return this.flakManager.getAllFlaks();
  }

  updateFlakRowConfig(rowIndex, newConfig) {
    this.flakManager.updateFlakRowConfig(rowIndex, newConfig);
  }

  toggleFlakRows() {
    this.flakManager.toggleFlakRows();
  }

  setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY) {
    this.wallSection.setWallOffsets(leftOffsetX, leftOffsetY, rightOffsetX, rightOffsetY);
  }

  getLeftWall() {
    return this.wallSection.getLeftWall();
  }

  getRightWall() {
    return this.wallSection.getRightWall();
  }
}