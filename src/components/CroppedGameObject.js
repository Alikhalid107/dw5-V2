import { GameObject } from "../core/GameObject/GameObject.js";

export class CroppedGameObject extends GameObject {
    constructor(x, y, width, height, zIndex, imageSrc, cropX, cropY, cropWidth, cropHeight) {
        super(x, y, width, height, zIndex, imageSrc);
        this.cropX = cropX;
        this.cropY = cropY;
        this.cropWidth = cropWidth;
        this.cropHeight = cropHeight;
    }

    draw(ctx, offsetX = 0, offsetY = 0, viewW = 1000, viewH = 1000) {
        if (!this.loaded || !this.isVisible(offsetX, offsetY, viewW, viewH)) return;

        const drawX = Math.floor(this.x - offsetX);
        const drawY = Math.floor(this.y - offsetY);

        const prevAlpha = ctx.globalAlpha;
        const prevComp = ctx.globalCompositeOperation;
        
        ctx.globalAlpha = this.opacity;
        ctx.globalCompositeOperation = this.blendMode;

        try {
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
        } finally {
            ctx.globalAlpha = prevAlpha;
            ctx.globalCompositeOperation = prevComp;
        }
    }
}