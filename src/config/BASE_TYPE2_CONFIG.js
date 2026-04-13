export const BASE_TYPE2_CONFIG = {
  baseImage: "airbaseWhole.jpg",

  treeExtension: {
    image: "airBaseTreeExtension.png",
    paddingTop: 35,
    paddingLeft: 155,
    height: 134,
    cropLeft: 0,
    cropRight: 0,
  },

   garage: {
    structureImage: "",  // ← replace
    doorsImage: "",          // ← replace
    width: 263,
    height: 181,
    offsetY: -250,
  },

    walls: {
    leftImage: "simpleWallRightHeli.png",
    rightImage: "simpleWallRightAb.png",
    upgradeLeftImage: "greatWallRightHeli.png",
    upgradeRightImage: "greatWallRightAb.png",
    // separate dimensions for each side
    leftWidth: 485,
    leftHeight: 59,
    rightWidth: 134,       // ← tune
    rightHeight: 173,      // ← tune
    upgradeLeftWidth: 492,
    upgradeLeftHeight: 72,
    upgradeRightWidth: 147,  // ← tune
    upgradeRightHeight: 186, // ← tune
    offsetLeft:  { x: 750 , y: 430 },
    offsetRight: { x: -175, y: 230 },
    upgradeOffsetLeft:  { x: 750, y: 430 },
    upgradeOffsetRight: { x: -175, y: 230 },
    },

  // ── Tower panel + buildings ──────────────────────────────────────────────
  tower: {
    hoverArea: { x: 220, y: 150, width: 220, height: 50 }, // ← tune
    panel: { offsetX: 0, offsetY: -55 },
    buildings: {
      left:     { spawnOffsetX: -400,  spawnOffsetY: -130 },
      right:    { spawnOffsetX: -120,  spawnOffsetY: -85  },
      radar:    { spawnOffsetX: 420,  spawnOffsetY: 10  },
      jammer:   { spawnOffsetX: 620,  spawnOffsetY: -10   },
      detector: { spawnOffsetX: 560,  spawnOffsetY: -10   },
    },
  },

  // ── Extension panel + buildings ─────────────────────────────────────────
  extension: {
    hoverArea: { x: 330, y: 110, width: 220, height: 50 }, // ← tune
    panel: { offsetX: 0, offsetY: -50 },
    buildings: {
      ministry:       { spawnOffsetX: -260, spawnOffsetY: -200 },
      militaryOffice: { spawnOffsetX: -200, spawnOffsetY: -170 },
      groupLimit:     { spawnOffsetX: -120 ,  spawnOffsetY: -185 },
    },
  },

  // ── Command panel + building ─────────────────────────────────────────────
  command: {
    hoverArea: { x: 460, y: 60, width: 260, height: 50 }, // ← tune
    panel: { offsetX: 0, offsetY: -55 },
    buildings: {
      commandCenter: { spawnOffsetX: -80, spawnOffsetY: -235 },
    },
  },

  // ── Garage hover area ────────────────────────────────────────────────────
  garage_ui: {
    hoverAreaX: 0,      // ← tune
    hoverAreaY: 0,
    hoverAreaWidth: 263,
    hoverAreaHeight: 181,
    panelOffsetX: 0,
    panelOffsetY: 0,
  },

  towerPanel:     { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },
  extensionPanel: { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },
  commandPanel:   { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },

  // ── Flag ────────────────────────────────────────────────────────────────────
flag: {
  offsetX: 535,       // ← tune: pixels from garageX
  offsetY: 0,       // ← tune: pixels from garageY center
},

// ── Long Range Building ──────────────────────────────────────────────────────
longRange: {
  spawnOffsetX: 550,  // ← tune: pixels from garageX
  spawnOffsetY: 50,  // ← tune: pixels from garageY
},

// ── Garage UI hover area ─────────────────────────────────────────────────────
garage_ui: {
  hoverAreaX: 0,         // ← tune
  hoverAreaY: 0,         // ← tune
  hoverAreaWidth: 263,   // ← tune
  hoverAreaHeight: 181,  // ← tune
  panelOffsetX: 0,       // ← tune
  panelOffsetY: 10,      // ← tune
},

// ── Flak rows override ───────────────────────────────────────────────────────
flak: {
  rows: [
    { count: 8, zIndex: -89, rowOffsetY: -15, rowOffsetX: -60, rowOffsetXRight: -120, spacing: 33 },
    { count: 7, zIndex: -90, rowOffsetY: -25, rowOffsetX: -50, rowOffsetXRight: -100, spacing: 33 },
    { count: 6, zIndex: -91, rowOffsetY: -35, rowOffsetX: -30, rowOffsetXRight: -80,  spacing: 33 },
    { count: 4, zIndex: -92, rowOffsetY: -45, rowOffsetX: -10, rowOffsetXRight: -60,  spacing: 33 },
  ],
},
};