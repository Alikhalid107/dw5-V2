export class GameObject {
  constructor(x, y, width, height, zIndex, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.zIndex = zIndex;

    this.image = new Image();
    this.image.src = imageSrc;
    this.loaded = false;
    this.image.onload = () => (this.loaded = true);

    // Sprite animation properties
    this.spriteSheet = false;
    this.frameWidth = width;
    this.frameHeight = height;
    this.totalFrames = 1;
    this.currentFrame = 0;
    this.frameSpeed = 0; // frames per second (0 = no animation)
    this.frameTimer = 0;
  }

  isVisible(offsetX, offsetY, viewW, viewH) {
    const left = this.x - offsetX;
    const top = this.y - offsetY;
    const right = left + this.width;
    const bottom = top + this.height;
    
    return right > 0 && bottom > 0 && left < viewW && top < viewH;
  }

  update(deltaTime) {
    if (this.spriteSheet && this.totalFrames > 1 && this.frameSpeed > 0) {
      this.frameTimer += deltaTime;

      const frameDuration = 1000 / this.frameSpeed;

      // Handle multiple frames if deltaTime is large
      while (this.frameTimer >= frameDuration) {
        this.frameTimer -= frameDuration;
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      }
    }
  }

  draw(ctx, offsetX = 0, offsetY = 0, viewW = 1000, viewH = 1000) {
    if (!this.loaded) return;
    
    // Check if object is visible in viewport
    if (!this.isVisible(offsetX, offsetY, viewW, viewH)) return;

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    if (this.spriteSheet) {
      const sourceX = this.currentFrame * this.frameWidth;
      const sourceY = 0;
      
      ctx.drawImage(
        this.image,
        sourceX,
        sourceY,
        this.frameWidth,
        this.frameHeight,
        drawX,
        drawY,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
    }
  }
}