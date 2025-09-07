import { PanelBase } from './PanelBase.js';

export class PanelBackground extends PanelBase {
  constructor() {
    super();
  }

  drawBackground(ctx, x, y, panelWidth, panelHeight) {
    if (!isFinite(x) || !isFinite(y)) return;
    const g = ctx.createLinearGradient(x, y, x, y + panelHeight);
    g.addColorStop(0, "rgba(21, 59, 70, 0.85)");
    g.addColorStop(1, "rgba(21, 59, 70, 0.75)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, panelWidth, panelHeight);
  }

  drawFactoryInfo(ctx, x, y, factory) {
    this.drawText(
      ctx,
      factory.name.replace(" Factory", ""),
      x + 10,
      y + 25,
      "700 12px Arial"
    );
    const statusText = factory.upgrading
      ? `Upgrading... ${factory.getRemainingUpgradeTime()}s`
      : factory.isMaxLevel()
      ? `Level ${factory.level} (MAX)`
      : `Level ${factory.level} → ${factory.level + 1}`;
    this.drawText(
      ctx,
      statusText,
      x + 10,
      y + 45,
      "12px Arial",
      "left",
      "rgba(255,255,255,0.8)"
    );
  }
}
