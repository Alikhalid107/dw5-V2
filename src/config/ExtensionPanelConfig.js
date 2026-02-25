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
    checkMarkSize: 40,
    checkMarkOffsetX: 0,
    checkMarkOffsetY: 0,
  },

  SPRITES: {
    spritePaths: {
      extA: "extA.png",  // ← set your sprite paths
      extB: "extB.png",
      extC: "extC.png",
      extD: "extD.png",
    },
    sizes: {
      extA: { normal: 1.0, hover: 1.2, anchorX: 0.5, anchorY: 0.5 },
      extB: { normal: 1.0, hover: 1.2, anchorX: 0.5, anchorY: 0.5 },
      extC: { normal: 1.0, hover: 1.2, anchorX: 0.5, anchorY: 0.5 },
      extD: { normal: 1.0, hover: 1.2, anchorX: 0.5, anchorY: 0.5 },
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