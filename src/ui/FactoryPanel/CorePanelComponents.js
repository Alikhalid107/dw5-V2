// src/ui/FactoryPanel/CorePanelComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UPGRADE_REQUIREMENTS } from "../../config/FactoryConfig.js";
import { MessageBus } from "../../utils/MessageBus.js";
import { IconManager } from "../../utils/IconManager.js";
import { FactorySpriteManager } from "../UpgradeMenu/FactorySpriteManager.js";
import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";

export class CorePanelComponents {
  constructor(config, iconManager = null, spriteManager = null) {
    this.config = config;
    this.iconManager = iconManager || new IconManager();
    this.spriteManager = spriteManager || new FactorySpriteManager(UPGRADE_BUTTON_CONFIG);
    this.gridConfig = this._createGridConfig();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes: 3 });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
    this._messageForwarder = null;
  }

  _createGridConfig() {
    const { grid } = UNIVERSAL_PANEL_CONFIG;
    const preset = grid.factory;
    return {
      rows: preset.rows,
      cols: preset.cols,
      boxWidth: grid.boxWidth,
      boxHeight: grid.boxHeight,
      spacing: grid.spacing,
      alignment: { ...grid.alignment, ...(preset.alignment || {}) },
    };
  }

  calculatePanelDimensions() {
    const { alignment, cols, rows, boxWidth, boxHeight, spacing } = this.gridConfig;
    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = alignment || {};
    
    this.panelWidth = cols * boxWidth + (cols - 1) * spacing + paddingLeft + paddingRight;
    this.panelHeight = rows * boxHeight + (rows - 1) * spacing + paddingTop + paddingBottom;
  }

  setupBoxDescriptions() {
    const descriptions = [
      (f) => this.getUpgradeDescription(f),
      (f) => this.getProductionDescription(f, 1),
      (f) => this.getProductionDescription(f, 15),
    ];
    this.boxes.forEach((box, i) => descriptions[i] && (box.description = descriptions[i]));
  }

  getUpgradeDescription(factory) {
  const req = UPGRADE_REQUIREMENTS[factory.type];
  const nextLevel = factory.level + 1;

  if (!req?.levels[nextLevel]) {
    return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center" }] }];
  }

  const { cost, time } = req.levels[nextLevel];
  const { name: resName, color: resColor } = req.resource;

  return [
    { 
      segments: [{ text: factory.name, color: "white", font: "15px Arial", align: "left" }] 
    },
    { 
      segments: [
        { text: "Build up", color: "white", font: "12px Arial", align: "left" },
        { text: `${time}sec`, color: "white", font: "12px Arial", align: "right" }  // ← right side
      ] 
    },
    {
      segments: [
        { text: `to Level ${nextLevel}`, color: "white", font: "12px Arial", align: "left" },
        { text: `${resName} ${cost}`, color: resColor, font: "12px Arial", align: "right" }  // ← right side
      ]
    },
  ];
}

  getProductionDescription(factory, hours) {
  if (!factory) return "Production unavailable";

  const { production } = UPGRADE_REQUIREMENTS[factory.type];
  const { cost, name: resName, color: resColor } = production;

  return [
    { segments: [{ text: `${hours} Hour${hours > 1 ? 's' : ''}`, color: "white", font: "15px Arial", align: "left" }] },
    { segments: [{ text: factory.resource, color: "white", font: "12px Arial", align: "left" }] },
    {
      segments: [
        { text: "production", color: "white", font: "12px Arial", align: "left" },
        { text: `Titan ${cost * hours}`, color: resColor, font: "12px Arial", align: "right" }
      ]
    },
  ];
}

  calculatePosition(row, col, panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(panelX, panelY, row, col, this.gridConfig);
  }

  handleFactoryGridClick(relativeX, relativeY, factory, panelX, panelY) {
    const clickedBox = this.boxes.find((box) => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      return box.state.isPointInside(relativeX, relativeY);
    });

    return clickedBox?.controller.handleClick(relativeX, relativeY, clickedBox.state, {
      factory,
      boxIndex: clickedBox.index,
    }, "factory") || false;
  }

  setMessageCallback(callback) {
    this._messageForwarder && MessageBus.unsubscribe(this._messageForwarder);

    if (typeof callback === "function") {
      this._messageForwarder = (msg) => {
        try {
          callback(msg);
        } catch (e) {
          console.error("messageCallback error:", e);
        }
      };
      MessageBus.subscribe(this._messageForwarder);
    } else {
      this._messageForwarder = null;
    }
  }

  drawFactoryGrid(ctx, panelX, panelY, factory, spriteManagerOverride, iconManagerOverride) {
  const spriteManager = spriteManagerOverride || this.spriteManager;
  const iconManager = iconManagerOverride || this.iconManager;

  // Calculate panel bounds once
  const panelBounds = {
    x: panelX,
    y: panelY,
    width: this.panelWidth,
    height: this.panelHeight
  };

  this.boxes.forEach((box) => {
    const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
    box.state.setBounds(pos.x, pos.y);
    box.draw(ctx, panelX, panelY, { 
      renderType: "factory", factory, spriteManager, iconManager, panelBounds  // ← pass it
    });
  });
}

  updateHoverStates(mouseX, mouseY, factory, getScreenPosition) {
    const screenPos = getScreenPosition(factory);
    if (!screenPos.isValid) return;

    this.boxes.forEach((box) => {
      const pos = this.calculatePosition(box.row, box.col, screenPos.x, screenPos.y);
      box.state.setBounds(pos.x, pos.y);
      box.updateHoverState(mouseX, mouseY);
    });
  }

  getUniversalComponent(name) {
    const hoveredBox = this.boxes.find((box) => box.state.isHovered);
    if (hoveredBox && name === "factoryGrid") {
      return {
        state: hoveredBox.state,
        description: typeof hoveredBox.description === "function" ? hoveredBox.description : hoveredBox.description,
      };
    }
    return null;
  }

  updateDependencies(deps = {}) {
    this.spriteManager = deps.spriteManager || this.spriteManager;
    this.iconManager = deps.iconManager || this.iconManager;
  }

  updateBoxCount(totalBoxes) {
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
  }
}