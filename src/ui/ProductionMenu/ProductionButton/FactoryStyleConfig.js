import { PRODUCTION_BUTTONS_CONFIG } from "../../../config/ProductionButtonConfig.js";

export class FactoryStyleConfig {
  constructor(config = PRODUCTION_BUTTONS_CONFIG.factoryStyles) {
    this.config = config;
  }

  getColor(factoryType) {
    return this.config.colors[factoryType] || this.config.colors.default;
  }

  getIconName(factoryType) {
    return this.config.icons[factoryType];
  }

  brightenColor(color, factor) {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * factor));
      const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * factor));
      const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * factor));
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    return this.config.brighterColors[color] || "#ff4444";
  }
}