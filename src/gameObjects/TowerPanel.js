import { TOWER_PANEL_CONFIG } from "../config/TowerPanelConfig.js";
import { TowerPanelComponents } from "../ui/TowerPanel/TowerPanelComponents.js";
import { UniversalPanelRenderer } from "../universal/UniversalPanelRenderer.js";

export class TowerPanel {
  constructor(baseX = 0, baseY = 0) {
    this.config = TOWER_PANEL_CONFIG;
    this.baseX = baseX;
    this.baseY = baseY;
    this.components = new TowerPanelComponents();
    this.isVisible = false;
  }

  isPointInHoverArea(mouseX, mouseY) {
    const { x, y, width, height } = this.config.hoverArea;
    const worldX = x + this.baseX;
    const worldY = y + this.baseY;
    return mouseX >= worldX && mouseX <= worldX + width &&
           mouseY >= worldY && mouseY <= worldY + height;
  }

  getPanelPosition() {
    const { x, y, width } = this.config.hoverArea;
    const { offsetX, offsetY } = this.config.panel;
    const pw = this.components.panelWidth;
    return {
      x: (x + this.baseX) + width / 2 - pw / 2 + offsetX,
      y: (y + this.baseY) + offsetY
    };
  }

  updateHover(mouseX, mouseY) {
    this.isVisible = this.isPointInHoverArea(mouseX, mouseY);
    if (this.isVisible) {
      const pos = this.getPanelPosition();
      this.components.updateHoverStates(mouseX, mouseY, pos.x, pos.y);
    }
  }

  handleClick(mouseX, mouseY) {
    if (!this.isVisible) return null;
    const pos = this.getPanelPosition();
    return this.components.getClickedBox(mouseX, mouseY, pos.x, pos.y);
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isVisible) return;

    const pos = this.getPanelPosition();
    const panelX = pos.x - offsetX;
    const panelY = pos.y - offsetY;
    const width = this.components.panelWidth;
    const height = this.components.panelHeight;

    this.components.currentOffsetX = offsetX;
    this.components.currentOffsetY = offsetY;

    // Use UniversalPanelRenderer same as IndividualFactoryPanel
    UniversalPanelRenderer.drawPanelBackground(ctx, panelX, panelY, width, height,
      { color: this.config.styling.backgroundColor }
    );

    ctx.fillStyle = this.config.styling.headerColor;
    ctx.font = this.config.styling.headerFont;
    ctx.textAlign = "left";
    ctx.fillText(this.config.styling.headerText, panelX + 8, panelY + 18);

    this.components.draw(ctx, panelX, panelY);
    this.drawDebug(ctx, offsetX, offsetY);
  }

  drawDebug(ctx, offsetX, offsetY) {
    if (!this.config.debug.enabled) return;

    const { x, y, width, height } = this.config.hoverArea;
    const worldX = x + this.baseX;
    const worldY = y + this.baseY;
    const pos = this.getPanelPosition();
    
    // Use auto-calculated dimensions, not config.panel
    const pw = this.components.panelWidth;
    const ph = this.components.panelHeight;
    
    const { hoverAreaColor, panelAreaColor, lineWidth, lineDash } = this.config.debug;

    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(lineDash);

    ctx.strokeStyle = hoverAreaColor;
    ctx.strokeRect(worldX - offsetX, worldY - offsetY, width, height);
    ctx.fillStyle = hoverAreaColor;
    ctx.font = "11px Arial";
    ctx.textAlign = "left";
    ctx.fillText("TOWER HOVER", worldX - offsetX + 4, worldY - offsetY + 14);

    ctx.strokeStyle = panelAreaColor;
    ctx.strokeRect(pos.x - offsetX, pos.y - offsetY, pw, ph);
    ctx.fillStyle = panelAreaColor;
    ctx.fillText("TOWER PANEL", pos.x - offsetX + 4, pos.y - offsetY + 14);

    ctx.setLineDash([]);
    ctx.restore();
  }
}