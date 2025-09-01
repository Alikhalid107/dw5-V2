export const FactoryTypes = {
  concrete: {
    name: "Concrete Factory",
    image: "concreteFactory.png",
    offsetX: 190,
    offsetY: 10,
<<<<<<< HEAD
    width: 209,
    height: 98,
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 1,
    maxLevel: 16, // changed

    // additional building properties (for levels 11-15)
    additionalImage: "concreteFactory.png", // optional, fall back to same image if not provided
    additionalOffsetX: -95, // placed to right of main (approx main width + 10)
    additionalOffsetY: -30, // placed slightly above main
    additionalWidth: 209, // suggested width for the additional building sprite
    additionalHeight: 98,
    additionalZIndex: -98, // behind main building (-97 is in front of main building
  },
  steel: {
    name: "Steel Factory",
    image: "steelFactory.png",
    offsetX: 350,
    offsetY: -75,
    width: 182,
    height: 115,
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 1,
    maxLevel: 16,

    additionalImage: "steelFactory.png",
    additionalOffsetX: -80,
    additionalOffsetY: -30,
    additionalWidth: 182,
    additionalHeight: 115,
    additionalZIndex: -98
  },
  carbon: {
    name: "Carbon Factory",
    image: "carbonFactory.png",
    offsetX: 30,
    offsetY: -80,
    width: 162,
    height: 91,
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 1,
    maxLevel: 16,

    additionalImage: "carbonFactory.png",
    additionalOffsetX: -70,
    additionalOffsetY: -15,
    additionalWidth: 162,
    additionalHeight: 91,
    additionalZIndex: -98
=======
    width: 209,  // Individual width
    height: 98,  // Individual height
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 3000,
    maxLevel: 10
  },
  steel: {
    name: "Steel Factory", 
    image: "steelFactory.png",
    offsetX: 350,
    offsetY: -75,
    width: 182,  // Individual width
    height: 115, // Individual height
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 4000,
    maxLevel: 10
  },
  carbon: {
    name: "Carbon Factory",
    image: "carbonFactory.png", 
    offsetX: -15,
    offsetY: -80,
    width: 162,  // Individual width
    height: 91, // Individual height
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 5000,
    maxLevel: 10
>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
  },
  oil: {
    name: "Oil Factory",
    image: "oilFactory.png",
    offsetX: -250,
    offsetY: -60,
<<<<<<< HEAD
    width: 191,
    height: 107,
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 1,
    maxLevel: 16,

    additionalImage: "oilFactory.png",
    additionalOffsetX: +70,
    additionalOffsetY: -35,
    additionalWidth: 191,
    additionalHeight: 107,
    additionalZIndex: -98
  }
};
=======
    width: 191,  // Individual width
    height: 107,  // Individual height
    level: 1,
    upgrading: false,
    upgradeTimer: 0,
    upgradeTime: 3500,
    maxLevel: 10
  }
};

>>>>>>> 10b4892a0d7c5b6be548eb07ee4631e344072d93
