import { BasePanel } from "../BasePanel/BasePanel.js";
import { CommandPanelComponents } from "./CommandPanelComponents.js";
import { COMMAND_PANEL_CONFIG } from "../../config/CommandPanelConfig.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";

export class CommandPanel extends BasePanel {
  constructor(baseX = 0, baseY = 0, cfg = {}) {
  super(COMMAND_PANEL_CONFIG, new CommandPanelComponents(), baseX, baseY, cfg);
  this.commandManager = null;
}

  setCommandManager(commandManager) {
    this.commandManager = commandManager;
    this.components.setupBoxDescriptions(commandManager);
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

    UniversalPanelRenderer.drawPanelBackground(ctx, panelX, panelY, width, height,
      { color: this.config.styling.backgroundColor }
    );

    this.drawPanelHeader(ctx, panelX, panelY, width, height);
    this.components.draw(ctx, panelX, panelY, this.commandManager);
    this.drawDebug(ctx, offsetX, offsetY, "CMD HOVER", "CMD PANEL");
  }
}