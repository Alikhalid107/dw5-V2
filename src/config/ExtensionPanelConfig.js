import { UNIVERSAL_PANEL_CONFIG } from "./UniversalPanelConfig.js";

export const EXTENSION_PANEL_CONFIG = {
  hoverArea: {
    x: 400,     // ← tune relative to base
    y: 360,     // ← tune
    width: 220,
    height: 50,
  },

  panel: {
    offsetX: 0,
    offsetY: -50,
  },

  styling: {
    backgroundColor: UNIVERSAL_PANEL_CONFIG.PANEL_BACKGROUND.color,
    headerText: "Base Extensions",
    headerFont: "bold 13px Arial",
    headerColor: UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary,
    checkMarkSize: 50,
    checkMarkOffsetX: 10,
    checkMarkOffsetY: -10,
  },

  BUILDING: {
    ministry: {
      spriteSheet: "ministry.png",
      totalFrames: 6,
      frameWidth: 195,      // 1170 / 6
      frameHeight: 117,
      displayWidth: 195,
      displayHeight: 117,
      maxLevel: 6,
      spawnOffsetX: -210,    // ← tune
      spawnOffsetY: 40,   // ← tune
      zIndex: -95,
    },

    militaryOffice: {
      spriteSheet: "militaryOffice.png",
      totalFrames: 3,
      frameWidth: 83,       // 249 / 3
      frameHeight: 122,
      displayWidth: 83,
      displayHeight: 122,
      maxLevel: 3,
      spawnOffsetX: -160,    // ← tune
      spawnOffsetY: 60,   // ← tune
      zIndex: -94,
    },

    groupLimit: {
      spriteSheet: "group_limit_building.png",
      totalFrames: 3,
      frameWidth: 75,       // 225 / 3
      frameHeight: 118,
      displayWidth: 75,
      displayHeight: 118,
      maxLevel: 3,
      spawnOffsetX: -80,    // ← tune
      spawnOffsetY: 60,   // ← tune
      zIndex: -93,
    },
  },

  SPRITES: {
    sizes: {
      extA: { normal: 1.8, hover: 2.1, anchorX: 0.4, anchorY: 0.5 },
      extB: { normal: 1.0, hover: 1.0, anchorX: 0.5, anchorY: 0.5 }, // upgrade all — no sprite
      extC: { normal: 1.8, hover: 2.1, anchorX: 0.4, anchorY: 0.8 },
      extD: { normal: 1.8, hover: 2.1, anchorX: 0.4, anchorY: 0.8 },
    }
  },

  debug: {
    enabled: false,
    hoverAreaColor: "rgba(255, 100, 0, 0.9)",
    panelAreaColor: "rgba(0, 100, 255, 0.9)",
    lineWidth: 2,
    lineDash: [5, 4],
  },
};