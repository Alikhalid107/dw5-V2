import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

/**
 * BasePanel — shared logic for hover-triggered panels (TowerPanel, ExtensionPanel).
 *
 * Previously isPointInHoverArea(), getPanelPosition(), updateHover(),
 * handleClick(), and the skeleton of draw() / drawPanelHeader() / drawDebug()
 * were copy-pasted between TowerPanel and ExtensionPanel. Only the debug label
 * string and the manager reference name differed.
 */
export class BasePanel {
  constructor(config, components, baseX = 0, baseY = 0) {
    this.config     = config;
    this.components = components;
    this.baseX      = baseX;
    this.baseY      = baseY;
    this.isVisible  = false;
  }

  // ── Hover / position ────────────────────────────────────────────────────────

  isPointInHoverArea(mouseX, mouseY) {
    const { x, y, width, height } = this.config.hoverArea;
    const worldX = x + this.baseX;
    const worldY = y + this.baseY;
    return mouseX >= worldX && mouseX <= worldX + width &&
           mouseY >= worldY && mouseY <= worldY + height;
  }

  getPanelPosition() {
    const { x, y, width }       = this.config.hoverArea;
    const { offsetX, offsetY }  = this.config.panel;
    const pw = this.components.panelWidth;
    return {
      x: (x + this.baseX) + width / 2 - pw / 2 + offsetX,
      y: (y + this.baseY) + offsetY,
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

  // ── Drawing ─────────────────────────────────────────────────────────────────

  /**
   * Subclasses call this from their own draw(), passing the manager they hold
   * (towerManager / extensionManager) so components.draw() receives it.
   */
  drawPanel(ctx, offsetX, offsetY, manager) {
    const pos     = this.getPanelPosition();
    const panelX  = pos.x - offsetX;
    const panelY  = pos.y - offsetY;
    const width   = this.components.panelWidth;
    const height  = this.components.panelHeight;

    this.components.currentOffsetX = offsetX;
    this.components.currentOffsetY = offsetY;

    UniversalPanelRenderer.drawPanelBackground(ctx, panelX, panelY, width, height,
      { color: this.config.styling.backgroundColor }
    );

    this.drawPanelHeader(ctx, panelX, panelY, width, height);
    this.components.draw(ctx, panelX, panelY, manager);
    this.drawDebug(ctx, offsetX, offsetY);
  }

  drawPanelHeader(ctx, panelX, panelY, panelWidth, panelHeight) {
    const desc = this.components.getHoveredDescription();

    if (!desc) {
      ctx.fillStyle   = this.config.styling.headerColor;
      ctx.font        = this.config.styling.headerFont;
      ctx.textAlign   = "left";
      ctx.fillText(this.config.styling.headerText, panelX + 8, panelY + 14);
      return;
    }

    const lineHeight = 13;
    const panelRight = panelX + panelWidth - 4;
    const panelLeft  = panelX + 4;

    ctx.save();
    ctx.beginPath();
    ctx.rect(panelX, panelY, panelWidth, panelHeight);
    ctx.clip();

    desc.forEach((line, i) => {
      const y = panelY + 14 + i * lineHeight;
      if (y > panelY + panelHeight) return;

      const leftSegs  = (line.segments || []).filter(s => s.align !== "right");
      const rightSegs = (line.segments || []).filter(s => s.align === "right");

      let currentX = panelLeft;
      leftSegs.forEach(seg => {
        ctx.font      = seg.font  || "12px Arial";
        ctx.fillStyle = seg.color || "white";
        ctx.textAlign = "left";
        ctx.fillText(seg.text, currentX, y);
        currentX += ctx.measureText(seg.text).width + 2;
      });

      let rightX = panelRight;
      [...rightSegs].reverse().forEach(seg => {
        ctx.font      = seg.font  || "12px Arial";
        ctx.fillStyle = seg.color || "white";
        ctx.textAlign = "right";
        ctx.fillText(seg.text, rightX, y);
        rightX -= ctx.measureText(seg.text).width + 2;
      });
    });

    ctx.restore();
  }

  /**
   * debugLabel: e.g. "TOWER" or "EXT" — used to stamp "TOWER HOVER" / "TOWER PANEL"
   */
  drawDebug(ctx, offsetX, offsetY, debugLabel = "PANEL") {
    if (!this.config.debug.enabled) return;

    const { x, y, width, height } = this.config.hoverArea;
    const worldX = x + this.baseX;
    const worldY = y + this.baseY;
    const pos    = this.getPanelPosition();
    const pw     = this.components.panelWidth;
    const ph     = this.components.panelHeight;
    const { hoverAreaColor, panelAreaColor, lineWidth, lineDash } = this.config.debug;

    ctx.save();
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(lineDash);

    ctx.strokeStyle = hoverAreaColor;
    ctx.strokeRect(worldX - offsetX, worldY - offsetY, width, height);
    ctx.fillStyle   = hoverAreaColor;
    ctx.font        = "11px Arial";
    ctx.textAlign   = "left";
    ctx.fillText(`${debugLabel} HOVER`, worldX - offsetX + 4, worldY - offsetY + 14);

    ctx.strokeStyle = panelAreaColor;
    ctx.strokeRect(pos.x - offsetX, pos.y - offsetY, pw, ph);
    ctx.fillStyle   = panelAreaColor;
    ctx.fillText(`${debugLabel} PANEL`, pos.x - offsetX + 4, pos.y - offsetY + 14);

    ctx.setLineDash([]);
    ctx.restore();
  }
}