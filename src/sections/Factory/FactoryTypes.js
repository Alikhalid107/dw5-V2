export const FactoryTypes = {
  concrete: {
    name: "Concrete Factory",
    image: "concreteFactory.png",
    offsetX: 190, offsetY: 10, width: 209, height: 98,
    level: 1, upgrading: false, upgradeTimer: 0, upgradeTime: 1, maxLevel: 16,

    additionalImage: "concreteFactory.png",
    additionalOffsetX: -95, additionalOffsetY: -30,
    additionalWidth: 209, additionalHeight: 98, additionalZIndex: -98,

    effects: {
      concreteMixerTruck: {
        image: "concreteMixerTruck.png",
        offsetX: 50, offsetY: 30,
        width: 558, height: 51, totalFrames: 9,
        frameSpeed: 20, zIndex: -1, loop: true
      }
    }
  },

  steel: {
    name: "Steel Factory",
    image: "steelFactory.png",
    offsetX: 350, offsetY: -75, width: 182, height: 115,
    level: 1, upgrading: false, upgradeTimer: 0, upgradeTime: 1, maxLevel: 16,

    additionalImage: "steelFactory.png",
    additionalOffsetX: -80, additionalOffsetY: -30,
    additionalWidth: 182, additionalHeight: 115, additionalZIndex: -98,

    effects: {
      smoke: {
        image: "smoke.png", offsetX: 90, offsetY: -40,
        width: 8208, height: 95, totalFrames: 72,
        frameSpeed: 20, zIndex: 93, loop: true
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
    level: 1, upgrading: false, upgradeTimer: 0, upgradeTime: 1, maxLevel: 16,

    additionalImage: "carbonFactory.png",
    additionalOffsetX: -70, additionalOffsetY: -15,
    additionalWidth: 162, additionalHeight: 91, additionalZIndex: -98
  },

  oil: {
    name: "Oil Factory",
    image: "oilFactory.png",
    offsetX: -250, offsetY: -60, width: 191, height: 107,
    level: 1, upgrading: false, upgradeTimer: 0, upgradeTime: 1, maxLevel: 16,

    additionalImage: "oilFactory.png",
    additionalOffsetX: 70, additionalOffsetY: -35,
    additionalWidth: 191, additionalHeight: 107, additionalZIndex: -98,

    effects: {
      oilPumps: [
        {
          image: "oilPump.png",
          offsetX: 80, offsetY: 40,
          width: 3400, height: 74, totalFrames: 50,
          frameSpeed: 20, zIndex: 91, loop: true, startFrame: 0
        }
      ]
    }
  }
};
