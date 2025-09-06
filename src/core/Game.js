import { worldConfig } from "../config/worldConfig.js";
import { setupCanvas, drawWithZoomAware } from "./canvasSetup.js";
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
    const allObjects = [...this.grassObjects, ...baseObjects];
    
    // Remove duplicates using Set
    const uniqueObjects = [];
    const seen = new Set();
    
    for (const obj of allObjects) {
      if (!seen.has(obj)) {
        seen.add(obj);
        uniqueObjects.push(obj);
      }
    }
    
    return uniqueObjects;
  }

  getMouseCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    const renderInfo = this.camera.getRenderingInfo();
    
    let mouseX = event.clientX - rect.left;
    let mouseY = event.clientY - rect.top;
    
    // Adjust for black bars if present
    if (renderInfo.useBlackBars) {
      mouseX = (mouseX - renderInfo.offsetX) * (this.viewW / renderInfo.renderWidth);
      mouseY = (mouseY - renderInfo.offsetY) * (this.viewH / renderInfo.renderHeight);
    }
    
    return {
      x: mouseX + (this.camera.offsetX || 0),
      y: mouseY + (this.camera.offsetY || 0)
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

    // Monitor zoom changes
    this.setupZoomMonitoring();
  }

  setupZoomMonitoring() {
    let lastZoom = this.camera.currentZoom;
    const checkZoom = () => {
      const currentZoom = this.camera.detectZoomLevel();
      if (Math.abs(currentZoom - lastZoom) > 0.05) {
        lastZoom = currentZoom;
        this.camera.updateViewSize();
      }
      requestAnimationFrame(checkZoom);
    };
    checkZoom();
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
      const renderInfo = this.camera.getRenderingInfo();
      let offsetX = this.camera.offsetX;
      let offsetY = this.camera.offsetY;
      
      // Adjust UI positioning for black bars
      if (renderInfo.useBlackBars) {
        offsetX = (offsetX - renderInfo.offsetX) * (this.viewW / renderInfo.renderWidth);
        offsetY = (offsetY - renderInfo.offsetY) * (this.viewH / renderInfo.renderHeight);
      }
      
      activeBase.compositeBase.drawUI(this.ctx, offsetX, offsetY);
    }
    
    // Always draw message displays
    this.drawMessageDisplays(this.ctx);
  }

  drawMessageDisplays(ctx) {
    this.bases.forEach(base => {
      const factoryManager = base.compositeBase?.factoryManager;
      if (factoryManager) {
        Object.values(factoryManager.ui?.factoryPanels || {}).forEach(panel => {
          if (panel.messageDisplay) {
            panel.messageDisplay.draw(ctx);
          }
        });
      }
    });
  }

  gameLoop(currentTime) {
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
    this.lastTime = currentTime;

    this.updateGame(deltaTime);

    // Zoom-aware rendering
    drawWithZoomAware(this.ctx, this.camera, (ctx, renderInfo) => {
      ctx.clearRect(0, 0, renderInfo.renderWidth, renderInfo.renderHeight);

      const drawList = this.getDrawObjects();
      
      drawList
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
        .forEach(obj => {
          obj.draw?.(
            ctx, 
            this.camera.offsetX, 
            this.camera.offsetY, 
            renderInfo.renderWidth, 
            renderInfo.renderHeight
          );
        });
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
  getCurrentZoom() { return this.camera.currentZoom; }
  isUsingBlackBars() { return this.camera.getRenderingInfo().useBlackBars; }
  getRenderInfo() { return this.camera.getRenderingInfo(); }
}