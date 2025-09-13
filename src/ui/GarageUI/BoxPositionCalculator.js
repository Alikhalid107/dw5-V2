export class BoxPositionCalculator {
  static calculate(panelX, panelY, row, col, config) {
    // Get alignment settings - config now contains the grid config directly
    const alignmentConfig = config.alignment || {
      horizontal: 'left',
      vertical: 'top',
      paddingLeft: config.padding || 70,
      paddingTop: config.padding || 70,
      paddingRight: 2,
      paddingBottom: 2
    };

    // Calculate base positions
    const baseX = this.calculateHorizontalPosition(panelX, col, config, alignmentConfig);
    const baseY = this.calculateVerticalPosition(panelY, row, config, alignmentConfig);

    return { x: baseX, y: baseY };
  }

  static calculateHorizontalPosition(panelX, col, config, alignmentConfig) {
    const totalGridWidth = config.cols * config.boxWidth + (config.cols - 1) * config.spacing;
    
    switch (alignmentConfig.horizontal) {
      case 'center':
        // Center the grid - calculate panel width dynamically
        const availableWidth = totalGridWidth + alignmentConfig.paddingLeft + alignmentConfig.paddingRight;
        const startX = panelX + (availableWidth - totalGridWidth) / 2;
        return startX + col * (config.boxWidth + config.spacing);
        
      case 'right':
        const rightStartX = panelX + alignmentConfig.paddingLeft + totalGridWidth - config.boxWidth - col * (config.boxWidth + config.spacing);
        return rightStartX;
        
      case 'left':
      default:
        return panelX + alignmentConfig.paddingLeft + col * (config.boxWidth + config.spacing);
    }
  }

  static calculateVerticalPosition(panelY, row, config, alignmentConfig) {
    const totalGridHeight = config.rows * config.boxHeight + (config.rows - 1) * config.spacing;
    
    switch (alignmentConfig.vertical) {
      case 'center':
        const availableHeight = totalGridHeight + alignmentConfig.paddingTop + alignmentConfig.paddingBottom;
        const startY = panelY + (availableHeight - totalGridHeight) / 2;
        return startY + row * (config.boxHeight + config.spacing);
        
      case 'bottom':
        const bottomStartY = panelY + alignmentConfig.paddingTop + totalGridHeight - config.boxHeight - row * (config.boxHeight + config.spacing);
        return bottomStartY;
        
      case 'top':
      default:
        return panelY + alignmentConfig.paddingTop + row * (config.boxHeight + config.spacing);
    }
  }
}