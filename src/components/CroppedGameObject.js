import { GameObject } from "../core/GameObject";

export class CroppedGameObject extends GameObject {
  constructor(x, y, width, height, zIndex, imageSrc, cropX, cropY, cropWidth, cropHeight) {
    super(x, y, width, height, zIndex, imageSrc);
    this.cropX = cropX;
    this.cropY = cropY;
    this.cropWidth = cropWidth;
    this.cropHeight = cropHeight;
  }

  draw(ctx, offsetX, offsetY, viewW, viewH) {
    if (!this.loaded) return;
    if (!this.isVisible(offsetX, offsetY, viewW, viewH)) return;

    const drawX = Math.floor(this.x - offsetX);
    const drawY = Math.floor(this.y - offsetY);

    // Draw with cropping
    ctx.drawImage(
      this.image,
      this.cropX,        // Source X (crop)
      this.cropY,        // Source Y (crop)
      this.cropWidth,    // Source width (crop)
      this.cropHeight,   // Source height (crop)
      drawX,             // Destination X
      drawY,             // Destination Y
      this.width,        // Destination width
      this.height        // Destination height
    );
  }
}