// src/core/CameraController.js
import { clampCamera } from "../config/worldConfig.js";

export class CameraController {
  constructor(canvas, worldWidth, worldHeight, viewW, viewH) {
    this.canvas = canvas;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;

    this.viewW = viewW;
    this.viewH = viewH;

    this.offsetX = 0;
    this.offsetY = 0;

    this.dragging = false;
    this.lastMouse = { x: 0, y: 0 };

    this.addEventListeners();
  }

  addEventListeners() {
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
      this.viewW = window.innerWidth;
      this.viewH = window.innerHeight;
      this.clamp();
    });
  }

  clamp() {
    const clamped = clampCamera(
      this.offsetX,
      this.offsetY,
      this.worldWidth,
      this.worldHeight,
      { width: this.viewW, height: this.viewH }
    );
    this.offsetX = clamped.x;
    this.offsetY = clamped.y;
  }
}
