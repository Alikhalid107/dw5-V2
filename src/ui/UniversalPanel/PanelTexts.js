export const PanelTexts = {
  garage: {
    // Function-based text for dynamic content
    getBoxText: (index, manager) => {
      if (index === 0) { // Only first box is buildable
        if (manager.isBuilding()) {
          const timeLeft = manager.getRemainingBuildTime();
          return {
            line1: 'Building...',
            line2: `${timeLeft}s`,
            showProgress: true,
            progress: manager.getBuildProgress()
          };
        } else if (!manager.canBuild()) {
          return {
            line1: 'MAX',
            line2: 'CAPACITY',
            showProgress: false
          };
        } else {
          const nextLevel = manager.getTotalFlakCount() + 1;
          return {
            line1: 'Build',
            line2: `Flak Lvl ${nextLevel}`,
            showProgress: false
          };
        }
      }
      return null; // No text for non-buildable boxes
    },
    
    // Static text alternative (if you prefer)
    staticText: {
      0: { line1: 'Build', line2: 'Flak' }
      // Add more boxes if needed
    }
  },
  
  radar: {
    getBoxText: (index) => {
      return {
        line1: `Box ${index + 1}`,
        line2: '', // Empty second line
        showProgress: false
      };
    },
    
    staticText: {
      0: { line1: 'Box 1', line2: '' },
      1: { line1: 'Box 2', line2: '' },
      2: { line1: 'Box 3', line2: '' },
      3: { line1: 'Box 4', line2: '' }
    }
  }
};