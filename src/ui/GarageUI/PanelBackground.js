// PanelBackground.js
export class PanelBackground {
  static draw(ctx, x, y, width, height) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, 'rgba(21, 59, 70, 0.90)');
    gradient.addColorStop(1, 'rgba(21, 59, 70, 0.90)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }
}