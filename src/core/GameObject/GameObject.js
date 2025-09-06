import { ImageLoader } from './ImageLoader.js';
import { SpriteAnimator } from './SpriteAnimator.js';
import { RenderProperties } from './RenderProperties.js';
import { GameObjectRenderer } from './GameObjectRenderer.js';
import { VisibilityChecker } from './VisibilityChecker.js';
export class GameObject {
    constructor(x, y, width, height, zIndex = 0, imageSrc = "") {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zIndex = zIndex;

        // Components
        this.imageLoader = new ImageLoader(imageSrc);
        this.spriteAnimator = new SpriteAnimator(width, height);
        this.renderProperties = new RenderProperties();
    }

    isVisible(offsetX, offsetY, viewW, viewH) {
        return VisibilityChecker.isVisible(
            this.x, this.y, this.width, this.height,
            offsetX, offsetY, viewW, viewH,
            this.renderProperties.visible
        );
    }

    update(deltaTime) {
        this.spriteAnimator.update(deltaTime);
    }

    draw(ctx, offsetX = 0, offsetY = 0, viewW = 1000, viewH = 1000) {
        GameObjectRenderer.draw(ctx, this, offsetX, offsetY, viewW, viewH);
    }

    // Getters for backward compatibility
    get loaded() { return this.imageLoader.loaded; }
    get image() { return this.imageLoader.image; }
    
    get spriteSheet() { return this.spriteAnimator.spriteSheet; }
    set spriteSheet(value) { this.spriteAnimator.spriteSheet = value; }
    
    get frameWidth() { return this.spriteAnimator.frameWidth; }
    set frameWidth(value) { this.spriteAnimator.frameWidth = value; }
    
    get frameHeight() { return this.spriteAnimator.frameHeight; }
    set frameHeight(value) { this.spriteAnimator.frameHeight = value; }
    
    get totalFrames() { return this.spriteAnimator.totalFrames; }
    set totalFrames(value) { this.spriteAnimator.totalFrames = value; }
    
    get currentFrame() { return this.spriteAnimator.currentFrame; }
    set currentFrame(value) { this.spriteAnimator.currentFrame = value; }
    
    get frameSpeed() { return this.spriteAnimator.frameSpeed; }
    set frameSpeed(value) { this.spriteAnimator.frameSpeed = value; }
    
    get frameTimer() { return this.spriteAnimator.frameTimer; }
    set frameTimer(value) { this.spriteAnimator.frameTimer = value; }
    
    get opacity() { return this.renderProperties.opacity; }
    set opacity(value) { this.renderProperties.setOpacity(value); }
    
    get blendMode() { return this.renderProperties.blendMode; }
    set blendMode(value) { this.renderProperties.setBlendMode(value); }
    
    get visible() { return this.renderProperties.visible; }
    set visible(value) { this.renderProperties.visible = value; }

    // Methods for backward compatibility
    setOpacity(opacity) { this.renderProperties.setOpacity(opacity); }
    setBlendMode(mode) { this.renderProperties.setBlendMode(mode); }
}