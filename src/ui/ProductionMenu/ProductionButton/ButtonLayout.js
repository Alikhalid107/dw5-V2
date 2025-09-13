import { PRODUCTION_BUTTONS_CONFIG } from "../../../config/ProductionButtonConfig";
export class ButtonLayout {
  constructor(config = PRODUCTION_BUTTONS_CONFIG) {
    this.config = config;
    this.spacing = config.layout.spacing;
    this.alignment = config.layout.alignment;
  }

  calculatePositions(x, y, buttons) {
    const positions = [];
    
    if (this.alignment === 'horizontal') {
      let currentX = x;
      buttons.forEach((button, index) => {
        positions.push({ x: currentX, y });
        button.setBounds(currentX, y);
        currentX += button.width + (index < buttons.length - 1 ? this.spacing : 0);
      });
    } else {
      let currentY = y;
      buttons.forEach((button, index) => {
        positions.push({ x, y: currentY });
        button.setBounds(x, currentY);
        currentY += button.height + (index < buttons.length - 1 ? this.spacing : 0);
      });
    }
    
    return positions;
  }
}