export class GameObject {
  constructor(x, y, width, height, zIndex = 0, imageSrc = "") {
    this.x = x; this.y = y; this.width = width; this.height = height; this.zIndex = zIndex;

    this.image = new Image();
    this.image.src = imageSrc || "";
    this.loaded = false;
    this.image.onload = () => (this.loaded = true);

    // sprite
    this.spriteSheet = false;
    this.frameWidth = width; this.frameHeight = height;
    this.totalFrames = 1; this.currentFrame = 0;
    this.frameSpeed = 0; // kept same name/meaning
    this.frameTimer = 0;

    // render
    this.opacity = 1.0;
    this.blendMode = 'source-over';
    this.visible = true;
  }

  isVisible(offsetX, offsetY, viewW, viewH) {
    const left = this.x - offsetX, top = this.y - offsetY;
    const right = left + this.width, bottom = top + this.height;
    return this.visible && right > 0 && bottom > 0 && left < viewW && top < viewH;
  }

  update(deltaTime) {
    // original logic preserved: frameSpeed unit & formula unchanged
    if (this.spriteSheet && this.totalFrames > 1 && this.frameSpeed > 0) {
      this.frameTimer += deltaTime;
      const frameDuration = 1000 / this.frameSpeed; // keep same calculation
      while (this.frameTimer >= frameDuration) {
        this.frameTimer -= frameDuration;
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      }
    }
  }

  draw(ctx, offsetX = 0, offsetY = 0, viewW = 1000, viewH = 1000) {
    if (!this.loaded || !this.isVisible(offsetX, offsetY, viewW, viewH)) return;
    const drawX = Math.floor(this.x - offsetX), drawY = Math.floor(this.y - offsetY);

    const prevAlpha = ctx.globalAlpha, prevComp = ctx.globalCompositeOperation;
    ctx.globalAlpha = this.opacity; ctx.globalCompositeOperation = this.blendMode;

    try {
      if (this.spriteSheet) {
        const sx = this.currentFrame * this.frameWidth;
        ctx.drawImage(this.image, sx, 0, this.frameWidth, this.frameHeight, drawX, drawY, this.width, this.height);
      } else {
        ctx.drawImage(this.image, drawX, drawY, this.width, this.height);
      }
    } finally {
      ctx.globalAlpha = prevAlpha; ctx.globalCompositeOperation = prevComp;
    }
  }

  setOpacity(opacity) { this.opacity = Math.max(0, Math.min(1, opacity)); }
  setBlendMode(mode) { this.blendMode = mode; }
}
