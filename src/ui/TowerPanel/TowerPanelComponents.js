import { TOWER_PANEL_CONFIG } from "../../config/TowerPanelConfig.js";
import { BasePanelComponents } from "../BasePanel/BasePanelComponents.js";
import { TowerSpriteManager } from "../../managers/TowerSpriteManager.js";
import { IconManager } from "../../utils/IconManager.js";

// ── Description helper ────────────────────────────────────────────────────────
// getRadarDescription, getJammerDescription, getDetectorDescription all shared
// the same 4-line layout. Only the strings and titan cost differ.
function towerBuildingDescription(title, effectLine, areaLine, titanCost) {
  return [
    { segments: [{ text: title,      color: "white",   font: "16px Arial", align: "left"  }] },
    { segments: [{ text: effectLine, color: "white",   font: "12px Arial", align: "left"  }] },
    { segments: [{ text: areaLine,   color: "white",   font: "12px Arial", align: "left"  }] },
    { segments: [{ text: `Titan ${titanCost}`, color: "#A6C7FA", font: "12px Arial", align: "right" }] },
  ];
}
// ─────────────────────────────────────────────────────────────────────────────

export class TowerPanelComponents extends BasePanelComponents {
  constructor() {
    super(4);
    this.setupBoxDescriptions();
    this.spriteManager = new TowerSpriteManager();
    this.iconManager   = new IconManager();
  }

  setupBoxDescriptions(towerManager = null) {
    this.manager      = towerManager;
    this.towerManager = towerManager;
    this.boxes[0].description = (tm) => this.getCommandDescription(tm);
    this.boxes[1].description = (tm) => this.getRadarDescription(tm);
    this.boxes[2].description = (tm) => this.getJammerDescription(tm);
    this.boxes[3].description = (tm) => this.getDetectorDescription(tm);
  }

  getCommandDescription(tm) {
    const building      = tm?.militaryBuilding;
    const buildingRight = tm?.militaryBuildingRight;

    if (building?.isMaxLevel() && buildingRight?.isMaxLevel()) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }

    const totalLevel = (building?.level || 0) + (buildingRight?.level || 0);
    const time       = 10 + totalLevel * 2;
    const titan      = 25 + totalLevel * 5;

    return [
      { segments: [{ text: "Military central", color: "white", font: "16px Arial", align: "left" }] },
      { segments: [
        { text: "build up",   color: "white",   font: "12px Arial", align: "left"  },
        { text: `${time}sec`, color: "white",   font: "12px Arial", align: "right" },
      ]},
      { segments: [
        { text: `to level ${totalLevel + 1}`, color: "white",   font: "12px Arial", align: "left"  },
        { text: `Titan ${titan}`,             color: "#A6C7FA", font: "12px Arial", align: "right" },
      ]},
    ];
  }

  getRadarDescription(tm) {
    if (tm?.radarBuilding) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    return towerBuildingDescription("Radar Tower", "More sight range", "(Fog of War)", 100);
  }

  getJammerDescription(tm) {
    if (tm?.jammerBuilding) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    return towerBuildingDescription("Jammer Tower", "Jamming the area", "around this base", 50);
  }

  getDetectorDescription(tm) {
    if (tm?.detectorBuilding) {
      return [{ segments: [{ text: "Max level reached", font: "16px Arial", align: "center", color: "white" }] }];
    }
    return towerBuildingDescription("Detector Tower", "can detect stealthed units", "around this base", 25);
  }

  update(deltaTime) {
    this.spriteManager.update(
      deltaTime,
      this.boxes[1]?.state?.isHovered || false,
      this.boxes[3]?.state?.isHovered || false,
    );
  }

  draw(ctx, panelX, panelY, towerManager = null) {
    const panelBounds = { x: panelX, y: panelY, width: this.panelWidth, height: this.panelHeight };

    this.boxes.forEach(box => {
      const pos = this.calculatePosition(box.row, box.col, panelX, panelY);
      box.state.setBounds(pos.x, pos.y);
      box.draw(ctx, panelX, panelY, {
        renderType:    "tower",
        label:         box.description,
        panelBounds,
        spriteManager: this.spriteManager,
        iconManager:   this.iconManager,
        towerManager,
      });
    });
  }
}