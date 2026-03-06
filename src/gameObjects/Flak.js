import { GameObject } from "../core/GameObjectSystem/GameObject.js";
import { angleToFrame } from "../utils/animationUtils.js";

export class Flak extends GameObject {
  constructor(x, y, scaleFactor = 1, imagePath = "../public/flak.png") {
    super(x, y, 54, 39, -90, imagePath);

    this.type = "flak";
    this.totalFrames = 72;
    this.cols = 72;
    this.rows = 1;
    this.scaleFactor = scaleFactor;

    // animation / rotation state
    this.ready = false;
    this.angle = 0;
    this.currentFrame = 0;
    this.targetAngle = 0;
    this.isRotating = false;
    this.rotationSpeed = 0.8;

    // rotation timing
    this.lastRotationTime = Date.now();
    this.nextRotationDelay = this.getRandomRotationDelay();

    this.setupSpriteImage();
  }

  setupSpriteImage() {
    // Use this.imageLoader.image instead of this.image
    if (!this.imageLoader.image) return;
    if (this.imageLoader.image.complete && this.imageLoader.image.naturalWidth > 0) this.initSprite();
    else this.imageLoader.image.onload = () => this.initSprite();
  }

  initSprite() {
    if (this.ready) return;
    // Use this.imageLoader.image instead of this.image
    this.frameWidth = this.imageLoader.image.width / this.cols;
    this.frameHeight = this.imageLoader.image.height / this.rows;
    this.width = this.frameWidth * this.scaleFactor;
    this.height = this.frameHeight * this.scaleFactor;
    this.ready = true;
    
    // Don't set loaded directly - it's managed by the ImageLoader
    // Instead, we'll use the ready flag to indicate the sprite is ready
  }

  setAngle(angle) {
    this.angle = angle;
    this.targetAngle = angle;
    this.currentFrame = angleToFrame(angle);
  }

  getRandomRotationDelay() {
    return 3000 + Math.random() * 1000;
  }

  getRandomRotationOffset() {
    const directions = [315, 0, 45, 270, 225, 180, 135];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    return randomDirection + (Math.random() - 0.5) * 20;
  }

  updateRotation() {
    const now = Date.now();

    if (!this.isRotating && now - this.lastRotationTime > this.nextRotationDelay) {
      this.targetAngle = this.getRandomRotationOffset();
      this.isRotating = true;
      this.lastRotationTime = now;
      this.nextRotationDelay = this.getRandomRotationDelay();
    }

    if (this.isRotating) {
      let diff = this.targetAngle - this.angle;
      if (diff > 180) diff -= 360;
      else if (diff < -180) diff += 360;

      if (Math.abs(diff) < 2) {
        this.angle = this.targetAngle;
        this.isRotating = false;
      } else {
        this.angle += (diff > 0 ? 1 : -1) * this.rotationSpeed;
        if (this.angle < 0) this.angle += 360;
        if (this.angle >= 360) this.angle -= 360;
      }
      this.currentFrame = angleToFrame(this.angle);
    }
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    // Use ready flag instead of loaded check
    if (!this.ready || !this.imageLoader.image) return;

    this.updateRotation();

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);
    const srcX = Math.floor(this.currentFrame) * this.frameWidth;

    ctx.drawImage(
      this.imageLoader.image, // Use imageLoader.image
      srcX, 0,
      this.frameWidth, this.frameHeight,
      drawX, drawY,
      this.width, this.height
    );
  }

  // convenience accessors retained
  get scaledWidth() { return this.width; }
  get scaledHeight() { return this.height; }

  triggerRotation() {
    if (!this.isRotating) {
      this.targetAngle = this.getRandomRotationOffset();
      this.isRotating = true;
      this.lastRotationTime = Date.now();
      this.nextRotationDelay = this.getRandomRotationDelay();
    }
  }

  setRotationParams(maxRange = 15, speed = 0.8, minDelay = 3000, maxDelay = 4000) {
    this.rotationSpeed = speed;
    this.getRandomRotationDelay = () => minDelay + Math.random() * (maxDelay - minDelay);
  }
}