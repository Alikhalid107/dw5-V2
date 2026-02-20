// Helper to generate standard level progression
const generateLevels = () => 
  Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 2, { cost: (i + 2) * 100, time: i + 2 }]));



// Factory configurations
export const FactoryConfig = {
  concrete: {
    name: "Concrete Factory",
    resource: "Concrete",
    image: "concreteFactory.png",
    offsetX: 190, offsetY: 10, width: 209, height: 98,
    level: 1, maxLevel: 16,
    additionalImage: "concreteFactory.png",
    additionalOffsetX: -95, additionalOffsetY: -30,
    additionalWidth: 209, additionalHeight: 98, additionalZIndex: -98,
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
    resource: "Steel",
    image: "steelFactory.png",
    offsetX: 350, offsetY: -75, width: 182, height: 115,
    level: 1, maxLevel: 16,
    additionalImage: "steelFactory.png",
    additionalOffsetX: -80, additionalOffsetY: -30,
    additionalWidth: 182, additionalHeight: 115, additionalZIndex: -98,
    effects: {
      smoke: {
        image: "smoke.png", offsetX: -30, offsetY: -72,
        width: 8208, height: 95, totalFrames: 72,
        frameSpeed: 15, zIndex: 97, loop: true
      },
      fire: {
        image: "fire.png", offsetX: 90, offsetY: 65,
        width: 14, height: 23, totalFrames: 1,
        frameSpeed: 0, zIndex: 97, loop: false
      }
    }
  },

  carbon: {
    name: "Carbon Factory",
    resource: "Carbon",
    image: "carbonFactory.png",
    offsetX: 30, offsetY: -80, width: 162, height: 91,
    level: 1, maxLevel: 16,
    additionalImage: "carbonFactory.png",
    additionalOffsetX: -70, additionalOffsetY: -15,
    additionalWidth: 162, additionalHeight: 91, additionalZIndex: -98,
  },

  oil: {
    name: "Oil Factory",
    resource: "Fuel",
    image: "oilFactory.png",
    offsetX: -250, offsetY: -60, width: 191, height: 107,
    level: 1, maxLevel: 16,
    additionalImage: "oilFactory.png",
    additionalOffsetX: 70, additionalOffsetY: -35,
    additionalWidth: 191, additionalHeight: 107, additionalZIndex: -98,
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

// Upgrade requirements with shared level data
const SHARED_LEVELS = generateLevels();
const createRequirement = (cost) => ({
  resource: { name: "concrete", color: "#fcfc8bff" },
  production: { cost, color: "#A6C7FA" },
  levels: SHARED_LEVELS
});

export const UPGRADE_REQUIREMENTS = {
  concrete: createRequirement(1),
  steel: createRequirement(2),
  carbon: createRequirement(3),
  oil: createRequirement(4)
};