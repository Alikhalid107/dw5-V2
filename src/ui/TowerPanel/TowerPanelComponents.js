import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { TOWER_PANEL_CONFIG } from "../../config/TowerPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";
import { TowerSpriteManager } from "../../utils/TowerSpriteManager.js";
import { IconManager } from "../../utils/IconManager.js";


export class TowerPanelComponents {
  constructor() {
    this.gridConfig = this._createGridConfig();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes: 4 });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.spriteManager = new TowerSpriteManager();
    this.iconManager = new IconManager(); // ← add

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

  setupBoxDescriptions(towerManager = null) {
  this.towerManager = towerManager;
  this.boxes[0].description = (tm) => this.getCommandDescription(tm);
  this.boxes[1].description = (tm) => this.getRadarDescription(tm);
  this.boxes[2].description = (tm) => this.getJammerDescription(tm);
  this.boxes[3].description = (tm) => this.getDetectorDescription(tm);
}

getCommandDescription(tm) {
  const building = tm?.militaryBuilding;
  const buildingRight = tm?.militaryBuildingRight;
  const bothMax = building?.isMaxLevel() && buildingRight?.isMaxLevel();

  if (bothMax) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
  }

  // Cumulative level — left contributes 1-5, right adds on top making 6-9
  const leftLevel = building?.level || 0;
  const rightLevel = buildingRight?.level || 0;
  const totalLevel = leftLevel + rightLevel;  // ← 5 + 1 = 6, 5 + 4 = 9
  const maxLevel = 9;

  const time = 10 + totalLevel * 2;
  const titan = 25 + totalLevel * 5;

  return [
    { segments: [{ text: "Military central", color: "white", font: "16px Arial", align: "left" }] },
    { segments: [
      { text: "build up", color: "white", font: "12px Arial", align: "left" },
      { text: `${time}sec`, color: "white", font: "12px Arial", align: "right" }
    ]},
    { segments: [
      { text: `to level ${totalLevel + 1}`, color: "white", font: "12px Arial", align: "left" },
      { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
    ]},
  ];
}

getRadarDescription(tm) {
    const titan = 100 ; // example: increase titan cost with level

  if (tm?.radarBuilding) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
  }
  return [
    { segments: [{ text: "Radar Tower", color: "white", font: "16px Arial", align: "left" }] },
    { segments: [
      { text: "More sight range", color: "white", font: "12px Arial", align: "left" },
    ]},
    { segments: [
      { text: "(Fog of War)", color: "white", font: "12px Arial", align: "left" },
    ]},
    { segments: [
      { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
    ]},
  ];
}

getJammerDescription(tm) {
      const titan = 50 ; // example: increase titan cost with level

  if (tm?.jammerBuilding) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
  }
  return [
    { segments: [{ text: "Jammer Tower", color: "white", font: "16px Arial", align: "left" }] },
    { segments: [
      { text: "Jamming the area", color: "white", font: "12px Arial", align: "left" },
    ]},
    { segments: [
      { text: "around this base", color: "white", font: "12px Arial", align: "left" },
    ]},
     { segments: [
      { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
    ]},
  ];
}

getDetectorDescription(tm) {
        const titan = 25 ; // example: increase titan cost with level

  if (tm?.detectorBuilding) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
  }
  return [
    { segments: [{ text: "Detector Tower", color: "white", font: "16px Arial", align: "left" }] },
    { segments: [
      { text: "can detect stealthed units", color: "white", font: "12px Arial", align: "left" },
    ]},
    { segments: [
      { text: "around this base", color: "white", font: "12px Arial", align: "left" },
    ]},
     { segments: [
      { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
    ]},
  ];
}

getHoveredDescription() {
  const hovered = this.boxes.find(box => box.state.isHovered);
  if (!hovered) return null;
  const desc = hovered.description;
  // Call with towerManager if it's a function
  return typeof desc === "function" ? desc(this.towerManager) : desc;
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

  draw(ctx, panelX, panelY, towerManager = null) {
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
      spriteManager: this.spriteManager,
      iconManager: this.iconManager,  // ← add
      towerManager
    });
  });
}
}