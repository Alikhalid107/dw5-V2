export const FactoryTypes = {
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
      // Panel size
      panelWidth: 250,
      panelHeight: 120,
      // Panel position relative to factory
      panelOffsetX: 0,    // Horizontal offset from factory center
      panelOffsetY: -90, // Vertical offset from factory top
      // Hover area (relative to factory position)
      hoverAreaX: -20,    // Extend hover area left
      hoverAreaY: -140,   // Extend hover area up
      hoverAreaWidth: 250, // Total hover width
      hoverAreaHeight: 260 // Total hover height
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
      panelWidth: 250,
      panelHeight: 100,
      panelOffsetX: 50,   // Move panel left from center
      panelOffsetY: -100,  // Position above factory
      hoverAreaX: -30,     // Extend hover area
      hoverAreaY: -150,
      hoverAreaWidth: 240,
      hoverAreaHeight: 280
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
      panelWidth: 250,
      panelHeight: 110,
      panelOffsetX: 20,    // Move panel right
      panelOffsetY: -120,
      hoverAreaX: -10,
      hoverAreaY: -130,
      hoverAreaWidth: 200,
      hoverAreaHeight: 240
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
      panelWidth: 250,
      panelHeight: 130,
      panelOffsetX: 50,    // Move panel right due to oil pumps on left
      panelOffsetY: -90,
      hoverAreaX: -40,
      hoverAreaY: -160,
      hoverAreaWidth: 280,
      hoverAreaHeight: 290
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