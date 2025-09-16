export const PRODUCTION_BUTTONS_CONFIG = {
  layout: {
    spacing: 2,
    alignment: 'horizontal' // or 'vertical'
  },
  
  buttons: [
    { hours: 1, label: '1h', width: 62, height: 40 },
    { hours: 15, label: '15h', width: 62, height: 40 }
  ],
  
  styling: {
    backgroundColor: 'rgba(146, 168, 185, 0.5)',
    hoverBackgroundColor: 'rgba(146, 168, 185, 0.5)',
    disabledBackgroundColor: 'rgba(146, 168, 185, 0.5)',
    producingBackgroundColor: 'rgba(146, 168, 185, 0.5)',
    
    textColor: 'white',
    disabledTextColor: '#888888',
    
    // Icon configurations
    iconSize: 48,
    hoverIconScale: 1.2,
    
    // Text styling
    font: '20px Tahoma',
    hoverFontScale: 1.0,
    outlineColor: 'black',
    outlineWidth: 5
  },
  
  effects: {
    hover: {
      glowEnabled: true,
      shadowEnabled: true,
      overlayEnabled: true,
      glowColor: 'rgba(255, 255, 255, 0.8)',
      glowBlur: 10,
      overlayColor: 'rgba(255, 255, 255, 0.15)',
      shadowBlur: 8
    },
    
    brightenFactor: 0.3
  },
  
  cancelBadge: {
    size: 16,
    offsetX: -8,
    offsetY: -8,
    backgroundColor: 'rgba(220, 20, 60, 0.9)',
    hoverBackgroundColor: 'rgba(255, 69, 0, 0.9)',
    textColor: 'white',
    text: 'X'
  },

  // Factory styling configuration
  factoryStyles: {
    icons: {
      concrete: "CONCRETE_MIXER",
      steel: "STEEL_FURNACE",
      carbon: "CARBON_PLANT",
      oil: "OIL_REFINERY"
    },
    
    colors: {
      concrete: "#fcfc8bff",
      carbon: "#32CD32",
      steel: "#DC143C",
      oil: "#9932CC",
      default: "red"
    },
    
    brighterColors: {
      "#fcfc8bff": "#ffff9f",
      "#32CD32": "#4AE54A",
      "#DC143C": "#FF2C5A",
      "#9932CC": "#B550EA"
    }
  }
};