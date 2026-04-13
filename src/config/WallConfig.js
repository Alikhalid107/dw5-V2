export const WALL_CONFIG = {
  DIMENSIONS: {
    width: 485,
    height: 59
  },

  OFFSETS: {
    left: { x: 200, y: 415 },
    right: { x: -725, y: 415 }
  },

  IMAGES: {
    left: 'simpleWallLeftHeli.png',
    right: 'simpleWallRightHeli.png'
  },
  UI: {
  checkMarkSize: 50,      // ← tune size
  checkMarkOffsetX: 10,    // ← tune x relative to box
  checkMarkOffsetY: -7,    // ← tune y relative to box
},

  // ← new
  UPGRADE: {
    IMAGES: {
      left: 'greatWallLeftHeli.png',
      right: 'greatWallRightHeli.png'
    },
    DIMENSIONS: {
    width: 492,   // ← set your upgrade wall dimensions
    height: 73,
  },
  OFFSETS: {
    left: { x: 200, y: 400 },   // ← tune separately from simple wall
    right: { x: -725, y: 400 }
  }
  },

  Z_INDEX: 5
};