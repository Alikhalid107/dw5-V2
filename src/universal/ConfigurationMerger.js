import { UNIVERSAL_PANEL_CONFIG } from "../config/UniversalPanelConfig.js";
import { FactoryConfig } from "../config/FactoryConfig.js";
import { GARAGE_UI_CONFIG } from "../config/GarageUIConfig.js";
import { UPGRADE_BUTTON_CONFIG } from "../config/UpgradeButtonConfig.js";
import { PRODUCTION_BUTTONS_CONFIG } from "../config/ProductionButtonConfig.js";

export class ConfigurationMerger {
  static merge(defaultConfig, customConfig) {
    if (!customConfig) return { ...defaultConfig };
    
    const merged = { ...defaultConfig };
    
    for (const [key, value] of Object.entries(customConfig)) {
      if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
        merged[key] = this.merge(defaultConfig[key] || {}, value);
      } else {
        merged[key] = value;
      }
    }
    
    return merged;
  }

  static getFactoryPanelConfig(factoryType) {
    const factoryConfig = FactoryConfig[factoryType];
    if (!factoryConfig) {
      console.warn(`No config found for factory type: ${factoryType}`);
      return UNIVERSAL_PANEL_CONFIG.LAYOUT;
    }
    
    return this.merge(UNIVERSAL_PANEL_CONFIG.LAYOUT, factoryConfig.panelConfig);
  }

  static getGarageUIConfig(customConfig = {}) {
    return this.merge(GARAGE_UI_CONFIG, customConfig);
  }

  static getUpgradeButtonConfig(customConfig = {}) {
    return this.merge(UPGRADE_BUTTON_CONFIG, customConfig);
  }

  static getProductionButtonsConfig(customConfig = {}) {
    return this.merge(PRODUCTION_BUTTONS_CONFIG, customConfig);
  }
}