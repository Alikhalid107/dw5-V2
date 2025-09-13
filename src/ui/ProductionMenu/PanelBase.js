import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig';

export class PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG) {
    this.config = config;
  }

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
    font = null,
    align = "left",
    style = null
  ) {
    const defaultFont = font || this.config.COMPONENTS.text.defaultFont;
    const defaultStyle = style || this.config.COMPONENTS.text.colors.primary;
    
    ctx.fillStyle = defaultStyle;
    ctx.font = defaultFont;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
  }

  _drawRoundedRect(ctx, x, y, w, h) {
    // kept simple (no corner radius change) to preserve visual behavior
    ctx.fillRect(x, y, w, h);
  }
}