export const FACTORY_PANEL_CONFIG = {
  LAYOUT: {
    defaultPanelWidth: 190,
    defaultPanelHeight: 100,
    defaultPanelOffsetX: 0,
    defaultPanelOffsetY: -60
  },
  
  COMPONENT_SPACING: {
    panelPadding: 2,
    componentSpacing: 2, // Space between production and upgrade buttons
    buttonSpacing: 2, // Space between 1-hour and 15-hour buttons
    componentPadding: 2,
  },
  
  COMPONENT_SIZES: {
    upgradeButtonWidth: 60,
    upgradeButtonHeight: 40,
    productionButtonsWidth: 130,
    productionButtonsHeight: 40,
    factoryInfoWidth: 60,
    factoryInfoHeight: 40
  },
  
  // NEW: Add component positioning offsets
  COMPONENT_POSITIONING: {
    buttonsOffsetX: 0,    // Horizontal offset for all buttons
    buttonsOffsetY: 50,   // Vertical offset for all buttons (positive = down, negative = up)
    centerVertically: false, // Set to false to use custom Y positioning
  },
  
  MESSAGES: {
    defaultDuration: 3000
  },

  DEBUG: {
    enabled: true,
    colors: {
      hoverArea: 'rgba(255, 0, 0, 0.8)',
      panelArea: 'rgba(0, 0, 255, 0.8)',
      factoryArea: 'rgba(0, 255, 0, 0.8)'
    }
  }
};