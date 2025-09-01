import { clampCamera } from "../config/worldConfig.js";

export class CameraController {
  constructor(canvas, worldWidth, worldHeight, viewW, viewH) {
    this.canvas = canvas;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.viewW = viewW || canvas?._cssWidth || window.innerWidth;
    this.viewH = viewH || canvas?._cssHeight || window.innerHeight;
    this.offsetX = 0;
    this.offsetY = 0;
    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };

    // Zoom detection properties
    this.baseWidth = 1600; // Your native resolution
    this.baseHeight = 900;
    this.currentZoom = this.detectZoomLevel();
    this.minZoomForFullScreen = 0.8; // 80%

    this.addEventListeners();
    this.clamp();
  }

  detectZoomLevel() {
    // Detect zoom by comparing actual viewport to expected viewport
    const expectedWidth = this.baseWidth;
    const actualWidth = window.innerWidth;
    const dpr = window.devicePixelRatio;
    
    // Calculate effective zoom (accounts for both browser zoom and DPR)
    return (actualWidth * dpr) / expectedWidth;
  }

  addEventListeners() {
    if (!this.canvas) return;

    this.canvas.addEventListener("contextmenu", e => e.preventDefault());

    this.canvas.addEventListener("mousedown", e => {
      if (e.button === 2) {
        this.dragging = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
      }
    });

    this.canvas.addEventListener("mouseup", e => {
      if (e.button === 2) this.dragging = false;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.dragging = false;
    });

    this.canvas.addEventListener("mousemove", e => {
      if (!this.dragging) return;
      
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;
      
      this.offsetX -= dx;
      this.offsetY -= dy;
      
      this.clamp();
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("resize", () => {
      this.updateViewSize();
    });
  }

  updateViewSize(viewW, viewH) {
    this.viewW = viewW || this.canvas?._cssWidth || window.innerWidth;
    this.viewH = viewH || this.canvas?._cssHeight || window.innerHeight;
    this.currentZoom = this.detectZoomLevel();
    this.clamp();
  }

  // Get rendering info based on zoom level
  getRenderingInfo() {
    const zoom = this.currentZoom;
    
    if (zoom >= this.minZoomForFullScreen) {
      // Full screen rendering
      return {
        renderWidth: this.viewW,
        renderHeight: this.viewH,
        offsetX: 0,
        offsetY: 0,
        useBlackBars: false,
        qualityMultiplier: Math.max(1, zoom) // Higher quality for zoomed in
      };
    } else {
      // Black bars mode - maintain aspect ratio
      const targetAspectRatio = this.baseWidth / this.baseHeight;
      const currentAspectRatio = this.viewW / this.viewH;
      
      let renderWidth, renderHeight, offsetX = 0, offsetY = 0;
      
      if (currentAspectRatio > targetAspectRatio) {
        // Window is wider - add black bars on sides
        renderHeight = this.viewH;
        renderWidth = renderHeight * targetAspectRatio;
        offsetX = (this.viewW - renderWidth) / 2;
      } else {
        // Window is taller - add black bars on top/bottom
        renderWidth = this.viewW;
        renderHeight = renderWidth / targetAspectRatio;
        offsetY = (this.viewH - renderHeight) / 2;
      }
      
      return {
        renderWidth,
        renderHeight,
        offsetX,
        offsetY,
        useBlackBars: true,
        qualityMultiplier: 1.0 // Maintain quality even when zoomed out
      };
    }
  }

  clamp() {
    const renderInfo = this.getRenderingInfo();
    const clamped = clampCamera(
      this.offsetX,
      this.offsetY,
      this.worldWidth,
      this.worldHeight,
      { width: renderInfo.renderWidth, height: renderInfo.renderHeight }
    );
    this.offsetX = clamped.x;
    this.offsetY = clamped.y;
  }
}