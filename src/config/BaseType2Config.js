export const BASE_TYPE2_CONFIG = {
  // Base image
  baseImage: "../public/airbaseWhole.jpg",  // ← replace with your actual image

  // Tree extension
  treeExtension: {
    image: "../public/airBaseTreeExtension.png",  // ← replace with your actual image
    paddingTop: 35,      // ← tune
    paddingLeft: 155,    // ← tune
    height: 134,         // ← tune
    cropLeft: 0,
    cropRight: 0,
  },

  // Garage
  garage: {
    structureImage: "",  // ← replace
    doorsImage: "",          // ← replace
    width: 263,
    height: 181,
    offsetY: -250,
  },

  // Walls
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

  // Panel/building position offsets — all tunable
  towerPanel: {
    hoverAreaOffsetX: 0,   // ← tune relative to base
    hoverAreaOffsetY: 0,
  },

  extensionPanel: {
    hoverAreaOffsetX: 0,
    hoverAreaOffsetY: 0,
  },

  commandPanel: {
    hoverAreaOffsetX: 0,
    hoverAreaOffsetY: 0,
  },
};