import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig";
export class UniversalPanelRenderer {
  static drawPanelBackground(ctx, x, y, width, height, config = UNIVERSAL_PANEL_CONFIG.LAYOUT) {
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, config.backgroundGradient.start);
    gradient.addColorStop(1, config.backgroundGradient.end);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
  }

  static drawGridBox(ctx, x, y, width, height, content, isHovered, config = UNIVERSAL_PANEL_CONFIG.GRID) {
    // Box background
    ctx.fillStyle = content.backgroundColor || config.boxColors.available;
    ctx.fillRect(x, y, width, height);

    // Hover effect
    if (isHovered) {
      ctx.fillStyle = config.hoverEffect;
      ctx.fillRect(x, y, width, height);
    }

    // Draw content text
    if (content.text && content.text.length > 0) {
      ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
      ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.defaultFont;
      ctx.textAlign = 'center';

      const centerX = x + width / 2;
      content.text.forEach((line, index) => {
        const textY = y + GARAGE_UI_CONFIG.content.textOffsetY[index];
        ctx.fillText(line, centerX, textY);
      });
    }

    // Draw progress bar if needed
    if (content.progress !== undefined) {
      const progressConfig = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress;
      const progressBarWidth = width - 10;
      const progressX = x + 5;
      const progressY = y + height - GARAGE_UI_CONFIG.content.progressBarOffset;

      ctx.fillStyle = progressConfig.backgroundColor;
      ctx.fillRect(progressX, progressY, progressBarWidth, progressConfig.height);

      ctx.fillStyle = progressConfig.fillColor;
      ctx.fillRect(progressX, progressY, progressBarWidth * content.progress, progressConfig.height);
    }
  }

  static drawDebugBorders(ctx, panelPos, hoverPos, targetPos, config = UNIVERSAL_PANEL_CONFIG.DEBUG) {
    if (!config.enabled) return;

    ctx.save();
    
    // Hover area (red border)
    ctx.strokeStyle = config.colors.hoverArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.hoverArea);
    ctx.strokeRect(hoverPos.x, hoverPos.y, hoverPos.width, hoverPos.height);
    
    // Panel area (blue border)
    ctx.strokeStyle = config.colors.panelArea;
    ctx.lineWidth = 3;
    ctx.setLineDash(config.lineStyles.panelArea);
    ctx.strokeRect(panelPos.x, panelPos.y, panelPos.width, panelPos.height);
    
    // Target area (green border)
    ctx.strokeStyle = config.colors.targetArea;
    ctx.lineWidth = 2;
    ctx.setLineDash(config.lineStyles.targetArea);
    ctx.strokeRect(targetPos.x, targetPos.y, targetPos.width, targetPos.height);
    
    // Labels
    ctx.fillStyle = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary;
    ctx.font = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.titleFont;
    ctx.fillText('HOVER', hoverPos.x + 5, hoverPos.y + 15);
    ctx.fillText('PANEL', panelPos.x + 5, panelPos.y + 15);
    ctx.fillText('TARGET', targetPos.x + 5, targetPos.y + 15);
    
    ctx.restore();
  }
}