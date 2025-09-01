import { GameObject } from "../core/GameObject.js";
import { angleToFrame } from "../utils/animationUtils.js";

export class Flak extends GameObject {
  constructor(x, y, scaleFactor = 1, imagePath = "../public/flak.png") {
    super(x, y, 54, 39, -90, imagePath);

    this.type = "flak";
    this.totalFrames = 72;
    this.cols = 72;
    this.rows = 1;
    this.scaleFactor = scaleFactor;
    this.ready = false;

    this.angle = 0;
    this.currentFrame = 0;
    this.targetAngle = 0;
    this.isRotating = false;
    this.rotationSpeed = 0.8;
    this.lastRotationTime = Date.now();
    this.nextRotationDelay = this.getRandomRotationDelay();

    this.setupSpriteImage();
  }

  setupSpriteImage() {
    if (!this.image) return;
    if (this.image.complete && this.image.naturalWidth > 0) {
      this.initSprite();
    } else {
      this.image.onload = () => this.initSprite();
    }
  }

  initSprite() {
    if (this.ready) return;
    this.frameWidth = this.image.width / this.cols;
    this.frameHeight = this.image.height / this.rows;
    this.width = this.frameWidth * this.scaleFactor;
    this.height = this.frameHeight * this.scaleFactor;
    this.ready = true;
    this.loaded = true;
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
    const currentTime = Date.now();
    
    if (!this.isRotating && currentTime - this.lastRotationTime > this.nextRotationDelay) {
      this.targetAngle = this.getRandomRotationOffset();
      this.isRotating = true;
      this.lastRotationTime = currentTime;
      this.nextRotationDelay = this.getRandomRotationDelay();
    }

    if (this.isRotating) {
      let angleDiff = this.targetAngle - this.angle;
      if (angleDiff > 180) angleDiff -= 360;
      else if (angleDiff < -180) angleDiff += 360;

      if (Math.abs(angleDiff) < 2) {
        this.angle = this.targetAngle;
        this.isRotating = false;
      } else {
        this.angle += (angleDiff > 0 ? 1 : -1) * this.rotationSpeed;
        if (this.angle < 0) this.angle += 360;
        if (this.angle >= 360) this.angle -= 360;
      }
      this.currentFrame = angleToFrame(this.angle);
    }
  }

  draw(ctx, offsetX, offsetY) {
    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    if (this.ready && this.image) {
      this.updateRotation();
      const srcX = Math.floor(this.currentFrame) * this.frameWidth;
      ctx.drawImage(
        this.image,
        srcX, 0,
        this.frameWidth, this.frameHeight,
        drawX, drawY,
        this.width, this.height
      );
    } else {
      // Placeholder rectangle
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 2;
      ctx.strokeRect(drawX, drawY, this.width || 30, this.height || 20);
    }
  }

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