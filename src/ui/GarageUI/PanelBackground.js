import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig";
export class PanelBackground {
  static draw(ctx, x, y, width, height) {
    const backgroundConfig = UNIVERSAL_PANEL_CONFIG.LAYOUT.backgroundGradient;
    
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, backgroundConfig.start);
    gradient.addColorStop(1, backgroundConfig.end);

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }
}