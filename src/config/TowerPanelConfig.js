import { UNIVERSAL_PANEL_CONFIG } from "./UniversalPanelConfig.js";

const { grid } = UNIVERSAL_PANEL_CONFIG;

export const TOWER_PANEL_CONFIG = {
  // Fixed hover area - coordinates relative to base spawn point
  hoverArea: {
    x: 820,
    y: 130,
    width: 220,
    height: 50,
  },

  panel: {
    offsetX: 0,
    offsetY: -55,
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
    towerA: "military_central_left.png",
    towerB: "radar.png",
    towerC: "jammer.png",
    towerD: "detector.png",
  },
  
  sizes: {
  towerA: { normal: 2.0, hover: 2.3, anchorX: 0.3, anchorY: 0.7 },
  towerB: { normal: 0.8, hover: 0.9, anchorX: 0.5, anchorY: 0.5 },
  towerC: { normal: 1.6, hover: 2.2, anchorX: 0.5, anchorY: 0.5 },
  towerD: { normal: 1.0, hover: 1.2, anchorX: 0.5, anchorY: 0.5 },
},
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