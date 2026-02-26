import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";

/**
 * BasePanelComponents — shared grid/layout/hover logic for panel component classes.
 *
 * Previously _createGridConfig(), calculatePanelDimensions(), updateHoverStates(),
 * and getClickedBox() were word-for-word identical in both TowerPanelComponents
 * and ExtensionPanelComponents. They live here once.
 */
export class BasePanelComponents {
  constructor(totalBoxes) {
    this.gridConfig = this._createGridConfig();
    this.boxes      = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes });
    this.calculatePanelDimensions();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
  }

  _createGridConfig() {
    const { grid } = UNIVERSAL_PANEL_CONFIG;
    const preset   = grid.tower;
    return {
      rows:      preset.rows,
      cols:      preset.cols,
      boxWidth:  grid.boxWidth,
      boxHeight: grid.boxHeight,
      spacing:   grid.spacing,
      alignment: { ...grid.alignment, ...(preset.alignment || {}) },
    };
  }

  calculatePanelDimensions() {
    const { alignment, cols, rows, boxWidth, boxHeight, spacing } = this.gridConfig;
    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = alignment || {};
    this.panelWidth  = cols * boxWidth  + (cols - 1) * spacing + paddingLeft + paddingRight;
    this.panelHeight = rows * boxHeight + (rows - 1) * spacing + paddingTop  + paddingBottom;
  }

  calculatePosition(row, col, panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(panelX, panelY, row, col, this.gridConfig);
  }

  updateHoverStates(mouseX, mouseY, panelX, panelY) {
    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
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

  getHoveredDescription() {
    const hovered = this.boxes.find(box => box.state.isHovered);
    if (!hovered) return null;
    const desc = hovered.description;
    return typeof desc === "function" ? desc(this.manager) : desc;
  }
}