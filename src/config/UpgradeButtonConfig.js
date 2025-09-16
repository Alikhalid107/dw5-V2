import { UI_ICONS_CONFIG } from "./UIIconsConfig";

export const UPGRADE_BUTTON_CONFIG = {
  // STYLING - Enhanced from multiple sources
  STYLING: {

    hoverBackgroundColor: "rgba(207, 220, 231, 0.6)",
    // Scale factors
    baseScaleFactor: 0.6,
    hoverScaleFactor: 1.20,
  },

  // EFFECTS - From UNIVERSAL_PANEL_CONFIG.EFFECTS and original configs
  EFFECTS: {
    // Glow effects
    glowEnabled: true,
    shadowEnabled: true,
    hoverOverlayEnabled: true,
    progressBarEnabled: true,

    // Glow settings
    buttonGlowColor: "rgba(255, 255, 255, 0.8)",
    buttonGlowBlur: 12,
    spriteGlowBlur: 8,

    // Overlay settings
    hoverOverlayColor: "rgba(255, 255, 255, 0.2)",

    // Progress bar
    progressBackgroundColor: "rgba(255, 255, 255, 0.4)",
    progressHeight: 3,

    // Max level checkmark
    TickMark:UI_ICONS_CONFIG.FRAME_DEFINITIONS.CHECK_MARK ,
  },

  // SPRITES - From UI_ICONS_CONFIG
  SPRITES: {
    spritePaths: {
      concrete: "concreteFactory.png",
      steel: "steelFactory.png",
      carbon: "carbonFactory.png",
      oil: "oilFactory.png",
    },
    spriteFrames: 10,
  },
};
