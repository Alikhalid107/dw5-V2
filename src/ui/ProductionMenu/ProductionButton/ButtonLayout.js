export class ButtonLayout {
  constructor(config) {
    this.spacing = config.buttonSpacing;
  }

  calculatePositions(x, y, buttons) {
    let currentX = x;
    const positions = [];
    
    buttons.forEach((button, index) => {
      positions.push({ x: currentX, y });
      button.setBounds(currentX, y);
      currentX += button.width + (index < buttons.length - 1 ? this.spacing : 0);
    });
    
    return positions;
  }
}