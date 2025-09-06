export class SpriteAnimator {
    constructor(frameWidth, frameHeight) {
        this.spriteSheet = false;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = 1;
        this.currentFrame = 0;
        this.frameSpeed = 0;
        this.frameTimer = 0;
    }

    update(deltaTime) {
        if (this.spriteSheet && this.totalFrames > 1 && this.frameSpeed > 0) {
            this.frameTimer += deltaTime;
            const frameDuration = 1000 / this.frameSpeed;
            while (this.frameTimer >= frameDuration) {
                this.frameTimer -= frameDuration;
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            }
        }
    }
}