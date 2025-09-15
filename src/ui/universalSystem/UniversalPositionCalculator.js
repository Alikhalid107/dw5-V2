export class UniversalPositionCalculator {
  static calculatePanelPosition(target, config) {
    if (target.width && target.height) {
      const centerX = target.x + target.width / 2;
      return {
        x: centerX + config.panelOffsetX - config.panelWidth / 2,
        y: target.y + config.panelOffsetY
      };
    }
    
    if (target.garageX !== undefined) {
      return {
        x: target.garageX + (target.garageWidth / 2) - (config.panelWidth / 2) + config.offsetX,
        y: target.garageY + target.garageHeight + config.offsetY
      };
    }
    
    return { x: 0, y: 0 };
  }

  static calculateHoverArea(target, config) {
    return {
      x: target.x + (config.hoverAreaX || 0),
      y: target.y + (config.hoverAreaY || 0),
      width: config.hoverAreaWidth || config.panelWidth || 100,
      height: config.hoverAreaHeight || config.panelHeight || 100
    };
  }

  static calculateBoxPosition(panelX, panelY, row, col, gridConfig) {
    const {
      boxWidth = 50, boxHeight = 50, spacing = 5,
      alignment = { horizontal: 'left', vertical: 'top', paddingLeft: 70, paddingTop: 70 }
    } = gridConfig;

    const x = panelX + alignment.paddingLeft + col * (boxWidth + spacing);
    const y = panelY + alignment.paddingTop + row * (boxHeight + spacing);

    return { x, y };
  }

  static calculateComponentPositions(panelConfig, componentConfig) {
    const { panelPadding = 10, componentSpacing = 5 } = componentConfig.spacing || {};
    const { buttonsOffsetX = 0, buttonsOffsetY = 0, centerVertically = false } = componentConfig.positioning || {};
    const { upgradeButtonWidth = 50, upgradeButtonHeight = 50, productionButtonWidth = 50 } = componentConfig.sizes || {};
    
    const startX = panelPadding + buttonsOffsetX;
    const componentY = centerVertically 
      ? (panelConfig.panelHeight - upgradeButtonHeight) / 2
      : panelPadding + buttonsOffsetY;
    
    return {
      upgradeButton: { x: startX, y: componentY },
      productionButtons: { 
        x: startX + upgradeButtonWidth + componentSpacing, 
        y: componentY 
      },
      factoryInfo: { 
        x: startX + upgradeButtonWidth + productionButtonWidth + (componentSpacing * 2), 
        y: componentY 
      }
    };
  }

  static calculateHoverArea(target, config) {
    return {
      x: target.x + (config.hoverAreaX || 0),
      y: target.y + (config.hoverAreaY || 0),
      width: config.hoverAreaWidth || config.panelWidth,
      height: config.hoverAreaHeight || config.panelHeight
    };
  }
}