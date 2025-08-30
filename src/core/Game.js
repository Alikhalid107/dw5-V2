// src/core/Game.js
import { worldConfig } from "../config/worldConfig.js";
import { setupCanvas } from "./canvasSetup.js";
import { Grass } from "../components/Grass.js";
import { Base } from "../components/Base.js";
import { CameraController } from "./CameraController.js";

/**
 * Main Game manager
 */
export class Game {
  constructor(canvas, baseCount = 2) {
    this.canvas = canvas;
    this.ctx = setupCanvas(canvas);

    this.viewW = window.innerWidth;
    this.viewH = window.innerHeight;

    this.worldWidth = worldConfig.width;
    this.worldHeight = worldConfig.height;

    this.baseCount = baseCount;
    this.bases = [];
    this.objects = [];

    // Camera controller
    this.camera = new CameraController(
      canvas,
      this.worldWidth,
      this.worldHeight,
      this.viewW,
      this.viewH
    );

    // Add timing for delta calculations
    this.lastTime = 0;

    this.init();
    this.setupEventHandlers();
  }

  init() {
    this.setupGrassTiling();
    this.spawnBases();

    this.objects = [
      ...this.objects, // grass
      ...this.getAllBaseObjects(), // bases
    ];

    // Start the game loop
    requestAnimationFrame((currentTime) => this.gameLoop(currentTime));
  }

  setupGrassTiling() {
    const grass = new Grass(this.worldWidth, this.worldHeight);
    this.objects = this.objects.concat(grass.getObjects());
  }

  spawnBases() {
    this.bases = Array.from({ length: this.baseCount }, () => {
      const randX = Math.floor(Math.random() * (this.worldWidth - 500));
      const randY = Math.floor(Math.random() * (this.worldHeight - 500));
      return new Base(randX, randY);
    });
  }

  getAllBaseObjects() {
    return this.bases.flatMap((base) => base.getObjects());
  }

  // Helper method to get mouse coordinates - reduces duplication
  getMouseCoordinates(event) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + this.camera.offsetX,
      y: event.clientY - rect.top + this.camera.offsetY
    };
  }

  // Helper method to safely access composite base methods
  callCompositeBaseMethod(base, method, ...args) {
    return base.compositeBase?.[method]?.(...args);
  }

  // Helper method to iterate bases and call composite base methods
  forEachCompositeBase(method, ...args) {
    return this.bases.map(base => this.callCompositeBaseMethod(base, method, ...args));
  }

  setupEventHandlers() {
    // Mouse move handler for factory hover detection
    this.canvas.addEventListener("mousemove", (event) => {
      const { x: mouseX, y: mouseY } = this.getMouseCoordinates(event);
      this.forEachCompositeBase('handleMouseMove', mouseX, mouseY);
    });

    // Mouse click handler for factory upgrades
    this.canvas.addEventListener("click", (event) => {
      const { x: mouseX, y: mouseY } = this.getMouseCoordinates(event);
      this.forEachCompositeBase('handleClick', mouseX, mouseY);
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      this.viewW = window.innerWidth;
      this.viewH = window.innerHeight;
      this.camera.updateViewSize(this.viewW, this.viewH);
    });
  }

  updateGame(deltaTime) {
    // Update all bases (which will update factories, flags, etc.)
    this.bases.forEach((base) => base.update?.(deltaTime));

    // Update all objects (for animations, etc.)
    this.objects.forEach((obj) => obj.update?.(deltaTime));
  }

  drawUI() {
    // Find the active (hovered) base - only one should have showGrid = true
    const activeBase = this.bases.find(base => 
      base.compositeBase?.factoryManager?.showGrid
    );

    // Only draw UI for the active base
    if (activeBase) {
      this.callCompositeBaseMethod(
        activeBase, 
        'drawUI', 
        this.ctx, 
        this.camera.offsetX, 
        this.camera.offsetY
      );
    }
  }

  gameLoop(currentTime) {
    // Calculate delta time
    const deltaTime = this.lastTime ? currentTime - this.lastTime : 0;
    this.lastTime = currentTime;

    // Update game logic
    this.updateGame(deltaTime);

    // Clear canvas
    this.ctx.clearRect(0, 0, this.viewW, this.viewH);

    // Draw all objects sorted by zIndex
    this.objects
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach((obj) =>
        obj.draw(
          this.ctx,
          this.camera.offsetX,
          this.camera.offsetY,
          this.camera.viewW,
          this.camera.viewH
        )
      );

    // Draw UI overlay (factory buttons, timers, etc.) - AFTER all objects
    this.drawUI();

    // Continue the loop
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  // Helper methods for external access
  getBase(index = 0) {
    return this.bases[index];
  }

  getAllBases() {
    return this.bases;
  }

  // Simplified factory-related helper methods
  getFactoryLevel(baseIndex, factoryType) {
    return this.callCompositeBaseMethod(this.bases[baseIndex], 'getFactoryLevel', factoryType) || 0;
  }

  upgradeFactory(baseIndex, factoryType) {
    return this.callCompositeBaseMethod(this.bases[baseIndex], 'upgradeFactory', factoryType) || false;
  }

  getAllFactoryLevels(baseIndex) {
    return this.callCompositeBaseMethod(this.bases[baseIndex], 'getAllFactoryLevels') || {};
  }
}