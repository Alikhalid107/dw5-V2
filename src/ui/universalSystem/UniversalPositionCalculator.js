// src/universalSystem/UniversalPositionCalculator.js
export class UniversalPositionCalculator {
  static calculatePanelPosition(target, config) {
    if (target.width && target.height) {
      const centerX = target.x + target.width / 2;
      return {
        x: centerX + (config.panelOffsetX || 0) - (config.panelWidth || 0) / 2, // Added defaults
        y: target.y + (config.panelOffsetY || 0) // Added default
      };
    }

    if (target.garageX !== undefined) {
      return {
        x: target.garageX + (target.garageWidth / 2) - (config.panelWidth / 2) + (config.offsetX || 0), // Added default
        y: target.garageY + target.garageHeight + (config.offsetY || 0) // Added default
      };
    }

    return { x: 0, y: 0 };
  }

  // Removed the first duplicate calculateHoverArea

  static calculateBoxPosition(panelX, panelY, row, col, gridConfig) {
    const {
      boxWidth = 60, boxHeight = 40, spacing = 2,
      alignment = { horizontal: 'left', vertical: 'top', paddingLeft: 0, paddingTop: 0 }
    } = gridConfig;

    const x = panelX + (alignment.paddingLeft || 0) + col * ((boxWidth || 0) + (spacing || 0)); // Added defaults
    const y = panelY + (alignment.paddingTop || 0) + row * ((boxHeight || 0) + (spacing || 0)); // Added defaults

    return { x, y };
  }

  static calculateComponentPositions(panelConfig, componentConfig) {
    const { panelPadding = 10, componentSpacing = 5 } = componentConfig.spacing || {};
    const { buttonsOffsetX = 0, buttonsOffsetY = 0, centerVertically = false } = componentConfig.positioning || {};
    const { upgradeButtonWidth = 50, upgradeButtonHeight = 50, productionButtonWidth = 50 } = componentConfig.sizes || {};

    const startX = (panelPadding || 0) + (buttonsOffsetX || 0); // Added defaults
    // Consider adding defaults if panelHeight might be undefined
    const componentY = centerVertically
      ? ((panelConfig.panelHeight || 0) - (upgradeButtonHeight || 0)) / 2 // Added defaults
      : (panelPadding || 0) + (buttonsOffsetY || 0); // Added defaults

    return {
      upgradeButton: { x: startX, y: componentY },
      productionButtons: {
        x: startX + (upgradeButtonWidth || 0) + (componentSpacing || 0), // Added defaults
        y: componentY
      },
      factoryInfo: {
        x: startX + (upgradeButtonWidth || 0) + (productionButtonWidth || 0) + ((componentSpacing || 0) * 2), // Added defaults
        y: componentY
      }
    };
  }

  // Kept the second, presumably correct definition
  static calculateHoverArea(target, config) {
    // Consider if defaults like || 100 from the first definition are needed here
    return {
      x: target.x + (config.hoverAreaX || 0),
      y: target.y + (config.hoverAreaY || 0),
      width: config.hoverAreaWidth || config.panelWidth, // No default like || 100
      height: config.hoverAreaHeight || config.panelHeight // No default like || 100
    };
  }
}