import { PanelBase } from './PanelBase.js';

export class MessageDisplay extends PanelBase {
  constructor() {
    super();
    this.showMessage = false;
    this.messageText = "";
    this.messageTimer = 0;
  }

  draw(ctx, panelX, panelY, panelWidth) {
    if (!this.showMessage) return;
    const w = 180,
      h = 40;
    const mx = panelX + (panelWidth - w) / 2,
      my = panelY - 50;
    ctx.fillStyle = "rgba(255,100,100,0.9)";
    ctx.fillRect(mx, my, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(mx, my, w, h);
    ctx.fillStyle = "white";
    ctx.font = "9px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.messageText, mx + w / 2, my + h / 2 + 3);
  }

  showBriefly(message, duration = 3000) {
    this.messageText = message;
    this.showMessage = true;
    this.messageTimer = 0;
    setTimeout(() => {
      this.showMessage = false;
    }, duration);
  }
}

