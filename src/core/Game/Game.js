import { worldConfig } from "../../config/worldConfig.js";
import { setupCanvas, drawWithZoomAware } from "../canvasSetup/canvasSetup.js";
import { CameraController } from "../CameraController/CameraController.js";
import { GameInitializer } from "./GameInitializer.js";
import { ObjectManager } from "./ObjectManager.js";
import { MouseInputHandler } from "./MouseInputHandler.js";
import { UIHandler } from "./UIHandler.js";
import { ZoomMonitor } from "./ZoomMonitor.js";
import { GameLoopManager } from "./GameLoopManager.js";

export class Game {
    constructor(canvas, baseCount = 2) {
        this.canvas = canvas;
        this.ctx = setupCanvas(canvas);
        this.viewW = canvas._cssWidth || window.innerWidth;
        this.viewH = canvas._cssHeight || window.innerHeight;
        this.worldWidth = worldConfig.width;
        this.worldHeight = worldConfig.height;
        this.baseCount = baseCount;
        
        this.camera = new CameraController(canvas, this.worldWidth, this.worldHeight, this.viewW, this.viewH);
        
        // Initialize components
        this.grassObjects = [];
        this.bases = [];
        this.objectManager = null;
        this.mouseInputHandler = null;
        this.uiHandler = null;
        this.zoomMonitor = null;
        this.gameLoopManager = null;

        this.init();
        this.setupEventHandlers();
    }

    init() {
        // Setup game objects
        this.grassObjects = GameInitializer.setupGrassTiling(this.worldWidth, this.worldHeight);
        this.bases = GameInitializer.spawnBases(this.worldWidth, this.worldHeight, this.baseCount);
        
        // Initialize managers
        this.objectManager = new ObjectManager(this.grassObjects, this.bases);
        this.mouseInputHandler = new MouseInputHandler(this.canvas, this.camera, this.bases);
        this.uiHandler = new UIHandler(this.bases, this.camera, this.ctx);
        this.zoomMonitor = new ZoomMonitor(this.camera);
        this.gameLoopManager = new GameLoopManager(this.ctx, this.camera, this.objectManager, this.uiHandler);
        
        this.camera.clamp();
        this.gameLoopManager.start();
    }

    setupEventHandlers() {
        this.canvas.addEventListener("mousemove", (event) => {
            this.mouseInputHandler.handleMouseMove(event);
        });

        this.canvas.addEventListener("click", (event) => {
            this.mouseInputHandler.handleClick(event);
        });

        window.addEventListener("resize", () => {
            this.viewW = this.canvas._cssWidth || window.innerWidth;
            this.viewH = this.canvas._cssHeight || window.innerHeight;
            this.camera.updateViewSize(this.viewW, this.viewH);
        });

        // Monitor zoom changes
        this.zoomMonitor.startMonitoring();
    }

    // Helper methods - delegate to object manager
    getBase(index = 0) { return this.objectManager.getBase(index); }
    getAllBases() { return this.objectManager.getAllBases(); }
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