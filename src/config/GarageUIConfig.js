export const GARAGE_UI_CONFIG = {
  grid: {
    rows: 8,   
    cols: 4,
  },
   
  panel: {
    // Panel positioning relative to garage bounds
    offsetX: 0, // Centered horizontally
    offsetY: 10, // Below garage area
    
    // Hover areas
    garageHoverEnabled: true,
    panelHoverEnabled: true,
    
    // Content configuration
    buildableBoxIndex: true, // Only first box is buildable
    showProgressBar: true,
    showBuildingText: true,
    showMaxCapacityText: true
  },
};