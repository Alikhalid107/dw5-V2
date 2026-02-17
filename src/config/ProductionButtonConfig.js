export const PRODUCTION_BUTTONS_CONFIG = {
  // ... your existing config ...

  FACTORY_COLORS: {
    concrete: "#fcfc8bff",
    carbon: "#32CD32",
    steel: "#DC143C",
    oil: "#9932CC",
    default: "white"
  },

  FACTORY_ICONS: {
    concrete: 'CONCRETE_MIXER',
    steel: 'STEEL_FURNACE',
    carbon: 'CARBON_PLANT',
    oil: 'OIL_REFINERY'
  },

  PRODUCTION_BOX: {
    spriteSizeMultiplier: 1.3,  // ← increase this to make sprite bigger (try 1.5, 1.8, 2.0)
    spriteOpacity: 1,         // ← sprite transparency
    textFont: "18px Arial",
    textStrokeColor: "black",
    textStrokeWidth: 4,
    textOffsetY: 5
  }
};