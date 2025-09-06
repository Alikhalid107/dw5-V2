// BoxPositionCalculator.js
export class BoxPositionCalculator {
  static calculate(panelX, panelY, row, col, config) {
    return {
      x: panelX + 2 + col * (config.boxWidth + config.spacing),
      y: panelY + config.padding + row * (config.boxHeight + config.spacing)
    };
  }
}