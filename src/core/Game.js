import { worldConfig } from "../config/worldConfig.js";
import { setupCanvas } from "./canvasSetup.js";
import { Grass } from "../components/Grass.js";
import { Base } from "../components/Base.js";
import { CameraController } from "./CameraController.js";

export class Game {
  constructor(canvas, baseCount = 2) {
    this.canvas = canvas;
    this.ctx = setupCanvas(canvas);
    this.viewW = canvas._cssWidth || window.innerWidth;
    this.viewH = canvas._cssHeight || window.innerHeight;
    this.worldWidth = worldConfig.width;
    this.worldHeight = worldConfig.height;
    this.baseCount = baseCount;
    this.bases = [];
    this.grassObjects = [];
    this.camera = new CameraController(canvas, this.worldWidth, this.worldHeight, this.viewW, this.viewH);
    this.lastTime = 0;

    this.init();
    this.setupEventHandlers();
  }

  init() {
    this.setupGrassTiling();
    this.spawnBases();
    this.camera.clamp();
    requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
  }

  setupGrassTiling() {
    const grass = new Grass(this.worldWidth, this.worldHeight);
    this.grassObjects = grass.getObjects();
  }

  spawnBases() {
    this.bases = Array.from({ length: this.baseCount }, () => 
      new Base(this.worldWidth, this.worldHeight)
    );
  }

  getDrawObjects() {
    const baseObjects = this.bases.flatMap(base => base.getObjects());
    return [...this.grassObjects, ...baseObjects];
  }

  getMouseCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + (this.camera.offsetX || 0),
      y: event.clientY - rect.top + (this.camera.offsetY || 0)
    };
  }

  forEachCompositeBase(method, ...args) {
    return this.bases.map(base => base.compositeBase?.[method]?.(...args));
  }

  setupEventHandlers() {
    this.canvas.addEventListener("mousemove", (event) => {
      const { x, y } = this.getMouseCoordinates(event);
      this.forEachCompositeBase('handleMouseMove', x, y);
    });

    this.canvas.addEventListener("click", (event) => {
      const { x, y } = this.getMouseCoordinates(event);
      this.forEachCompositeBase('handleClick', x, y);
    });

    window.addEventListener("resize", () => {
      this.viewW = this.canvas._cssWidth || window.innerWidth;
      this.viewH = this.canvas._cssHeight || window.innerHeight;
      this.camera.updateViewSize(this.viewW, this.viewH);
    });
  }

  updateGame(deltaTime) {
    this.bases.forEach(base => base.update?.(deltaTime));
    this.grassObjects.forEach(obj => obj.update?.(deltaTime));
  }

  drawUI() {
    const activeBase = this.bases.find(base =>
      base.compositeBase?.garageUI?.showGrid || base.compositeBase?.factoryManager?.showGrid
    );

    if (activeBase) {
      activeBase.compositeBase.drawUI(this.ctx, this.camera.offsetX, this.camera.offsetY);
    }
  }

  gameLoop(currentTime) {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
    this.lastTime = currentTime;

    this.updateGame(deltaTime);

    const drawList = this.getDrawObjects();
    this.ctx.clearRect(0, 0, this.viewW, this.viewH);

    drawList
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
      .forEach(obj => {
        obj.draw?.(this.ctx, this.camera.offsetX, this.camera.offsetY, this.camera.viewW, this.camera.viewH);
      });

    this.drawUI();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  // Helper methods
  getBase(index = 0) { return this.bases[index]; }
  getAllBases() { return this.bases; }
  getFactoryLevel(baseIndex, factoryType) { 
    return this.bases[baseIndex]?.compositeBase?.getFactoryLevel?.(factoryType) || 0; 
  }
  upgradeFactory(baseIndex, factoryType) { 
    return this.bases[baseIndex]?.compositeBase?.upgradeFactory?.(factoryType) || false; 
  }
  getAllFactoryLevels(baseIndex) { 
    return this.bases[baseIndex]?.compositeBase?.getAllFactoryLevels?.() || {}; 
  }
}