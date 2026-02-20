import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { TOWER_PANEL_CONFIG } from "../../config/TowerPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";
import { TowerSpriteManager } from "../../utils/TowerSpriteManager.js";

export class TowerPanelComponents {
  constructor() {
    this.gridConfig = this._createGridConfig();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes: 4 });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.spriteManager = new TowerSpriteManager();
  }

  _createGridConfig() {
    const { grid } = UNIVERSAL_PANEL_CONFIG;
    const preset = grid.tower;
    return {
      rows: preset.rows,
      cols: preset.cols,
      boxWidth: grid.boxWidth,
      boxHeight: grid.boxHeight,
      spacing: grid.spacing,
      alignment: { ...grid.alignment, ...(preset.alignment || {}) }
    };
  }

  calculatePanelDimensions() {
    const { alignment, cols, rows, boxWidth, boxHeight, spacing } = this.gridConfig;
    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = alignment || {};
    this.panelWidth = cols * boxWidth + (cols - 1) * spacing + paddingLeft + paddingRight;
    this.panelHeight = rows * boxHeight + (rows - 1) * spacing + paddingTop + paddingBottom;
  }

  setupBoxDescriptions() {
    const labels = ["Command", "Radar", "Jammer", "Detector"];
    this.boxes.forEach((box, i) => {
      box.description = labels[i] || `Tower ${i + 1}`;
    });
  }

  // Called every frame from TowerManager.update()
  update(deltaTime) {
  const box1 = this.boxes[1];
  const box3 = this.boxes[3];
  this.spriteManager.update(
    deltaTime,
    box1?.state?.isHovered || false,
    box3?.state?.isHovered || false
  );
}

  calculatePosition(row, col, panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(
      panelX, panelY, row, col, this.gridConfig
    );
  }

  updateHoverStates(mouseX, mouseY, panelX, panelY) {
  this.boxes.forEach(box => {
    const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
    box.state.setBounds(pos.x, pos.y);
    // Use state.isPointInside directly — panelX/Y are already screen coords
    box.state.isHovered = box.state.isPointInside(mouseX, mouseY);
  });
}

  getClickedBox(mouseX, mouseY, panelX, panelY) {
    return this.boxes.find(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      return box.state.isPointInside(mouseX, mouseY);
    }) || null;
  }

  draw(ctx, panelX, panelY) {
    const panelBounds = {
      x: panelX, y: panelY,
      width: this.panelWidth, height: this.panelHeight
    };

    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);

      box.draw(ctx, panelX, panelY, {
        renderType: "tower",
        label: box.description,
        panelBounds,
        spriteManager: this.spriteManager  // ← pass sprite manager
      });
    });
  }
}