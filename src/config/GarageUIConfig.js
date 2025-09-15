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
  
  },
   
  panel: {
    // Panel positioning relative to garage bounds
    offsetX: 0, // Centered horizontally
    offsetY: 10, // Below garage area
    
    // Hover areas
    garageHoverEnabled: true,
    panelHoverEnabled: true,
    
    // Content configuration
    buildableBoxIndex: 0, // Only first box is buildable
    showProgressBar: true,
    showBuildingText: true,
    showMaxCapacityText: true
  },
  
  content: {
    buildingText: ['Building...', `{$100}s`], // {} will be replaced with time
    maxCapacityText: ['MAX', 'CAPACITY'],
    buildText: ['Build', 'Flak Lvl {}'], // {} will be replaced with level
    
    // Text positioning within boxes
    textOffsetY: [18, 32], // Y positions for two lines of text
    progressBarOffset: 8 // From bottom of box
  }
};