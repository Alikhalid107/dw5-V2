import { UI_ICONS_CONFIG } from "./UIIconsConfig";

export const UPGRADE_BUTTON_CONFIG = {
  // STYLING - Enhanced from multiple sources
  STYLING: {
    hoverBackgroundColor: "rgba(207, 220, 231, 0.6)",
    baseScaleFactor: 0.6,
    hoverScaleFactor: 1.2,
  },

  EFFECTS: {
    buttonGlowColor: "rgba(255, 255, 255, 0.8)",
    buttonGlowBlur: 12,
    spriteGlowBlur: 8,
    hoverOverlayColor: "rgba(255, 255, 255, 0.2)",
    progressBackgroundColor: "rgba(255, 255, 255, 0.4)",
    progressHeight: 3,
    TickMark: UI_ICONS_CONFIG.FRAME_DEFINITIONS.CHECK_MARK,
  },

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
