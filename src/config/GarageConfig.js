export const GARAGE_CONFIG = {
  longRange: {
    spriteSheet: "longRange.png",
    totalFrames: 72,
    frameWidth: 33,    // 2376 / 72 = 33
    frameHeight: 40,   // total height 40px, single row
    displayWidth: 33,
    displayHeight: 40,

    spawnOffsetX: 95,
    spawnOffsetY: 80,
    zIndex: -95,
    animDuration: 3000,
    hoverAnimDuration: 1500,   // ← faster rotation speed on hover

    box: {
      sizeMultiplier: 0.8,
      hoverSizeMultiplier: 1,
      anchorX: 0.7,
      anchorY: 0.4,
    },

    checkMark: {
      size: 50,
      offsetX: 10,
      offsetY: -7,
    }
  }
};