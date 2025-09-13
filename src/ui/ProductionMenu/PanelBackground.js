import { PanelBase } from './PanelBase.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';

export class PanelBackground extends PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG) {
    super();
    this.config = config;
  }

  drawBackground(ctx, x, y, panelWidth, panelHeight) {
    if (!isFinite(x) || !isFinite(y)) return;
    
    // Increase panel width to accommodate all buttons in a row
    const expandedWidth = panelWidth + this.config.LAYOUT.expandedPanelWidthOffset;
    
    const g = ctx.createLinearGradient(x, y, x, y + panelHeight);
    g.addColorStop(0, this.config.LAYOUT.backgroundGradient.start);
    g.addColorStop(1, this.config.LAYOUT.backgroundGradient.end);
    ctx.fillStyle = g;
    ctx.fillRect(x, y, expandedWidth, panelHeight);
  }

  drawFactoryInfo(ctx, x, y, factory) {
    const { positioning, text } = this.config.COMPONENTS;
    
    this.drawText(
      ctx,
      factory.name.replace(" Factory", ""),
      x + positioning.factoryInfoOffsetX,
      y + positioning.factoryInfoOffsetY1,
      text.factoryNameFont
    );
    
    const statusText = factory.upgrading
      ? `Upgrading... ${factory.getRemainingUpgradeTime()}s`
      : factory.isMaxLevel()
      ? `Level ${factory.level} (MAX)`
      : `Level ${factory.level} → ${factory.level + 1}`;
      
    this.drawText(
      ctx,
      statusText,
      x + positioning.factoryInfoOffsetX,
      y + positioning.factoryInfoOffsetY2,
      text.factoryStatusFont,
      "left",
      text.colors.factoryStatus
    );
  }
}