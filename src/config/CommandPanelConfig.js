import { UNIVERSAL_PANEL_CONFIG } from "./UniversalPanelConfig.js";

export const COMMAND_PANEL_CONFIG = {
  hoverArea: {
    x: 600,     // ← tune
    y: 360,     // ← tune
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
    checkMarkSize: 40,
    checkMarkOffsetX: 0,
    checkMarkOffsetY: 0,
  },

  BUILDING: {
    commandCenter: {
      spriteSheet: "commandCenter.png",
      totalFrames: 5,
      frameWidth: 174,      // 870 / 5
      frameHeight: 117,
      displayWidth: 174,
      displayHeight: 117,
      staticFrame: 0,   // ← 5 frames only, use last frame as static (index 4)
      maxLevel: 5,
      spawnOffsetX: 200,    // ← tune
      spawnOffsetY: -120,   // ← tune
      zIndex: -95,
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
        sizeMultiplier: 0.9,       // ← tune
        hoverSizeMultiplier: 1.1,  // ← tune
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
        sizeMultiplier: 0.9,
        hoverSizeMultiplier: 1.1,
        anchorX: 0.5,
        anchorY: 0.5,
      },
    },

    crane: {
      // from UI_ICONS_CONFIG frame 6
      box: {
        sizeMultiplier: 0.7,       // ← tune
        hoverSizeMultiplier: 0.9,  // ← tune
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
        sizeMultiplier: 0.9,
        hoverSizeMultiplier: 1.1,
        anchorX: 0.5,
        anchorY: 0.5,
      },
    },
  },

  debug: {
    enabled: true,
    hoverAreaColor: "rgba(255, 100, 0, 0.9)",
    panelAreaColor: "rgba(0, 100, 255, 0.9)",
    lineWidth: 2,
    lineDash: [5, 4],
  },
};