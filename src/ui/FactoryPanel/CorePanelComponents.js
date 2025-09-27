// src/ui/FactoryPanel/CorePanelComponents.js
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { UniversalBoxsesFactory } from "../universalSystem/UniversalBoxsesFactory.js";
import { UPGRADE_REQUIREMENTS } from "../../config/FactoryConfig.js";
import { IconManager } from "../../utils/IconManager.js";
import { FactorySpriteManager } from "../UpgradeMenu/FactorySpriteManager.js";
import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig.js";
import { FactoryUtils } from "../../utils/FactoryUtils.js";
import { MessageBus } from "../../utils/MessageBus.js"; // central bus
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";

export class CorePanelComponents {
  constructor(config, iconManager = null, spriteManager = null) {
    this.config = config;

    // Initialize managers with fallbacks
    this.iconManager = iconManager || new IconManager();
    this.spriteManager =
      spriteManager || new FactorySpriteManager(UPGRADE_BUTTON_CONFIG);

    this.gridConfig = {
      rows: 1,
      cols: 3,
      boxWidth: UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.upgradeButtonWidth,
      boxHeight: UNIVERSAL_PANEL_CONFIG.COMPONENTS.sizes.upgradeButtonHeight,
      spacing: 2,
      alignment: {
        horizontal: "left",
        vertical: "top",
        paddingLeft: UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.panelPadding,
        paddingTop: UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing.panelPadding + 40,
      },
    };

    this.boxes = UniversalBoxsesFactory.createBoxes(this, this.gridConfig, {
      totalBoxes: 3,
    });

    this.setupBoxDescriptions();

    // local handle used to forward messages to whatever UI callback you set
    this._messageForwarder = null;
    this._subscribedToBus = false;
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

    const clicked = clickedBox.controller.handleClick(
      relativeX,
      relativeY,
      clickedBox.state,
      {
        factory,
        boxIndex: clickedBox.index,
      },
      "factory"
    );

    // No direct upgrade UI messages here — FactoryUtils handles business rules.
    return clicked;
  }

  setCancelDialogCallback(callback) {
    this.onShowCancelDialog = callback;
  }

  // New: register an external message handler (e.g. Overlay.showMessage)
  // This will subscribe to the MessageBus and forward messages to your callback.
  setMessageCallback(callback) {
    // Unsubscribe previous if any
    if (this._messageForwarder && this._subscribedToBus) {
      MessageBus.unsubscribe(this._messageForwarder);
      this._subscribedToBus = false;
    }

    if (typeof callback !== "function") {
      this._messageForwarder = null;
      return;
    }

    // Create forwarder and subscribe
    this._messageForwarder = (msg) => {
      try { callback(msg); } catch (e) { console.error("messageCallback error:", e); }
    };
    MessageBus.subscribe(this._messageForwarder);
    this._subscribedToBus = true;
  }

  // optional: remove message callback
  clearMessageCallback() {
    if (this._messageForwarder && this._subscribedToBus) {
      MessageBus.unsubscribe(this._messageForwarder);
      this._subscribedToBus = false;
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
        iconManager
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
}
