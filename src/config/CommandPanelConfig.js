import { UNIVERSAL_PANEL_CONFIG } from "./UniversalPanelConfig.js";

export const COMMAND_PANEL_CONFIG = {
  hoverArea: {
    x: 430,     // ← tune
    y: 260,     // ← tune
    width: 260,
    height: 50,
  },

  panel: {
    offsetX: 0,
    offsetY: -55,
  },

  styling: {
    backgroundColor: UNIVERSAL_PANEL_CONFIG.PANEL_BACKGROUND.color,
    headerText: "Command Center",
    headerFont: "bold 13px Arial",
    headerColor: UNIVERSAL_PANEL_CONFIG.COMPONENTS.text.colors.primary,
    checkMarkSize: 50,
    checkMarkOffsetX: 10,
    checkMarkOffsetY: -10,
  },

  BUILDING: {
   commandCenter: {
  spriteSheet: "commandCenter.png",
  totalFrames: 5,
  frameWidth: 174,
  frameHeight: 117,
  displayWidth: 174,
  displayHeight: 117,
  staticFrame: 0,
  maxLevel: 5,
  spawnOffsetX: -140,
  spawnOffsetY: -25,
  zIndex: -96,
  box: {
    sizeMultiplier: 1.3,       // ← tune size inside box
    hoverSizeMultiplier: 1.7,  // ← tune hover size
    anchorX: 0.1,              // ← tune horizontal position (0=left, 1=right)
    anchorY: 0.6,              // ← tune vertical position (0=top, 1=bottom)
  },
},
  },

  SPRITES: {
    oilPump: {
      spriteSheet: "oilPump.png",
      totalFrames: 50,
      frameWidth: 68,       // 3400 / 50 = 68
      frameHeight: 74,
      staticFrame: 44,      // 45th frame = index 44
      animDuration: 2000,   // ← tune hover rotation speed
      box: {
        sizeMultiplier: 1.2,       // ← tune
        hoverSizeMultiplier: 1.4,  // ← tune
        anchorX: 0.5,
        anchorY: 0.5,
      },
    },

    explosionBase: {
      spriteSheet: "explosionBaseBox.png",
      totalFrames: 100,
      frameWidth: 484,      // 24200 / 80 = 484
      frameHeight: 200,
      staticFrame: 44,      // 45th frame = index 44
      animDuration: 1500,   // ← tune hover speed
      box: {
        sizeMultiplier:1.2,
        hoverSizeMultiplier: 1.4,
        anchorX: -1.0,
        anchorY: 0.5,
      },
    },

    crane: {
      // from UI_ICONS_CONFIG frame 6
      box: {
        sizeMultiplier: 1.0,       // ← tune
        hoverSizeMultiplier: 1.2,  // ← tune
        anchorX: 0.5,
        anchorY: 0.5,
      },
    },

    clockBase: {
      spriteSheet: "clockBase.png",
      totalFrames: 72,
      frameWidth: 75,       // 5400 / 72 = 75
      frameHeight: 71,
      staticFrame: 44,      // 45th frame = index 44
      animDuration: 2000,   // ← tune
      box: {
        sizeMultiplier: 1.0,
        hoverSizeMultiplier: 1.2,
        anchorX: 0.5,
        anchorY: 0.5,
      },
    },
  },

  debug: {
    enabled: false,
    hoverAreaColor: "rgba(255, 100, 0, 0.9)",
    panelAreaColor: "rgba(0, 100, 255, 0.9)",
    lineWidth: 2,
    lineDash: [5, 4],
  },
};