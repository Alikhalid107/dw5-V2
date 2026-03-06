export const UNIVERSAL_PANEL_CONFIG = {
  // Default panel dimensions and positioning
  PANEL_BACKGROUND: {
    color: "rgba(6, 50, 77, 0.75)",
  },


  grid: {
    boxWidth: 60,
    boxHeight: 40,
    spacing: 2,
    alignment: {
      horizontal: "left",
      vertical: "top",
      paddingLeft: 2,
      paddingTop: 70,
      paddingRight: 2,
      paddingBottom: 2,
    },

    // Add preset configurations
    factory: {
        rows: 1,
        cols: 3,
        alignment: {
          paddingTop: 2, // Override if needed
          // paddingLeft: 2, // Override if needed
          // paddingRight: 2, // Override if needed
          paddingBottom: 60, // Override if needed
        },
    },

    tower: {
      rows: 1,
        cols: 4,
        alignment: {
          paddingTop: 60, // Override if needed
          // paddingLeft: 2, // Override if needed
          // paddingRight: 2, // Override if needed
          paddingBottom: 2, // Override if needed
        },
      },
  

    // Box styling
    boxColors: {
      available: "rgba(146, 168, 185, 0.5)",
      building: "rgba(255, 165, 0, 0.8)",
      completed: "rgba(34, 139, 34, 0.8)",
      disabled: "rgba(146, 168, 185, 0.5)",
      maxCapacity: "rgba(34, 139, 34, 0.8)",
    },

    hoverEffect: "rgba(207, 220, 231, 0.6)",
  },

  // Component spacing and sizing (for factory panels, button layouts, etc.)
  COMPONENTS: {
    spacing: {
      panelPadding: 2,
    },

   
    // Text styling
    text: {
      defaultFont: "12px Arial",
      buttonFont: "20px Tahoma",
      titleFont: "12px Arial",
      factoryNameFont: "700 12px Arial",
      factoryStatusFont: "12px Arial",
      colors: {
        primary: "white",
        secondary: "#cccccc",
        outline: "black",
        factoryStatus: "rgba(255,255,255,0.8)",
      },
    },
  },

  // Message Display Configuration
  MESSAGE_DISPLAY: {
    animation: {
      duration: 2000,
      blinkDuration: 1500,
      fadeOutDuration: 500,
    },

    styling: {
      font: "bold 18px Arial",
      backgroundColor: "rgba(200, 0, 0, 0.85)",
      textColor: "rgba(255, 255, 255, 1)",
      shadowColor: "rgba(0, 0, 0, 0.7)",
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      paddingX: 60,
      bannerHeight: 40,
    },

    blink: {
      cycleDuration: 300,
      visibleRanges: [
        { start: 0, end: 0.25 },
        { start: 0.5, end: 0.75 },
      ],
    },
  },

  // Production Timer Overlay Configuration
  PRODUCTION_TIMER: {
    dimensions: {
      width: 100,
      height: 40,
      offsetY: 40, // Distance above factory
    },

    styling: {
      font: "18px Arial",
      textColor: "white",
      textAlign: "center",
      backgroundGradient: {
        start: "rgba(87, 139, 173, 0.5)",
        end: "rgba(87, 138, 173, 0.5)",
      },
    },
  },

  // Confirmation Dialog Configuration
  CONFIRMATION_DIALOG: {
    modal: {
      minWidth: 320,
      maxWidth: 500,
      heightRatio: 0.25, // height = width * this ratio
      minHeight: 140,
      cornerRadius: 4,
      backgroundColor: "#112233",
      overlayColor: "rgba(0, 0, 0, 0.1)",
      shadowColor: "rgba(0, 0, 0, 0.5)",
      shadowBlur: 15,
    },

    title: {
      text: "Really cancel?",
      font: "300 16px Arial",
      color: "rgba(255, 255, 255, 0.884)",
      offsetY: 40,
    },

    buttons: {
      width: 60,
      height: 48,
      gap: 6,
      bottomMargin: 20,
      cornerRadius: 3,
      backgroundColor: "#3737c5",
      shadowColor: "#010127",
      shadowOffsetY: 4,
      shadowHeight: 4,
      shadowOpacity: 0.12,
      textColor: "white",
      textFont: "14px Arial",
      labels: {
        yes: "YES",
        no: "NO",
      },
    },
  },

  // Cancel Badge Configuration
  CANCEL_BADGE: {
    iconSizeMultiplier: 1.5, // Relative to production button height
    iconSize: 100,
    cancelBadgesOffsetX: 65, // Offset from right edge of panel
    cancelBadgesOffsetY: 0, // Offset from top edge of panel
  },

  // Debug visualization
  DEBUG: {
    enabled: false,
    colors: {
      hoverArea: "rgba(255, 0, 0, 0.8)",
      panelArea: "rgba(0, 0, 255, 0.8)",
      targetArea: "rgba(0, 255, 0, 0.8)",
    },
    lineStyles: {
      hoverArea: [5, 5],
      panelArea: [],
      targetArea: [3, 3],
    },
  },
};
