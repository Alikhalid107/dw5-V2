import { PanelBase } from './PanelBase.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';

export class MessageDisplay extends PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG.MESSAGE_DISPLAY) {
    super();
    this.config = config;
    this.showMessage = false;
    this.messageText = "";
    this.messageTimer = 0;
    this.startTime = 0;
    this.animationDuration = this.config.animation.duration;
    this.blinkDuration = this.config.animation.blinkDuration;
  }

  draw(ctx) {
    if (!this.showMessage) return;
    
    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;
    const progress = Math.min(elapsed / this.animationDuration, 1);
    
    // Calculate opacity with fade out
    let opacity = 1;
    const fadeStartTime = this.animationDuration - this.config.animation.fadeOutDuration;
    if (elapsed > fadeStartTime) {
      opacity = 1 - ((elapsed - fadeStartTime) / this.config.animation.fadeOutDuration);
    }
    
    // Calculate banner dimensions and position
    const paddingX = this.config.styling.paddingX;
    ctx.font = this.config.styling.font;
    const textWidth = ctx.measureText(this.messageText).width;
    const bannerWidth = textWidth + paddingX * 2;
    const bannerHeight = this.config.styling.bannerHeight;
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
    
    const blinkProgress = (elapsed % this.config.blink.cycleDuration) / this.config.blink.cycleDuration;
    
    // Check if current progress falls within any visible range
    return this.config.blink.visibleRanges.some(range => 
      blinkProgress >= range.start && blinkProgress < range.end
    );
  }

  _drawBanner(ctx, x, y, width, height, opacity) {
    // Draw background
    const bgColor = this.config.styling.backgroundColor.replace('0.85', (0.85 * opacity).toString());
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);
    
    // Draw text with shadow
    const textColor = this.config.styling.textColor.replace('1)', `${opacity})`);
    ctx.fillStyle = textColor;
    ctx.font = this.config.styling.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const shadowColor = this.config.styling.shadowColor.replace('0.7', (0.7 * opacity).toString());
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = this.config.styling.shadowBlur;
    ctx.shadowOffsetX = this.config.styling.shadowOffsetX;
    ctx.shadowOffsetY = this.config.styling.shadowOffsetY;
    
    ctx.fillText(this.messageText, x + width / 2, y + height / 2);
    
    // Reset shadows
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  showBriefly(message, duration = null) {
    this.messageText = message;
    this.showMessage = true;
    this.startTime = Date.now();
    this.animationDuration = duration || this.config.animation.duration;
    this.blinkDuration = Math.min(this.config.animation.blinkDuration, this.animationDuration - this.config.animation.fadeOutDuration);
    
    setTimeout(() => {
      this.showMessage = false;
    }, this.animationDuration);
  }
}