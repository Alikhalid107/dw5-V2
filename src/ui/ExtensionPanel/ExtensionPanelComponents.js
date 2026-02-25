import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { EXTENSION_PANEL_CONFIG } from "../../config/ExtensionPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";
import { IconManager } from "../../utils/IconManager.js";

export class ExtensionPanelComponents {
  constructor() {
    this.gridConfig = this._createGridConfig();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes: 4 });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.iconManager = new IconManager();
  }

  _createGridConfig() {
    const { grid } = UNIVERSAL_PANEL_CONFIG;
    const preset = grid.tower; // ← reuse tower preset (same sizing)
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

  setupBoxDescriptions(extensionManager = null) {
    this.extensionManager = extensionManager;
    this.boxes[0].description = (em) => this.getExtADescription(em);
    this.boxes[1].description = (em) => this.getExtBDescription(em);
    this.boxes[2].description = (em) => this.getExtCDescription(em);
    this.boxes[3].description = (em) => this.getExtDDescription(em);
  }

  getExtADescription(em) {
    return [
      { segments: [{ text: "Extension A", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [
        { text: "Description here", color: "white", font: "12px Arial", align: "left" },
      ]},
      { segments: [
        { text: "Detail line", color: "white", font: "12px Arial", align: "left" },
        { text: "Titan 50", color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getExtBDescription(em) {
  if (em?.upgradingAll) {
    const remaining = Math.max(0, Math.ceil(
      (em.upgradeAllTime - em.upgradeAllTimer) / 1000
    ));
    return [
      { segments: [{ text: "Upgrading All...", color: "orange", font: "15px Arial", align: "left" }] },
      { segments: [{ text: `${remaining}s remaining`, color: "white", font: "12px Arial", align: "left" }] },
    ];
  }

  const canUpgrade = Object.values(em?.factoryManager?.factories || {})
    .some(f => !f.isMaxLevel());

  if (!canUpgrade) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
  }

  return [
    { segments: [{ text: "Upgrade All", color: "white", font: "15px Arial", align: "left" }] },
    { segments: [{ text: "Upgrades all factories", color: "white", font: "12px Arial", align: "left" }] },
    { segments: [
      { text: "to max level", color: "white", font: "12px Arial", align: "left" },
      { text: "Titan 500", color: "#A6C7FA", font: "12px Arial", align: "right" }
    ]},
  ];
}

  getExtCDescription(em) {
    return [
      { segments: [{ text: "Extension C", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Description here", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [
        { text: "Detail line", color: "white", font: "12px Arial", align: "left" },
        { text: "Titan 50", color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getExtDDescription(em) {
    return [
      { segments: [{ text: "Extension D", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Description here", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [
        { text: "Detail line", color: "white", font: "12px Arial", align: "left" },
        { text: "Titan 50", color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getHoveredDescription() {
    const hovered = this.boxes.find(box => box.state.isHovered);
    if (!hovered) return null;
    const desc = hovered.description;
    return typeof desc === "function" ? desc(this.extensionManager) : desc;
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

  update(deltaTime) {
    // add animations here if needed later
  }

  draw(ctx, panelX, panelY, extensionManager = null) {
    const panelBounds = {
      x: panelX, y: panelY,
      width: this.panelWidth, height: this.panelHeight
    };

    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      box.draw(ctx, panelX, panelY, {
        renderType: "extension",
        panelBounds,
        iconManager: this.iconManager,
        extensionManager,
        boxIndex: box.index,
      });
    });
  }
}