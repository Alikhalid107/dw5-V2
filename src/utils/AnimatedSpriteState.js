export class AnimatedSpriteState {
  constructor(totalFrames, frameDuration) {
    this.totalFrames = totalFrames;
    this.frameDuration = frameDuration;
    this.frame = 0;
    this.timer = 0;
  }

  update(deltaTime, isHovered) {
    if (!isHovered) {
      this.frame = 0;
      this.timer = 0;
      return;
    }
    const dt = deltaTime < 1 ? deltaTime * 1000 : deltaTime;
    this.timer += dt;
    while (this.timer >= this.frameDuration) {
      this.timer -= this.frameDuration;
      this.frame = (this.frame + 1) % this.totalFrames;
    }
  }
}