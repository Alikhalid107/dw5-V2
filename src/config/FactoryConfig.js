export const FactoryConfig = {
  concrete: {
    name: "Concrete Factory",
    image: "concreteFactory.png",
    offsetX: 190, offsetY: 10, width: 209, height: 98,
    level: 1, maxLevel: 16,
    additionalImage: "concreteFactory.png",
    additionalOffsetX: -95, additionalOffsetY: -30,
    additionalWidth: 209, additionalHeight: 98, additionalZIndex: -98,
    // Panel Configuration
    panelConfig: {
      // Panel size and position
      panelWidth: 120,
      panelHeight: 100,
      panelOffsetX: 0,     // Horizontal offset from factory center
      panelOffsetY: -20,  // Vertical offset from factory top
      
      // Hover area (relative to factory position) - LARGER than panel
      hoverAreaX: 50,     // Extend hover area left of factory   // red area move 
      hoverAreaY: 30,    // Extend hover area above factory       // red area move
      hoverAreaWidth: 180, // Wider than panel for easier interaction  // red area width 
      hoverAreaHeight: 50 // Taller than panel for easier interaction  // red area height
    },
    effects: {
      concreteMixerTruck: {
        image: "concreteMixerTruck.png", offsetX: 90, offsetY: 50,
        width: 558, height: 51, totalFrames: 9,
        frameSpeed: 10, zIndex: 95, loop: true
      }
    }
  },

  steel: {
    name: "Steel Factory",
    image: "steelFactory.png",
    offsetX: 350, offsetY: -75, width: 182, height: 115,
    level: 1, maxLevel: 16,
    additionalImage: "steelFactory.png",
    additionalOffsetX: -80, additionalOffsetY: -30,
    additionalWidth: 182, additionalHeight: 115, additionalZIndex: -98,
    // Panel Configuration
    panelConfig: {
      panelWidth: 120,
      panelHeight: 100,
      panelOffsetX: 0,   // Move panel left from center (avoid smoke)
      panelOffsetY: -20,  // Position well above factory
      
      hoverAreaX: 30,     // Extended hover area
      hoverAreaY: 30,
      hoverAreaWidth: 190,
      hoverAreaHeight: 50
    },
    effects: {
      smoke: {
        image: "smoke.png", offsetX: -30, offsetY: -72,
        width: 8208, height: 95, totalFrames: 72,
        frameSpeed: 15, zIndex: 97, loop: true
      },
      fire: {
        image: "fire.png", offsetX: 90, offsetY: 65,
        width: 14, height: 23, totalFrames: 1,
        frameSpeed: 0, zIndex: 92, loop: false
      }
    }
  },

  carbon: {
    name: "Carbon Factory",
    image: "carbonFactory.png",
    offsetX: 30, offsetY: -80, width: 162, height: 91,
    level: 1, maxLevel: 16,
    additionalImage: "carbonFactory.png",
    additionalOffsetX: -70, additionalOffsetY: -15,
    additionalWidth: 162, additionalHeight: 91, additionalZIndex: -98,
    // Panel Configuration
    panelConfig: {
      panelWidth: 120,
      panelHeight: 100,
      panelOffsetX: 0,    // Move panel right
      panelOffsetY: -20,
      
      hoverAreaX: 20,     // Reasonable hover area
      hoverAreaY: 30,
      hoverAreaWidth: 190,
      hoverAreaHeight: 50,
    }
  },

  oil: {
    name: "Oil Factory",
    image: "oilFactory.png",
    offsetX: -250, offsetY: -60, width: 191, height: 107,
    level: 1, maxLevel: 16,
    additionalImage: "oilFactory.png",
    additionalOffsetX: 70, additionalOffsetY: -35,
    additionalWidth: 191, additionalHeight: 107, additionalZIndex: -98,
    // Panel Configuration
    panelConfig: {
      panelWidth: 120,
      panelHeight: 100,
      panelOffsetX: 0,    // Move panel well to the right (avoid oil pumps)
      panelOffsetY: -20,
      
      hoverAreaX: 35,     // Large hover area to include oil pumps
      hoverAreaY: 30,
      hoverAreaWidth: 190, // Very wide to cover pumps and factory
      hoverAreaHeight: 50,
    },
    effects: {
      oilPumps: [
        {
          image: "oilPump.png", offsetX: -20, offsetY: 40,
          width: 3400, height: 74, totalFrames: 50,
          frameSpeed: 15, zIndex: 91, loop: true, startFrame: 0
        },
        {
          image: "oilPump.png", offsetX: 40, offsetY: 60,
          width: 3400, height: 74, totalFrames: 50,
          frameSpeed: 10, zIndex: 91, loop: true, startFrame: 0
        }
      ]
    }
  }
};