// FactoryStyleConfig.js - Manages factory visual styling
export class FactoryStyleConfig {
  constructor() {
    this.icons = {
      concrete: "CONCRETE_MIXER",
      steel: "STEEL_FURNACE",
      carbon: "CARBON_PLANT",
      oil: "OIL_REFINERY"
    };
    
    this.colors = {
      concrete: "#fcfc8bff",
      carbon: "#32CD32",
      steel: "#DC143C",
      oil: "#9932CC",
      default: "red"
    };
  }

  getColor(factoryType) {
    return this.colors[factoryType] || this.colors.default;
  }

  getIconName(factoryType) {
    return this.icons[factoryType];
  }

  brightenColor(color, factor) {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * factor));
      const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * factor));
      const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * factor));
      return `rgb(${r}, ${g}, ${b})`;
    }
    
    const brighterColors = {
      "#fcfc8bff": "#ffff9f",
      "#32CD32": "#4AE54A",
      "#DC143C": "#FF2C5A",
      "#9932CC": "#B550EA"
    };
    
    return brighterColors[color] || "#ff4444";
  }
}
