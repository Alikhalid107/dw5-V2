export class SpriteFrameUtility {
  constructor(imagePath, totalFrames, cols = null, rows = 1) {
    this.imagePath = imagePath;
    this.totalFrames = totalFrames;
    this.cols = cols || totalFrames;
    this.rows = rows;
    this.image = null;
    this.frameWidth = 0;
    this.frameHeight = 0;
    this.loaded = false;
    
    this.loadImage();
  }

  loadImage() {
    this.image = new Image();
    this.image.onload = () => {
      this.frameWidth = this.image.width / this.cols;
      this.frameHeight = this.image.height / this.rows;
      this.loaded = true;
    };
    this.image.src = this.imagePath;
  }

  // Draw specific frame at position
  drawFrame(ctx, frameIndex, x, y, width = null, height = null) {
    if (!this.loaded || frameIndex < 0 || frameIndex >= this.totalFrames) return;

    const drawWidth = width || this.frameWidth;
    const drawHeight = height || this.frameHeight;

    const col = frameIndex % this.cols;
    const row = Math.floor(frameIndex / this.cols);
    
    const srcX = col * this.frameWidth;
    const srcY = row * this.frameHeight;

    ctx.drawImage(
      this.image,
      srcX, srcY,
      this.frameWidth, this.frameHeight,
      x, y,
      drawWidth, drawHeight
    );
  }

  // Get frame bounds for click detection
  getFrameBounds(frameIndex, x, y, width = null, height = null) {
    const drawWidth = width || this.frameWidth;
    const drawHeight = height || this.frameHeight;
    
    return {
      x: x,
      y: y,
      width: drawWidth,
      height: drawHeight
    };
  }

  isFrameLoaded() {
    return this.loaded;
  }

  getFrameSize() {
    return {
      width: this.frameWidth,
      height: this.frameHeight
    };
  }
}