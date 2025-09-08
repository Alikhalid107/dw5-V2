export const FLAK_CONFIG = {
  DEFAULT_SCALE_FACTOR: 1,
  MAX_FLAK_CAPACITY: 50,
  BUILD_DURATION: 1, // seconds
  
  POSITIONING: {
    CLAMP_OFFSET: 300, // pixels beyond garage boundaries
    POSITIONING_RETRY_DELAY: 10, // ms
  },
  
  ROWS: [
    { count: 8, zIndex: -89, rowOffsetY: -15, rowOffsetX: -60, spacing: 33 },
    { count: 7, zIndex: -90, rowOffsetY: -25, rowOffsetX: -50, spacing: 33 },
    { count: 6, zIndex: -91, rowOffsetY: -35, rowOffsetX: -30, spacing: 33 },
    { count: 4, zIndex: -92, rowOffsetY: -45, rowOffsetX: -10, spacing: 33 },
  ]
};