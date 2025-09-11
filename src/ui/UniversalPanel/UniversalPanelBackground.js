export class UniversalPanelBackground {
  static draw(ctx, x, y, width, height, styling) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, styling.backgroundColor);
    gradient.addColorStop(1, styling.backgroundColor);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    // Optional border
    if (styling.borderColor && styling.borderColor !== styling.backgroundColor) {
      ctx.strokeStyle = styling.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    }
  }
}