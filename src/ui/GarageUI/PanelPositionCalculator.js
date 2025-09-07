// PanelPositionCalculator.js
export class PanelPositionCalculator {
  static calculate(garageX, garageY, garageWidth, garageHeight, panelWidth) {
    return {
      x: garageX + (garageWidth / 2) - (panelWidth / 2),
      y: garageY + garageHeight + 10
    };
  }
}
