export class ZoomAwareRenderer {
    static draw(ctx, camera, drawCallback) {
        const renderInfo = camera.getRenderingInfo();
        
        if (renderInfo.useBlackBars) {
            // Clear entire canvas first
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
            
            // Set up clipping region for game content
            ctx.save();
            ctx.beginPath();
            ctx.rect(
                renderInfo.offsetX,
                renderInfo.offsetY,
                renderInfo.renderWidth,
                renderInfo.renderHeight
            );
            ctx.clip();
            
            // Translate for black bar offset
            ctx.translate(renderInfo.offsetX, renderInfo.offsetY);
        }
        
        // Apply quality scaling if needed
        if (renderInfo.qualityMultiplier !== 1) {
            ctx.save();
            ctx.scale(renderInfo.qualityMultiplier, renderInfo.qualityMultiplier);
        }
        
        // Execute the drawing callback
        drawCallback(ctx, renderInfo);
        
        // Restore transformations
        if (renderInfo.qualityMultiplier !== 1) {
            ctx.restore();
        }
        
        if (renderInfo.useBlackBars) {
            ctx.restore();
        }
    }
}