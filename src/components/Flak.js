import { GameObject } from "../core/GameObject.js";
import { angleToFrame } from "../utils/animationUtils.js";


export class Flak extends GameObject {
  constructor(x, y, scaleFactor = 1.2, imagePath = "../public/flak.png") {
    // Initialize with temporary dimensions - will be set properly after sprite loads
    super(x, y, 54, 39, -90, imagePath);
    
    this.totalFrames = 72;
    this.currentFrame = 0;
    this.angle = 0;
    
    // Sprite sheet configuration
    this.cols = 72;
    this.rows = 1;
    this.scaleFactor = scaleFactor;
    
    // Sprite properties
    this.ready = false;
    this.frameWidth = 0;
    this.frameHeight = 0;
    
    // Random rotation behavior
    this.baseAngle = 0;
    this.targetAngle = 0;
    this.rotationSpeed = 0.8;
    this.lastRotationTime = Date.now();
    this.nextRotationDelay = this.getRandomRotationDelay();
    this.maxRotationRange = 15;
    this.isRotating = false;
    
    // Setup image loading with sprite initialization
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
    
    // Calculate frame dimensions from loaded image
    this.frameWidth = this.image.width / this.cols;
    this.frameHeight = this.image.height / this.rows;
    
    // Set actual GameObject dimensions based on sprite and scale
    this.width = this.frameWidth * this.scaleFactor;
    this.height = this.frameHeight * this.scaleFactor;
    
    this.ready = true;
    this.loaded = true;
  }

  setAngle(angle) {
    this.baseAngle = angle;
    this.targetAngle = angle;
    this.angle = angle;
    this.currentFrame = angleToFrame(angle);
  }

  // Get random delay between 3-4 seconds (in milliseconds)
  getRandomRotationDelay() {
    return 3000 + Math.random() * 1000;
  }

  // Get random rotation angle within the allowed player-facing directions
  getRandomRotationOffset() {
    const playerFacingDirections = [
      315,  // bottom-right (towards us right)
      0,    // right
      45,   // top-right (but more towards us)
      270,  // bottom (towards us)
      225,  // bottom-left
      180,  // left
      135   // top-left (but more towards us)
    ];
    
    // Pick a random direction from allowed directions
    const randomDirection = playerFacingDirections[Math.floor(Math.random() * playerFacingDirections.length)];
    
    // Add small variation (±10 degrees) to make it less mechanical
    const variation = (Math.random() - 0.5) * 20;
    
    return randomDirection + variation;
  }

  // Update rotation behavior
  updateRotation() {
    const currentTime = Date.now();
    
    // Check if it's time for a new random rotation
    if (!this.isRotating && currentTime - this.lastRotationTime > this.nextRotationDelay) {
      // Start a new rotation to a player-facing direction
      this.targetAngle = this.getRandomRotationOffset();
      this.isRotating = true;
      this.lastRotationTime = currentTime;
      this.nextRotationDelay = this.getRandomRotationDelay();
    }
    
    // Smooth rotation towards target angle
    if (this.isRotating) {
      const angleDiff = this.targetAngle - this.angle;
      
      // Handle angle wrapping (shortest path)
      let shortestAngleDiff = angleDiff;
      if (angleDiff > 180) {
        shortestAngleDiff = angleDiff - 360;
      } else if (angleDiff < -180) {
        shortestAngleDiff = angleDiff + 360;
      }
      
      // If we're close enough to target, snap to it and stop rotating
      if (Math.abs(shortestAngleDiff) < 2) {
        this.angle = this.targetAngle;
        this.isRotating = false;
      } else {
        // Rotate towards target using shortest path
        const rotationDirection = shortestAngleDiff > 0 ? 1 : -1;
        this.angle += rotationDirection * this.rotationSpeed;
        
        // Keep angle in 0-360 range
        if (this.angle < 0) this.angle += 360;
        if (this.angle >= 360) this.angle -= 360;
      }
      
      // Update current frame based on new angle
      this.currentFrame = angleToFrame(this.angle);
    }
  }

  draw(ctx, offsetX, offsetY, viewW, viewH) {
    // Early returns for optimization
    if (!this.ready || !this.loaded) return;
    if (!this.isVisible(offsetX, offsetY, viewW, viewH)) return;

    // Update rotation behavior before drawing
    this.updateRotation();

    // Calculate source coordinates in sprite sheet
    const srcX = Math.floor(this.currentFrame) * this.frameWidth;
    const srcY = 0; // Single row sprite sheet

    // Calculate draw position
    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    // Ensure crisp rendering
    const prevImageSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = true;

    try {
      ctx.drawImage(
        this.image,
        srcX, srcY,
        this.frameWidth, this.frameHeight,
        drawX, drawY,
        this.width, this.height
      );
    } catch (error) {
    
    }

    // Restore previous image smoothing setting
    ctx.imageSmoothingEnabled = prevImageSmoothing;
  }

  // Getter for scaled width (useful for positioning calculations)
  get scaledWidth() {
    return this.width;
  }

  // Getter for scaled height (useful for positioning calculations)
  get scaledHeight() {
    return this.height;
  }

  // Method to manually trigger a rotation
  triggerRotation() {
    if (!this.isRotating) {
      this.targetAngle = this.getRandomRotationOffset();
      this.isRotating = true;
      this.lastRotationTime = Date.now();
      this.nextRotationDelay = this.getRandomRotationDelay();
    }
  }

  // Method to set rotation parameters
  setRotationParams(maxRange = 15, speed = 0.8, minDelay = 3000, maxDelay = 4000) {
    this.maxRotationRange = maxRange;
    this.rotationSpeed = speed;
    // Update next rotation delay range
    this.getRandomRotationDelay = () => minDelay + Math.random() * (maxDelay - minDelay);
  }
}