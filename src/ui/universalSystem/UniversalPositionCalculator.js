// src/ui/universalSystem/UniversalPositionCalculator.js
export class UniversalPositionCalculator {

  
  static calculatePanelPosition(target, config) {
    if (target.width && target.height) {
      const centerX = target.x + target.width / 2;
      return {
        x: centerX + (config.panelOffsetX || 0) - (config.panelWidth || 0) / 2,
        y: target.y + (config.panelOffsetY || 0)
      };
    }

    if (target.garageX !== undefined) {
      return {
        x: target.garageX + (target.garageWidth / 2) - (config.panelWidth / 2) + (config.offsetX || 0),
        y: target.garageY + target.garageHeight + (config.offsetY || 0)
      };
    }

    return { x: 0, y: 0 };
  }

  static calculateBoxPosition(panelX, panelY, row, col, gridConfig) {
    const {
      boxWidth = 60, 
      boxHeight = 40, 
      spacing = 2,
      alignment = { horizontal: 'left', vertical: 'top', paddingLeft: 0, paddingTop: 0 }
    } = gridConfig;

    const x = panelX + (alignment.paddingLeft || 0) + col * (boxWidth + spacing);
    const y = panelY + (alignment.paddingTop || 0) + row * (boxHeight + spacing);

    return { x, y };
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