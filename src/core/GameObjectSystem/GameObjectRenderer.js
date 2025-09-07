import { VisibilityChecker } from "./VisibilityChecker.js";

export class GameObjectRenderer {
    static draw(ctx, gameObject, offsetX, offsetY, viewW, viewH) {
        if (!gameObject.imageLoader.loaded || 
            !VisibilityChecker.isVisible(
                gameObject.x, gameObject.y, gameObject.width, gameObject.height,
                offsetX, offsetY, viewW, viewH,
                gameObject.renderProperties.visible
            )) {
            return;
        }

        const drawX = Math.floor(gameObject.x - offsetX);
        const drawY = Math.floor(gameObject.y - offsetY);

        const prevAlpha = ctx.globalAlpha;
        const prevComp = ctx.globalCompositeOperation;
        
        ctx.globalAlpha = gameObject.renderProperties.opacity;
        ctx.globalCompositeOperation = gameObject.renderProperties.blendMode;

        try {
            if (gameObject.spriteAnimator.spriteSheet) {
                const sx = gameObject.spriteAnimator.currentFrame * gameObject.spriteAnimator.frameWidth;
                ctx.drawImage(
                    gameObject.imageLoader.image, 
                    sx, 0, 
                    gameObject.spriteAnimator.frameWidth, gameObject.spriteAnimator.frameHeight, 
                    drawX, drawY, 
                    gameObject.width, gameObject.height
                );
            } else {
                ctx.drawImage(gameObject.imageLoader.image, drawX, drawY, gameObject.width, gameObject.height);
            }
        } finally {
            ctx.globalAlpha = prevAlpha;
            ctx.globalCompositeOperation = prevComp;
        }
    }
}