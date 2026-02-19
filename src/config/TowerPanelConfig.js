import { UNIVERSAL_PANEL_CONFIG } from "./UniversalPanelConfig.js";

const { grid } = UNIVERSAL_PANEL_CONFIG;

export const TOWER_PANEL_CONFIG = {
  // Fixed hover area - coordinates relative to base spawn point
  hoverArea: {
    x: 770,
    y: 130,
    width: 210,
    height: 50,
  },

  panel: {
    offsetX: 0,
    offsetY: -50,
  },

  // Tower-specific styling only
  styling: {
    backgroundColor: UNIVERSAL_PANEL_CONFIG.PANEL_BACKGROUND.color, // ← reuse same panel color
    headerText: "Build Tower",
    headerFont: "bold 13px Arial",
    headerColor: UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary, // ← reuse "white"
  },

  // Tower-specific sprites (same pattern as UPGRADE_BUTTON_CONFIG.SPRITES)
  SPRITES: {
    spritePaths: {
      towerA: "detec2.png",   // ← add your actual sprite paths
      towerB: "radarturm2.png",
      towerC: "towerC.png",
      towerD: "jammerturm.png",
    }
  },

  // Debug - tower has its own colors separate from universal debug
  debug: {
    enabled: false,
    hoverAreaColor: "rgba(255, 100, 0, 0.9)",
    panelAreaColor: "rgba(0, 100, 255, 0.9)",
    lineWidth: 2,
    lineDash: [5, 4],
  }
};