export const GARAGE_UI_CONFIG = {
  grid: {
    rows: 8,
    cols: 4,
    boxWidth: 60,
    boxHeight: 40,
    spacing: 2,
    padding: 70,
    alignment: {
      horizontal: 'left',     // 'left', 'center', 'right'
      vertical: 'top',        // 'top', 'center', 'bottom'
      paddingLeft: 2,        // Custom left padding
      paddingTop: 70,         // Custom top padding  
      paddingRight: 0,        // Custom right padding
      paddingBottom: 2        // Custom bottom padding
    },
    
    // Garage-specific grid styling (moved from UNIVERSAL_PANEL_CONFIG.GRID)
    boxColors: {
      available: 'rgba(115, 145, 167, 0.6)',
      building: 'rgba(255, 165, 0, 0.8)',
      completed: 'rgba(34, 139, 34, 0.8)',
      disabled: 'rgba(115, 145, 167, 0.6)',
      maxCapacity: 'rgba(34, 139, 34, 0.8)'
    },
    
    hoverEffect: 'rgba(255, 255, 255, 0.1)'
  },
   
  panel: {
    // Panel positioning relative to garage bounds
    offsetX: 0, // Centered horizontally
    offsetY: 10, // Below garage area
    
    // Panel background styling (garage-specific)
    backgroundGradient: {
      start: 'rgba(21, 59, 70, 0.90)',
      end: 'rgba(21, 59, 70, 0.90)'
    },
    
    // Hover areas configuration
    hoverAreaX: 15,        // Extend hover area left of garage (negative = extend left)
    hoverAreaY: 115,        // Extend hover area above garage (negative = extend up)
    hoverAreaWidth: 200,    // Total hover area width (garage width + extensions)
    hoverAreaHeight: 80,    // Total hover area height (garage height + extensions)
    
    // Hover behavior toggles
    garageHoverEnabled: true,
    panelHoverEnabled: true,
    
    // Content configuration
    buildableBoxIndex: 0, // Only first box is buildable
    showProgressBar: true,
    showBuildingText: true,
    showMaxCapacityText: true
  },
  
  content: {
    buildingText: ['Building...', '{}s'], // {} will be replaced with time
    maxCapacityText: ['MAX', 'CAPACITY'],
    buildText: ['Build', 'Flak Lvl {}'], // {} will be replaced with level
    
    // Text positioning within boxes
    textOffsetY: [18, 32], // Y positions for two lines of text
    progressBarOffset: 8, // From bottom of box
    
    // Garage-specific text styling (moved from UNIVERSAL_PANEL_CONFIG.COMPONENTS.text)
    textStyle: {
      font: '12px Arial',
      primaryColor: 'white',
      secondaryColor: '#cccccc',
      outlineColor: 'black'
    }
  },

  // Garage-specific visual effects (moved from UNIVERSAL_PANEL_CONFIG.EFFECTS)
  effects: {
    progress: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      fillColor: 'rgba(255, 255, 255, 0.7)',
      height: 4
    }
  },

  // Debug visualization for garage hover area
  debug: {
    enabled: true, // Set to true to see hover area borders
    colors: {
      hoverArea: 'rgba(255, 0, 0, 0.8)',      // Red border for hover area
      panelArea: 'rgba(0, 0, 255, 0.8)',      // Blue border for panel area
      garageArea: 'rgba(0, 255, 0, 0.8)'      // Green border for garage area
    },
    lineStyles: {
      hoverArea: [5, 5],    // Dashed line for hover area
      panelArea: [],        // Solid line for panel area
      garageArea: [3, 3]    // Dashed line for garage area
    },
    lineWidth: 2
  }
};