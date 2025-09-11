export class UniversalPanelPositionCalculator {
  static calculate(garageX, garageY, garageWidth, garageHeight, panelWidth, panelConfig) {
    const { panelOffsetX, panelOffsetY } = panelConfig;
    
    // Default positioning logic (can be customized per panel type)
    let baseX, baseY;
    
    if (panelOffsetY > 0) {
      // Position below garage
      baseX = garageX + (garageWidth / 2) - (panelWidth / 2);
      baseY = garageY + garageHeight;
    } else {
      // Position above or to the side
      baseX = garageX + (garageWidth / 2) - (panelWidth / 2);
      baseY = garageY;
    }
    
    return {
      x: baseX + panelOffsetX,
      y: baseY + panelOffsetY
    };
  }
}