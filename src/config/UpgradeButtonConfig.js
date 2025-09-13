export const UPGRADE_BUTTON_CONFIG = {
  // DIMENSIONS - From original UPGRADE_BUTTON_CONFIG and UNIVERSAL_PANEL_CONFIG
  DIMENSIONS: {
    width: 60,
    height: 40,
    iconSize: 48,
    fallbackTextSize: 16
  },

  // LAYOUT - From UNIVERSAL_PANEL_CONFIG.LAYOUT
  LAYOUT: {
    defaultPanelWidth: 0,
    defaultPanelHeight: 40,
    defaultPanelOffsetX: 0,
    defaultPanelOffsetY: 0,
    centerVertically: true
  },

  // SPACING - From UNIVERSAL_PANEL_CONFIG.COMPONENTS.spacing
  SPACING: {
    panelPadding: 2,
    componentSpacing: 2,
    componentPadding: 2
  },

  // STYLING - Enhanced from multiple sources
  STYLING: {
    // Background colors
    backgroundColor: 'rgba(115, 145, 167, 0.7)',
    hoverBackgroundColor: 'rgba(180, 210, 235, 0.9)',
    upgradingBackgroundColor: 'rgba(255, 165, 0, 0.8)',
    maxLevelBackgroundColor: 'rgba(34, 139, 34, 0.8)',
    
    // Scale factors
    baseScaleFactor: 0.6,
    hoverScaleFactor: 1.15,
    hoverIconScale: 1.2,
    maxLevelIconScale: 1.3,
    
    // Text styling
    fallbackText: 'UP',
    font: '16px Arial',
    hoverFontScale: 1.1,
    textColor: '#cccccc',
    hoverTextColor: '#ffffff',
    textOutlineColor: 'black',
    textOutlineWidth: 2,
    hoverTextOutlineWidth: 3
  },

  // EFFECTS - From UNIVERSAL_PANEL_CONFIG.EFFECTS and original configs
  EFFECTS: {
    // Glow effects
    glowEnabled: true,
    shadowEnabled: true,
    hoverOverlayEnabled: true,
    progressBarEnabled: true,
    
    // Glow settings
    buttonGlowColor: 'rgba(255, 255, 255, 0.8)',
    buttonGlowBlur: 12,
    spriteGlowBlur: 8,
    
    // Overlay settings
    hoverOverlayColor: 'rgba(255, 255, 255, 0.2)',
    
    // Progress bar
    progressBackgroundColor: 'rgba(255, 255, 255, 0.4)',
    progressHeight: 3,
    
    // Max level checkmark
    checkmarkGlowColor: 'rgba(0, 255, 0, 0.6)',
    checkmarkGlowBlur: 6
  },

  // FACTORY_COLORS - Factory-specific glow colors
  FACTORY_COLORS: {
    concrete: 'rgba(252, 252, 139, 0.8)',
    steel: 'rgba(220, 20, 60, 0.8)',
    carbon: 'rgba(50, 205, 50, 0.8)',
    oil: 'rgba(153, 50, 204, 0.8)',
    default: 'rgba(255, 255, 255, 0.8)'
  },

  // SPRITES - From UI_ICONS_CONFIG
  SPRITES: {
    spritePaths: {
      concrete: 'concreteFactory.png',
      steel: 'steelFactory.png',
      carbon: 'carbonFactory.png',
      oil: 'oilFactory.png'
    },
    spriteFrames: 10
  },

  // ICONS - From UI_ICONS_CONFIG
  ICONS: {
    spritePath: "../public/newicons.png",
    totalFrames: 9,
    cols: 9,
    rows: 1,
    frameWidth: 90,
    frameHeight: 100,
    
    frameDefinitions: {
      CONCRETE_MIXER: 0,
      STEEL_FURNACE: 1,
      CARBON_PLANT: 2,
      OIL_REFINERY: 3,
      CHECK_MARK: 4,
      CROSS_MARK: 5,
      CRANE: 6,
      GEAR: 7,
      EXPLOSION: 8
    }
  },
};