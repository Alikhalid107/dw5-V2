export const UI_ICONS_CONFIG = {
  SPRITE_PATH: "../public/newicons.png", // Replace with your actual image path
  TOTAL_FRAMES: 9,
  COLS: 9,
  ROWS: 1,
  
  // Define what each frame represents (adjust based on your actual image)
  FRAME_DEFINITIONS: {
    CONCRETE_MIXER: 0,      // Frame 0 - Concrete mixer truck (leftmost)
    STEEL_FURNACE: 1,       // Frame 1 - Steel factory/furnace  
    CARBON_PLANT: 2,        // Frame 2 - Carbon factory (green tower)
    OIL_REFINERY: 3,        // Frame 3 - Oil refinery (dark sphere)
    CHECK_MARK: 4,          // Frame 4 - Green checkmark ✓
    CROSS_MARK: 5,          // Frame 5 - Red cross ✗
    CRANE: 6,               // Frame 6 - Construction crane
    GEAR: 7,                // Frame 7 - Settings gear (circular)
    EXPLOSION: 8            // Frame 8 - Explosion effect (rightmost)
  },
  
  // Easy access by name
  getFrameIndex: function(iconName) {
    return this.FRAME_DEFINITIONS[iconName] || 0;
  }
};