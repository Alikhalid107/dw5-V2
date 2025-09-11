export const PanelConfigs = {
  garage: {
    gridConfig: {
      rows: 8,
      cols: 4,
      boxWidth: 60,
      boxHeight: 40,
      spacing: 2,
      padding: 70
    },
    panelConfig: {
      // Panel positioning relative to garage
      panelOffsetX: 190,     // Center horizontally
      panelOffsetY: 40,    // 10px below garage
      
      // Hover area (defines when panel appears)
      hoverAreaX: -50,       // No horizontal extension
      hoverAreaY: -50,       // No vertical extension  
      hoverAreaWidth: 400,   // Use garage width (0 = auto)
      hoverAreaHeight: 300   // Use garage height (0 = auto)
    },
    styling: {
      backgroundColor: 'rgba(21, 59, 70, 0.90)',
      borderColor: 'rgba(21, 59, 70, 0.90)',
      boxColor: 'rgba(115, 145, 167, 0.6)',
      hoverColor: 'rgba(255, 255, 255, 0.1)'
    }
  },
  
  radar: {
    gridConfig: {
      rows: 1,
      cols: 4,
      boxWidth: 60,
      boxHeight: 40,
      spacing: 2,
      padding: 40
    },
    panelConfig: {
      // Panel positioning relative to garage
      panelOffsetX: 50,    // 50px to the right of garage
      panelOffsetY: -100,  // 100px above garage
      
      // Hover area (defines when panel appears)
      hoverAreaX: 0,       // No horizontal extension from garage
      hoverAreaY: 0,       // No vertical extension from garage
      hoverAreaWidth: 0,   // Use garage width (0 = auto)
      hoverAreaHeight: 0   // Use garage height (0 = auto)
    },
    styling: {
      backgroundColor: 'rgba(21, 59, 70, 0.90)',
      borderColor: 'rgba(21, 59, 70, 0.90)',
      boxColor: 'rgba(115, 145, 167, 0.6)',
      hoverColor: 'rgba(255, 255, 255, 0.1)'
    }
  }
};