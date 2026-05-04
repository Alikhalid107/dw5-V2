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

  // ── Garage (same structure as base type 1, different images) ─────────────
  garage: {
    structureImage: "airbaseGarage1.jpg",  // Structure image for base type 2
    doorsImage: "airbaseGarage2.jpg",      // Doors image for base type 2
    width: 160,
    height: 130,
    offsetX: 340,      // Base type 2 specific: garage positioned at baseCenterX + 340
    offsetY: 30,       // Base type 2 specific: garage positioned at baseCenterY + 30
    zIndex: -95,
  },

  walls: {
    leftImage: "simpleWallRightHeli.png",
    rightImage: "simpleWallRightAb.png",
    upgradeLeftImage: "greatWallRightHeli.png",
    upgradeRightImage: "greatWallRightAb.png",
    // separate dimensions for each side
    leftWidth: 485,
    leftHeight: 59,
    rightWidth: 134,
    rightHeight: 173,
    upgradeLeftWidth: 492,
    upgradeLeftHeight: 72,
    upgradeRightWidth: 147,
    upgradeRightHeight: 186,
    offsetLeft:  { x: -335, y: 140 },    // Garage-relative: left wall relative to garage
    offsetRight: { x: 235, y: -60 },      // Garage-relative: right wall relative to garage  
    upgradeOffsetLeft:  { x: -335, y: 140 },
    upgradeOffsetRight: { x: 235, y: -60 },
  },

  // ── Factories ────────────────────────────────────────────────────────────
  factories: {
    concrete: {
      offsetX: -309,
      offsetY: -106,
      additionalOffsetX: -95,
      additionalOffsetY: -30,
      zIndex: -97,
      additionalZIndex: -98
    },
    steel: {
      offsetX: -37,
      offsetY: -198,
      additionalOffsetX: -80,
      additionalOffsetY: -30,
      zIndex: -97,
      additionalZIndex: -98,
    },
    carbon: {
      offsetX: -106,
      offsetY: -113,
      additionalOffsetX: -70,
      additionalOffsetY: -15,
      zIndex: -97,
      additionalZIndex: -98,
    },
    oil: {
      offsetX: -468,
      offsetY: -106,
      additionalOffsetX: 70,
      additionalOffsetY: -35,
      zIndex: -97,
      additionalZIndex: -99
    },
  },

  // ── Tower panel + buildings ──────────────────────────────────────────────
  tower: {
    hoverArea: { x: 220, y: 150, width: 220, height: 50 },
    panel: { offsetX: 0, offsetY: -55 },
    buildings: {
      left:     { spawnOffsetX: -870,  spawnOffsetY: -160 },  // -400 - 470 = -870, -130 - 30 = -160
      right:    { spawnOffsetX: -590,  spawnOffsetY: -115 },  // -120 - 470 = -590, -85 - 30 = -115
      radar:    { spawnOffsetX: -50,   spawnOffsetY: -20  },  // 420 - 470 = -50, 10 - 30 = -20
      jammer:   { spawnOffsetX: 135,   spawnOffsetY: -65  },  // 620 - 470 = 150, -10 - 30 = -40
      detector: { spawnOffsetX: 90,    spawnOffsetY: -40  },  // 560 - 470 = 90, -10 - 30 = -40
    },
  },

  // ── Extension panel + buildings ─────────────────────────────────────────
  extension: {
    hoverArea: { x: 330, y: 110, width: 220, height: 50 },
    panel: { offsetX: 0, offsetY: -50 },
    buildings: {
      ministry:       { spawnOffsetX: -730, spawnOffsetY: -230 },  // -260 - 470 = -730, -200 - 30 = -230
      militaryOffice: { spawnOffsetX: -670, spawnOffsetY: -200 },  // -200 - 470 = -670, -170 - 30 = -200
      groupLimit:     { spawnOffsetX: -590, spawnOffsetY: -215 },  // -120 - 470 = -590, -185 - 30 = -215
    },
  },

  // ── Command panel + building ─────────────────────────────────────────────
  command: {
    hoverArea: { x: 460, y: 60, width: 260, height: 50 },
    panel: { offsetX: 0, offsetY: -55 },
    buildings: {
      commandCenter: { spawnOffsetX: -550, spawnOffsetY: -265 },  // -80 - 470 = -550, -235 - 30 = -265
    },
  },

  // ── Garage UI (positioned relative to garage1 image) ──────────────────────
  garage_ui: {
    hoverAreaX: 0,         // ← tune: relative to garage1 center
    hoverAreaY: 0,         // ← tune: relative to garage1 center
    hoverAreaWidth: 160,   // ← matches garage1 width
    hoverAreaHeight: 130,  // ← matches garage1 height
    panelOffsetX: 0,       // ← tune: panel position relative to garage1
    panelOffsetY: 0,      // ← tune: panel position relative to garage1
  },

  towerPanel:     { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },
  extensionPanel: { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },
  commandPanel:   { hoverAreaOffsetX: 0, hoverAreaOffsetY: 0 },

  // ── Flag ────────────────────────────────────────────────────────────────────
  flag: {
    offsetX: 55,    // 525 - 470 = 55
    offsetY: 0,     // 30 - 30 = 0
  },

  // ── Long Range Building ──────────────────────────────────────────────────────
  longRange: {
    spawnOffsetX: 80,   // 550 - 470 = 80
    spawnOffsetY: 20,   // 50 - 30 = 20
  },

  // ── Aircraft Carrier ──────────────────────────────────────────────────────────
  aircraftCarrier: {
    structureImage: "airCraftCarrierStructure.png",
    doorImage: "airCraftCarrierDoor.png",
    width: 516,
    height: 238,
    offsetX: -283,        // Horizontal offset from garage
    offsetY: -403,        // Vertical offset from garage
    zIndex: -99,       // Render above most objects for visibility
  },

  // ── Flak rows (curved positioning to follow wall perspective) ────────────
  flak: {
    // Positioning mode: "straight" (default) or "curved" (follows wall angles)
    positioningMode: "curved",
    
    rows: [
      { 
        count: 8, 
        zIndex: -89, 
        // Left side: follows diagonal wall (bottom-left to top-right)
        leftStartX: 95,      // Starting X offset from garage
        leftStartY: 115,      // Starting Y offset from garage 
        leftAngle: 8,       // Angle in degrees (negative = upward slope)
        leftSpacing: 33,      // Distance between flaks along the curve
        // Right side: follows more vertical wall
        rightStartX: 50,    // Starting X offset from garage
        rightStartY: 75,     // Starting Y offset from garage
        rightAngle: -45,      // Angle in degrees (negative = upward slope)
        rightSpacing: 20,     // Distance between flaks along the curve
      },
      { 
        count: 7, 
        zIndex: -90, 
        leftStartX: 85,    // decrease to go left
        leftStartY: 105,    // decrease to go upward
        leftAngle: 10,
        leftSpacing: 33,
        rightStartX: 30,  // decrease to left
        rightStartY: 65,  // decrease to go upward
        rightAngle: -45, // decrease to make steepness towards left or upward
        rightSpacing: 20,
      },
      { 
        count: 6, 
        zIndex: -91, 
        leftStartX: 65,
        leftStartY: 95,
        leftAngle: 12,
        leftSpacing: 33,
        rightStartX: 7,
        rightStartY: 55,
        rightAngle: -45,
        rightSpacing: 20,
      },
      { 
        count: 4, 
        zIndex: -92, 
        leftStartX: 45,
        leftStartY: 85,
        leftAngle: 14,
        leftSpacing: 33,
        rightStartX: -15,
        rightStartY: 45,
        rightAngle: -45,
        rightSpacing: 20,
      },
    ],
  },
};