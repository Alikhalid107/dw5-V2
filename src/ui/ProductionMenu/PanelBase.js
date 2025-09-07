export class PanelBase {
  constructor() {}

  _bounds(x, y, w, h) {
    return { x, y, width: w, height: h };
  }

  isPointInBounds(x, y, b) {
    if (!b) return false;
    return x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
  }

  drawText(
    ctx,
    text,
    x,
    y,
    font = "12px Arial",
    align = "left",
    style = "white"
  ) {
    ctx.fillStyle = style;
    ctx.font = font;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  _drawRoundedRect(ctx, x, y, w, h) {
    // kept simple (no corner radius change) to preserve visual behavior
    ctx.fillRect(x, y, w, h);
  }
}