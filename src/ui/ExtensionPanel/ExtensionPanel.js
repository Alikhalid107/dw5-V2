import { EXTENSION_PANEL_CONFIG } from "../../config/ExtensionPanelConfig.js";
import { ExtensionPanelComponents } from "./ExtensionPanelComponents.js";
import { BasePanel } from "../BasePanel/BasePanel.js";

export class ExtensionPanel extends BasePanel {
  constructor(baseX = 0, baseY = 0, cfg = {}) {
  super(EXTENSION_PANEL_CONFIG, new ExtensionPanelComponents(), baseX, baseY, cfg);
  this.extensionManager = null;
}

  setExtensionManager(extensionManager) {
    this.extensionManager = extensionManager;
    this.components.setupBoxDescriptions(extensionManager);
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isVisible) return;
    this.drawPanel(ctx, offsetX, offsetY, this.extensionManager);
  }

  // Override to pass the "EXT" label to the debug overlay
  drawDebug(ctx, offsetX, offsetY) {
    super.drawDebug(ctx, offsetX, offsetY, "EXT");
  }
}