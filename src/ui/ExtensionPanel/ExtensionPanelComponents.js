import { EXTENSION_PANEL_CONFIG } from "../../config/ExtensionPanelConfig.js";
import { BasePanelComponents } from "../BasePanel/BasePanelComponents.js";
import { IconManager } from "../../utils/IconManager.js";
import { ExtensionSpriteManager } from "../../managers/ExtensionSpriteManager.js";

// ── Extracted helper (unchanged from previous refactor) ───────────────────────
function buildingDescription(title, effectText, titanCost) {
  return [
    { segments: [{ text: title,      color: "white",   font: "15px Arial", align: "left"  }] },
    { segments: [{ text: effectText, color: "white",   font: "12px Arial", align: "left"  }] },
    { segments: [
      { text: "on this map",        color: "white",   font: "12px Arial", align: "left"  },
      { text: `Titan ${titanCost}`, color: "#A6C7FA", font: "12px Arial", align: "right" },
    ]},
  ];
}
// ─────────────────────────────────────────────────────────────────────────────

export class ExtensionPanelComponents extends BasePanelComponents {
  constructor() {
    super(4); // totalBoxes
    this.setupBoxDescriptions();
    this.iconManager   = new IconManager();
    this.spriteManager = new ExtensionSpriteManager();
  }

  setupBoxDescriptions(extensionManager = null) {
    this.manager          = extensionManager; // BasePanelComponents.getHoveredDescription() reads this
    this.extensionManager = extensionManager; // keep for draw() compat
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
    const titan = 25;
    return [
      { segments: [{ text: "Ministry", color: "white", font: "15px Arial", align: "left" }] },
      { segments: [{ text: "build up",               color: "white",   font: "12px Arial", align: "left"  }] },
      { segments: [
        { text: `to level ${level + 1}`, color: "white",   font: "12px Arial", align: "left"  },
        { text: `Titan ${titan}`,         color: "#A6C7FA", font: "12px Arial", align: "right" },
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
      { segments: [{ text: "Upgrade All",           color: "white",   font: "15px Arial", align: "left"  }] },
      { segments: [{ text: "Upgrades all factories", color: "white",   font: "12px Arial", align: "left"  }] },
      { segments: [
        { text: "to max level", color: "white",   font: "12px Arial", align: "left"  },
        { text: "Titan 500",    color: "#A6C7FA", font: "12px Arial", align: "right" },
      ]},
    ];
  }

  getOfficeDescription(em) {
    const b = em?.officeBuilding;
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    const titan = 19 + level * 19;
    return buildingDescription("Mlitary Office", "Increases MP Maximum by 500", titan);
  }

  getGroupDescription(em) {
    const b = em?.groupBuilding;
    if (b?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    const level = b ? b.level : 0;
    const titan = 39 + level * 39;
    return buildingDescription("Group Limit", "Increases the group limit by 1", titan);
  }

  update(deltaTime) {
    const box2 = this.boxes[2];
    const box3 = this.boxes[3];
    this.spriteManager.update(
      deltaTime,
      box2?.state?.isHovered || false,
      box3?.state?.isHovered || false,
    );
  }

  draw(ctx, panelX, panelY, extensionManager = null) {
    const panelBounds = {
      x: panelX, y: panelY,
      width: this.panelWidth, height: this.panelHeight,
    };

    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      box.draw(ctx, panelX, panelY, {
        renderType:       "extension",
        panelBounds,
        spriteManager:    this.spriteManager,
        iconManager:      this.iconManager,
        extensionManager,
        boxIndex:         box.index,
      });
    });
  }
}