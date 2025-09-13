export class UniversalPositionCalculator {
  static calculatePanelPosition(target, config) {
    // For factory panels - position relative to factory center
    if (target.width && target.height) {
      const factoryCenterX = target.x + target.width / 2;
      return {
        x: factoryCenterX + config.panelOffsetX - config.panelWidth / 2,
        y: target.y + config.panelOffsetY
      };
    }
    
    // For garage panels - position relative to garage bounds
    if (target.garageX !== undefined) {
      return {
        x: target.garageX + (target.garageWidth / 2) - (config.panelWidth / 2) + config.offsetX,
        y: target.garageY + target.garageHeight + config.offsetY
      };
    }
    
    // Default positioning
    return { x: 0, y: 0 };
  }

  static calculateHoverArea(target, config) {
    return {
      x: target.x + (config.hoverAreaX || 0),
      y: target.y + (config.hoverAreaY || 0),
      width: config.hoverAreaWidth || config.panelWidth,
      height: config.hoverAreaHeight || config.panelHeight
    };
  }

  static calculateGridBoxPosition(panelX, panelY, row, col, gridConfig) {
    return {
      x: panelX + gridConfig.padding + col * (gridConfig.boxWidth + gridConfig.spacing),
      y: panelY + gridConfig.padding + row * (gridConfig.boxHeight + gridConfig.spacing)
    };
  }

  static calculateComponentPositions(panelConfig, componentConfig) {
    const { panelPadding, componentSpacing } = componentConfig.spacing;
    const { buttonsOffsetX, buttonsOffsetY, centerVertically } = componentConfig.positioning;
    
    const startX = panelPadding + buttonsOffsetX;
    const componentY = centerVertically 
      ? (panelConfig.panelHeight - componentConfig.sizes.upgradeButtonHeight) / 2
      : panelPadding + buttonsOffsetY;
    
    return {
      upgradeButton: { x: startX, y: componentY },
      productionButtons: { 
        x: startX + componentConfig.sizes.upgradeButtonWidth + componentSpacing, 
        y: componentY 
      },
      factoryInfo: { 
        x: startX + componentConfig.sizes.upgradeButtonWidth + 
           componentConfig.sizes.productionButtonWidth + (componentSpacing * 2), 
        y: componentY 
      }
    };
  }
}