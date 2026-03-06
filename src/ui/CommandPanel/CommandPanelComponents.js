import { BasePanelComponents } from "../BasePanel/BasePanelComponents.js";
import { COMMAND_PANEL_CONFIG } from "../../config/CommandPanelConfig.js";
import { IconManager } from "../../utils/IconManager.js";
import { CommandSpriteManager } from "../../managers/CommandSpriteManager.js";
import { UNIVERSAL_PANEL_CONFIG } from "../../config/UniversalPanelConfig.js";

export class CommandPanelComponents extends BasePanelComponents {
  constructor() {
    super(5);  // ← 5 boxes
    this.iconManager = new IconManager();
    this.spriteManager = new CommandSpriteManager();
    this.setupBoxDescriptions();
  }

  _createGridConfig() {
  const { grid } = UNIVERSAL_PANEL_CONFIG;
  return {
    rows: 1,        // ← single row
    cols: 5,        // ← all 5 boxes in one row
    boxWidth: grid.boxWidth,
    boxHeight: grid.boxHeight,
    spacing: grid.spacing,
    alignment: { ...grid.alignment },
  };
}

  setupBoxDescriptions(commandManager = null) {
    this.manager = commandManager;
    this.boxes[0].description = (cm) => this.getCommandCenterDescription(cm);
    this.boxes[1].description = (cm) => this.getOilPumpDescription(cm);
    this.boxes[2].description = (cm) => this.getExplosionDescription(cm);
    this.boxes[3].description = (cm) => this.getCraneDescription(cm);
    this.boxes[4].description = (cm) => this.getClockDescription(cm);
  }

  getCommandCenterDescription(cm) {
    const b = cm?.commandBuilding;
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    return [
      { segments: [{ text: "Command Center", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [
        { text: "Main base building", color: "white", font: "12px Arial", align: "left" },
        { text: `Lv ${level}/${COMMAND_PANEL_CONFIG.BUILDING.commandCenter.maxLevel}`, color: "#fcfc8b", font: "12px Arial", align: "right" }
      ]},
      { segments: [
        { text: "Click to upgrade", color: "white", font: "12px Arial", align: "left" },
        { text: "Titan 150", color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getOilPumpDescription(cm) {
    return [
      { segments: [{ text: "Oil Pump", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Generates oil resources", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [
        { text: "Coming soon", color: "white", font: "12px Arial", align: "left" },
        { text: "Titan 80", color: "#A6C7FA", font: "12px Arial", align: "right" }
      ]},
    ];
  }

  getExplosionDescription(cm) {
    return [
      { segments: [{ text: "Destroy Base", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Permanently destroys this base", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [{ text: "Cannot be undone!", color: "#ff6b6b", font: "12px Arial", align: "left" }] },
    ];
  }

  getCraneDescription(cm) {
    return [
      { segments: [{ text: "Construction", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Build structures", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [{ text: "Coming soon", color: "white", font: "12px Arial", align: "left" }] },
    ];
  }

  getClockDescription(cm) {
    return [
      { segments: [{ text: "Clock Base", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "Time-based mechanics", color: "white", font: "12px Arial", align: "left" }] },
      { segments: [{ text: "Coming soon", color: "white", font: "12px Arial", align: "left" }] },
    ];
  }

  update(deltaTime) {
    const b1 = this.boxes[1];
    const b2 = this.boxes[2];
    const b4 = this.boxes[4];
    this.spriteManager.update(
      deltaTime,
      b1?.state?.isHovered || false,
      b2?.state?.isHovered || false,
      b4?.state?.isHovered || false
    );
  }

  draw(ctx, panelX, panelY, commandManager = null) {
    const panelBounds = {
      x: panelX, y: panelY,
      width: this.panelWidth, height: this.panelHeight
    };

    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      box.draw(ctx, panelX, panelY, {
        renderType: "command",
        panelBounds,
        spriteManager: this.spriteManager,
        iconManager: this.iconManager,
        commandManager,
        boxIndex: box.index,
      });
    });
  }
  
}