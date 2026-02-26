import { TOWER_PANEL_CONFIG } from "../../config/TowerPanelConfig.js";
import { TowerPanelComponents } from "./TowerPanelComponents.js";
import { BasePanel } from "../BasePanel/BasePanel.js";

export class TowerPanel extends BasePanel {
  constructor(baseX = 0, baseY = 0) {
    super(TOWER_PANEL_CONFIG, new TowerPanelComponents(), baseX, baseY);
    this.towerManager = null;
  }

  setTowerManager(towerManager) {
    this.towerManager = towerManager;
    this.components.setupBoxDescriptions(towerManager);
  }

  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.isVisible) return;
    this.drawPanel(ctx, offsetX, offsetY, this.towerManager);
    // Override drawDebug label (BasePanel.drawPanel already calls drawDebug,
    // but we need to pass the label — so we re-call with the right label via
    // the hook below)
  }

  // Override to pass the "TOWER" label to the debug overlay
  drawDebug(ctx, offsetX, offsetY) {
    super.drawDebug(ctx, offsetX, offsetY, "TOWER");
  }
}