export const FLAK_CONFIG = {
  DEFAULT_SCALE_FACTOR: 1,
  MAX_FLAK_CAPACITY: 50,
  BUILD_DURATION: 1, // seconds

  BOX_SPRITE: {
    spriteSheet: "flak.png",
    totalFrames: 72,
    frameWidth: 54,   // actual flak frame width
    frameHeight: 39,  // actual flak frame height
    animDuration: 1500,  // ms for full rotation on hover
    box: {
      sizeMultiplier: 0.8,
      hoverSizeMultiplier: 1,
      anchorX: 1.0,
      anchorY: 0.5,
    }
  },
  
  POSITIONING: {
    CLAMP_OFFSET: 300, // pixels beyond garage boundaries
    POSITIONING_RETRY_DELAY: 10, // ms
  },
  
  ROWS: [
  { count: 8, zIndex: -89, rowOffsetY: -15, rowOffsetX: -60, rowOffsetXRight: -120, spacing: 33 },
  { count: 7, zIndex: -90, rowOffsetY: -25, rowOffsetX: -50, rowOffsetXRight: -100, spacing: 33 },
  { count: 6, zIndex: -91, rowOffsetY: -35, rowOffsetX: -30, rowOffsetXRight: -80, spacing: 33 },
  { count: 4, zIndex: -92, rowOffsetY: -45, rowOffsetX: -10, rowOffsetXRight: -60, spacing: 33 },
]
};