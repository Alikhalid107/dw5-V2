import { PanelBase } from './PanelBase.js';

export class MessageDisplay extends PanelBase {
  constructor() {
    super();
    this.showMessage = false;
    this.messageText = "";
    this.messageTimer = 0;
    this.startTime = 0;
    this.animationDuration = 2000;
    this.blinkDuration = 1500;
  }

  draw(ctx) {
    if (!this.showMessage) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.animationDuration, 1);
    
    // Calculate opacity with fade out
    let opacity = 1;
    if (elapsed > this.blinkDuration) {
      opacity = 1 - ((elapsed - this.blinkDuration) / (this.animationDuration - this.blinkDuration));
    }
    
    // Calculate banner dimensions and position
    const paddingX = 60;
    ctx.font = "bold 18px Arial";
    const textWidth = ctx.measureText(this.messageText).width;
    const bannerWidth = textWidth + paddingX * 2;
    const bannerHeight = 40;
    const bannerX = (ctx.canvas.width - bannerWidth) / 2;
    const bannerY = (ctx.canvas.height - bannerHeight) / 2;
    
    // Check visibility (blink effect)
    const isVisible = this._calculateBlinkVisibility(elapsed);
    
    if (isVisible) {
      this._drawBanner(ctx, bannerX, bannerY, bannerWidth, bannerHeight, opacity);
    }
  }

  _calculateBlinkVisibility(elapsed) {
    if (elapsed >= this.blinkDuration) return true;
    
    const blinkProgress = (elapsed % 500) / 500;
    return blinkProgress < 0.25 || (blinkProgress > 0.5 && blinkProgress < 0.75);
  }

  _drawBanner(ctx, x, y, width, height, opacity) {
    // Draw background
    ctx.fillStyle = `rgba(200, 0, 0, ${0.85 * opacity})`;
    ctx.fillRect(x, y, width, height);
    
    // Draw text with shadow
    ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = `rgba(0, 0, 0, ${0.7 * opacity})`;
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(this.messageText, x + width / 2, y + height / 2);
    
    // Reset shadows
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  showBriefly(message, duration = 3000) {
    this.messageText = message;
    this.showMessage = true;
    this.startTime = Date.now();
    this.animationDuration = duration;
    this.blinkDuration = Math.min(1500, duration - 500);
    
    setTimeout(() => {
      this.showMessage = false;
    }, duration);
  }
}