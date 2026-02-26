import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";
import { EXTENSION_PANEL_CONFIG } from "../../config/ExtensionPanelConfig.js";
import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPositionCalculator } from "../universalSystem/UniversalPositionCalculator.js";
import { IconManager } from "../../utils/IconManager.js";
import { ExtensionSpriteManager } from "../../managers/ExtensionSpriteManager.js";

export class ExtensionPanelComponents {
  constructor() {
    this.gridConfig = this._createGridConfig();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, { totalBoxes: 4 });
    this.calculatePanelDimensions();
    this.setupBoxDescriptions();
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.iconManager = new IconManager();
    this.spriteManager = new ExtensionSpriteManager();
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

  setupBoxDescriptions(extensionManager = null) {
    this.extensionManager = extensionManager;
    this.boxes[0].description = (em) => this.getMinistryDescription(em);
    this.boxes[1].description = (em) => this.getUpgradeAllDescription(em);
    this.boxes[2].description = (em) => this.getOfficeDescription(em);
    this.boxes[3].description = (em) => this.getGroupDescription(em);
  }

  getMinistryDescription(em) {
    const b = em?.ministryBuilding;
    
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    let titan = 25 ;
    return [
      { segments: [{ text: "Ministry", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [
        { text: "build up", color: "white", font: "12px Arial", align: "left" },
      ]},
      { segments:
         [
        { text: `to level ${level + 1}`, color: "white", font: "12px Arial", align: "left" },
        { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getUpgradeAllDescription(em) {
    if (em?.upgradingAll) {
      const remaining = Math.max(0, Math.ceil((em.upgradeAllTime - em.upgradeAllTimer) / 1000));
      return [
        { segments: [{ text: "Upgrading All...", color: "orange", font: "15px Arial", align: "left" }] },
        { segments: [{ text: `${remaining}s remaining`, color: "white", font: "12px Arial", align: "left" }] },
      ];
    }
    const canUpgrade = Object.values(em?.factoryManager?.factories || {}).some(f => !f.isMaxLevel());
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

  getOfficeDescription(em) {
    const b = em?.officeBuilding;
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    let titan = 19 + level * 19;

    return [
      { segments: [{ text: "Mlitary Office", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [
        { text: "Increases MP Maximum by 500", color: "white", font: "12px Arial", align: "left" },
      ]},
      { segments: [
        { text: "on this map", color: "white", font: "12px Arial", align: "left" },
        { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getGroupDescription(em) {
    const b = em?.groupBuilding;
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    let titan = 39 + level * 39;
    return [
      { segments: [{ text: "Group Limit", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [
        { text: "Increases the group limit by 1", color: "white", font: "12px Arial", align: "left" },
      ]},
      { segments: [
        { text: "on this map", color: "white", font: "12px Arial", align: "left" },
        { text: `Titan ${titan}`, color: "#A6C7FA", font: "12px Arial", align: "right" }
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

  update(deltaTime) {
    const box2 = this.boxes[2];
    const box3 = this.boxes[3];
    this.spriteManager.update(
      deltaTime,
      box2?.state?.isHovered || false,
      box3?.state?.isHovered || false
    );
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
        spriteManager: this.spriteManager,
        iconManager: this.iconManager,
        extensionManager,
        boxIndex: box.index,
      });
    });
  }
}