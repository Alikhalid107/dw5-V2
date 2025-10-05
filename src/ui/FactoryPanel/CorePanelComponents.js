// src/ui/FactoryPanel/CorePanelComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { UniversalBoxsesFactory } from "../universalSystem/UniversalBoxsesFactory.js";
import { UPGRADE_REQUIREMENTS } from "../../config/FactoryConfig.js";
import { FactoryUtils } from "../../utils/FactoryUtils.js";
import { MessageBus } from "../../utils/MessageBus.js";
import { IconManager } from "../../utils/IconManager.js";
import { FactorySpriteManager } from "../UpgradeMenu/FactorySpriteManager.js";
import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";

export class CorePanelComponents {
  constructor(config, iconManager = null, spriteManager = null) {
    this.config = config;

    // Initialize managers with fallbacks
    this.iconManager = iconManager || new IconManager();
    this.spriteManager =
      spriteManager || new FactorySpriteManager(UPGRADE_BUTTON_CONFIG);

    // Helper function to merge configs
    function createGridConfig() {
      const base = UNIVERSAL_PANEL_CONFIG.grid;
      const preset = UNIVERSAL_PANEL_CONFIG.grid.factory;

      return {
        rows: preset.rows,
        cols: preset.cols,
        boxWidth: base.boxWidth,
        boxHeight: base.boxHeight,
        spacing: base.spacing,
        alignment: {
          ...base.alignment,
          ...(preset.alignment || {}),
        },
      };
    }

    // Create grid config
    this.gridConfig = createGridConfig();

    // Create boxes
    this.boxes = UniversalBoxsesFactory.createBoxes(this, this.gridConfig, {
      totalBoxes: 3,
    });

    // Calculate panel dimensions automatically
    this.calculatePanelDimensions();

    this.setupBoxDescriptions();
    this._messageForwarder = null;
  }

  // NEW METHOD: Auto-calculate panel dimensions based on grid
  calculatePanelDimensions() {
    const alignment = this.gridConfig.alignment || {};

    // Get padding from alignment or use defaults from config
    const paddingLeft = alignment.paddingLeft  ;
    const paddingRight = alignment.paddingRight ;
    const paddingTop = alignment.paddingTop  ;
    const paddingBottom =alignment.paddingBottom ;

    // Calculate grid dimensions
    const gridWidth =
      this.gridConfig.cols * this.gridConfig.boxWidth +
      (this.gridConfig.cols - 1) * this.gridConfig.spacing;

    const gridHeight =
      this.gridConfig.rows * this.gridConfig.boxHeight +
      (this.gridConfig.rows - 1) * this.gridConfig.spacing;

    // Set panel dimensions (grid + padding)
    this.panelWidth = gridWidth + paddingLeft + paddingRight;
    this.panelHeight = gridHeight + paddingTop + paddingBottom;

  }

  setupBoxDescriptions() {
    const descriptions = [
      (factory) => this.getUpgradeDescription(factory),
      (factory) => this.getProductionDescription(factory, 1),
      (factory) => this.getProductionDescription(factory, 15),
    ];

    this.boxes.forEach((box, index) => {
      if (descriptions[index]) box.description = descriptions[index];
    });
  }

  getUpgradeDescription(factory) {
    const req = UPGRADE_REQUIREMENTS[factory.type];
    const nextLevel = factory.level + 1;

    if (!req?.levels[nextLevel]) {
      return [
        {
          segments: [
            { text: "Max level reached", color: "red", font: "14px Arial" },
          ],
        },
      ];
    }

    const { cost, time } = req.levels[nextLevel];
    const { name: resName, color: resColor } = req.resource;

    return [
      {
        segments: [{ text: factory.name, color: "white", font: "14px Arial" }],
      },
      {
        segments: [
          {
            text: `Build time: ${time} sec`,
            color: "white",
            font: "11px Arial",
          },
        ],
      },
      {
        segments: [
          {
            text: `Upgrade to Level ${nextLevel} - Cost: ${cost} `,
            color: "white",
            font: "12px Arial",
          },
          { text: resName, color: resColor, font: "12px Arial" },
        ],
      },
    ];
  }

  getProductionDescription(factory, hours) {
    if (!factory) return "Production unavailable";

    if (factory.isProducing) {
      if (hours === 15) {
        return "Cannot start 15hr production while active";
      } else {
        return FactoryUtils.isFactoryAtMaxProduction(factory)
          ? "Cannot add more time - already at 15 hour limit"
          : "Add 1 hour to current production";
      }
    }

    return hours === 1
      ? "Quick 1-hour cycle for immediate results"
      : "Efficient 15-hour cycle for maximum output";
  }

  calculatePosition(row, col, panelX, panelY) {
    return UniversalPositionCalculator.calculateBoxPosition(
      panelX,
      panelY,
      row,
      col,
      this.gridConfig
    );
  }

  handleFactoryGridClick(relativeX, relativeY, factory, panelX, panelY) {
    const clickedBox = this.boxes.find((box) => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      return box.state.isPointInside(relativeX, relativeY);
    });

    if (!clickedBox) return false;

    return clickedBox.controller.handleClick(
      relativeX,
      relativeY,
      clickedBox.state,
      {
        factory,
        boxIndex: clickedBox.index,
      },
      "factory"
    );
  }

  setMessageCallback(callback) {
    // Unsubscribe previous if any
    if (this._messageForwarder) {
      MessageBus.unsubscribe(this._messageForwarder);
    }

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

  drawFactoryGrid(
    ctx,
    panelX,
    panelY,
    factory,
    spriteManagerOverride,
    iconManagerOverride
  ) {
    const spriteManager = spriteManagerOverride || this.spriteManager;
    const iconManager = iconManagerOverride || this.iconManager;

    this.boxes.forEach((box) => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);

      box.draw(ctx, panelX, panelY, {
        renderType: "factory",
        factory,
        spriteManager,
        iconManager,
      });
    });
  }

  updateHoverStates(mouseX, mouseY, factory, getScreenPosition) {
    const screenPos = getScreenPosition(factory);
    if (!screenPos.isValid) return;

    this.boxes.forEach((box) => {
      const pos = this.calculatePosition(
        box.row,
        box.col,
        screenPos.x,
        screenPos.y
      );
      box.state.setBounds(pos.x, pos.y);
      box.updateHoverState(mouseX, mouseY);
    });
  }

  getUniversalComponent(name) {
    const hoveredBox = this.boxes.find((box) => box.state.isHovered);
    if (hoveredBox && name === "factoryGrid") {
      return {
        state: hoveredBox.state,
        description:
          typeof hoveredBox.description === "function"
            ? hoveredBox.description
            : hoveredBox.description,
      };
    }
    return null;
  }

  updateDependencies(deps = {}) {
    this.spriteManager = deps.spriteManager || this.spriteManager;
    this.iconManager = deps.iconManager || this.iconManager;
  }

  // NEW METHOD: Update configuration and recalculate dimensions
  updateBoxCount(totalBoxes) {
    this.boxes = UniversalBoxsesFactory.createBoxes(this, this.gridConfig, {
      totalBoxes: totalBoxes,
    });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
  }
}
