import { BaseSection } from "../BaseSection.js";
import { GarageSection } from "../GarageSection.js";
import { FlakManager } from "../../managers/FlakManager.js";
import { WallSection } from "../BaseWall/WallSection.js";
import { FlagManager } from "../../managers/FlagManager.js";
import { FactoryManager } from "../../managers/FactoryManager.js";
import { GarageUI } from "../../ui/GarageUI/GarageUI.js";
import { ObjectManager } from "./ObjectManager.js";
import { InputHandler } from "./InputHandler.js";
import { ProxyMethods } from "./ProxyMethods.js";

export class CompositeBase {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.baseWidth = 1500;
    this.baseHeight = 500;
    
    this.objectManager = new ObjectManager();
    this.inputHandler = new InputHandler();
    this.proxyMethods = new ProxyMethods();
    
    this.initializeSections();
    this.objects = this.createCompositeBase();
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
    
    // Link components
    this.proxyMethods.setManagers(this.flakManager, this.wallSection);
    this.inputHandler.setManagers(this.factoryManager, this.garageUI);
    this.objectManager.setManagers(this.flakManager, this.factoryManager);
  }

  createCompositeBase() {
    const objects = [];
    
    objects.push(...this.baseSection.getObjects());
    objects.push(...this.garageSection.getObjects());
    objects.push(...this.flakManager.getObjects());
    objects.push(...this.wallSection.getObjects());
    objects.push(...this.flagManager.getObjects());
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
      if (buildCompleted) this.objectManager.updateFlakObjects(this.objects);
    }

    this.objectManager.updateFactoryObjects(this.objects);
  }

  handleMouseMove(mouseX, mouseY) {
    this.inputHandler.handleMouseMove(mouseX, mouseY);
  }

  handleClick(mouseX, mouseY) {
    return this.inputHandler.handleClick(mouseX, mouseY);
  }

  drawUI(ctx, offsetX, offsetY) {
    this.factoryManager?.drawUI?.(ctx, offsetX, offsetY);
    this.garageUI?.drawUI(ctx, offsetX, offsetY);
  }

  // Proxy methods
  getFlakCount() { return this.proxyMethods.getFlakCount(); }
  isFlakBuilding() { return this.proxyMethods.isFlakBuilding(); }
  buildFlak() { return this.proxyMethods.buildFlak(); }
  getFlakBuildProgress() { return this.proxyMethods.getFlakBuildProgress(); }
  getRemainingFlakBuildTime() { return this.proxyMethods.getRemainingFlakBuildTime(); }
  canBuildFlak() { return this.proxyMethods.canBuildFlak(); }
  getFlakCapacity() { return this.proxyMethods.getFlakCapacity(); }
  setFlakScale(newScale) { 
    this.proxyMethods.setFlakScale(newScale);
    this.objectManager.updateFlakObjects(this.objects);
  }
  getTotalFlakCount() { return this.proxyMethods.getTotalFlakCount(); }
  getAllFlaks() { return this.proxyMethods.getAllFlaks(); }
  updateFlakRowConfig(rowIndex, newConfig) { this.proxyMethods.updateFlakRowConfig(rowIndex, newConfig); }
  setWallOffsets(lx, ly, rx, ry) { this.proxyMethods.setWallOffsets(lx, ly, rx, ry); }
  getLeftWall() { return this.proxyMethods.getLeftWall(); }
  getRightWall() { return this.proxyMethods.getRightWall(); }
}