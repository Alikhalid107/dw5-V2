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

 BUILDING: {
  spawnOffsetX: 155,
  spawnOffsetY: -145,

  // Left building — 5 frames, levels 1-5
  left: {
    spriteSheet: "military_central_left.png",
    totalFrames: 5,
    frameWidth: 186,   // 930 / 5
    frameHeight: 117,
    displayWidth: 186,
    displayHeight: 117,
    maxLevel: 5,
    spawnOffsetX: 155,  // ← tune per building
    spawnOffsetY: -145,
    zIndex: -100,  // ← left zIndex

  },

  // Right building — 4 frames, levels 1-4
  right: {
    spriteSheet: "military_central_right.png",
    totalFrames: 5,     // image has 5 frames
    frameWidth: 186,    // 930 / 5
    frameHeight: 125,
    displayWidth: 186,
    displayHeight: 125,
    maxLevel: 4,        // only show up to level 4
    spawnOffsetX: 150,  // ← different position from left
    spawnOffsetY: -85,
    zIndex: -99,  // ← right zIndex

  },

  maxLevel: 5, // keep for backward compat
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
  },
  
};