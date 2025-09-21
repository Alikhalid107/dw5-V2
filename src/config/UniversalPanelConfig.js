export const UNIVERSAL_PANEL_CONFIG = {
  // Default panel dimensions and positioning
 PANEL_BACKGROUND:{
      color: 'rgba(6, 50, 77, 0.75)',
  },

  // Grid-based panel configuration (for garage UI, upgrade grids, etc.)
  grid: {
    boxWidth: 60,
    boxHeight: 40,
    spacing: 2,

    alignment: {
      horizontal: 'left',     // 'left', 'center', 'right'
      vertical: 'top',        // 'top', 'center', 'bottom'
      paddingLeft: 2,        // Custom left padding
      paddingTop: 70,         // Custom top padding  
      paddingRight: 0,        // Custom right padding
      paddingBottom: 0,        // Custom bottom padding
    },
  
  
    // Box styling
    boxColors: {
      available: 'rgba(146, 168, 185, 0.5)',
      building: 'rgba(255, 165, 0, 0.8)',
      completed: 'rgba(34, 139, 34, 0.8)',
      disabled: 'rgba(146, 168, 185, 0.5)',
      maxCapacity: 'rgba(34, 139, 34, 0.8)'
    },
    
    hoverEffect: 'rgba(255, 255, 255, 0.1)'
  },

  // Component spacing and sizing (for factory panels, button layouts, etc.)
  COMPONENTS: {
    spacing: {
      panelPadding: 12,
      componentSpacing: 2,
      buttonSpacing: 2,
      componentPadding: 2
    },
    
    sizes: {
      upgradeButtonWidth: 60,
      upgradeButtonHeight: 40,
      productionButtonWidth: 62,
      productionButtonHeight: 40,
      factoryInfoWidth: 60,
      factoryInfoHeight: 40,
      iconSize: 48,
      hoverIconScale: 1.2
    },
    
    positioning: {
      buttonsOffsetX: -10,
      buttonsOffsetY: -10,
      centerVertically: true,
      factoryInfoOffsetX: 10,
      factoryInfoOffsetY1: 25,
      factoryInfoOffsetY2: 45
    },
    
    // Text styling
    text: {
      defaultFont: '12px Arial',
      buttonFont: '20px Tahoma',
      titleFont: '12px Arial',
      factoryNameFont: '700 12px Arial',
      factoryStatusFont: '12px Arial',
      colors: {
        primary: 'white',
        secondary: '#cccccc',
        outline: 'black',
        factoryStatus: 'rgba(255,255,255,0.8)'
      }
    }
  },

  // Animation and visual effects
  EFFECTS: {
    hover: {
      glowColor: 'rgba(255, 255, 255, 0.8)',
      glowBlur: 12,
      overlayColor: 'rgba(255, 255, 255, 0.2)',
      scaleMultiplier: 1.1
    },
    
    progress: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      fillColor: 'rgba(255, 255, 255, 0.7)',
      height: 4
    },
    
    shadows: {
      buttonShadow: 'rgba(255, 255, 255, 0.6)',
      factoryShadow: 'rgba(255, 255, 255, 0.8)'
    }
  },

  // Message Display Configuration
  MESSAGE_DISPLAY: {
    animation: {
      duration: 2000,
      blinkDuration: 1500,
      fadeOutDuration: 500
    },
    
    styling: {
      font: 'bold 18px Arial',
      backgroundColor: 'rgba(200, 0, 0, 0.85)',
      textColor: 'rgba(255, 255, 255, 1)',
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      paddingX: 60,
      bannerHeight: 40
    },
    
    blink: {
      cycleDuration: 500,
      visibleRanges: [
        { start: 0, end: 0.25 },
        { start: 0.5, end: 0.75 }
      ]
    }
  },

  // Production Timer Overlay Configuration
  PRODUCTION_TIMER: {
    dimensions: {
      width: 100,
      height: 40,
      offsetY: 40 // Distance above factory
    },
    
    styling: {
      font: '18px Arial',
      textColor: 'white',
      textAlign: 'center',
      backgroundGradient: {
        start: 'rgba(87, 139, 173, 0.5)',
        end: 'rgba(87, 138, 173, 0.5)'
      }
    }
  },

  // Confirmation Dialog Configuration
  CONFIRMATION_DIALOG: {
    modal: {
      minWidth: 320,
      maxWidth: 500,
      heightRatio: 0.25, // height = width * this ratio
      minHeight: 140,
      cornerRadius: 4,
      backgroundColor: '#112233',
      overlayColor: 'rgba(0, 0, 0, 0.1)',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 15
    },
    
    title: {
      text: 'Really cancel?',
      font: '300 16px Arial',
      color: 'rgba(255, 255, 255, 0.884)',
      offsetY: 40
    },
    
    buttons: {
      width: 60,
      height: 48,
      gap: 6,
      bottomMargin: 20,
      cornerRadius: 3,
      backgroundColor: '#3737c5',
      shadowColor: '#010127',
      shadowOffsetY: 4,
      shadowHeight: 4,
      shadowOpacity: 0.12,
      textColor: 'white',
      textFont: '14px Arial',
      labels: {
        yes: 'YES',
        no: 'NO'
      }
    }
  },

  // Cancel Badge Configuration
  CANCEL_BADGE: {
    iconSizeMultiplier: 1.5, // Relative to production button height
    maxIconSize: 100,
    fallbackStroke: {
      color: 'red',
      width: 3
    }
  },

  // Debug visualization
  DEBUG: {
    enabled: false,
    colors: {
      hoverArea: 'rgba(255, 0, 0, 0.8)',
      panelArea: 'rgba(0, 0, 255, 0.8)',
      targetArea: 'rgba(0, 255, 0, 0.8)'
    },
    lineStyles: {
      hoverArea: [5, 5],
      panelArea: [],
      targetArea: [3, 3]
    }
  },


};