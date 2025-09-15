import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig';
import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";

export class UniversalColorCalculator {
  static getColor(boxType, context) {
    switch (boxType) {
      case 'garage':
        const colors = UNIVERSAL_PANEL_CONFIG.GRID.boxColors;
        if (!context.canBuild) return colors.disabled;
        if (context.flakManager.isBuilding()) return colors.building;
        if (!context.flakManager.canBuild()) return colors.maxCapacity;
        return colors.available;
        
      case 'upgrade':
        const { STYLING } = UPGRADE_BUTTON_CONFIG;
        if (context.factory.upgrading) return STYLING.upgradingBackgroundColor;
        if (context.factory.isMaxLevel()) return STYLING.maxLevelBackgroundColor;
        if (context.isHovered) return STYLING.hoverBackgroundColor;
        return STYLING.backgroundColor;
        
      default:
        return UNIVERSAL_PANEL_CONFIG.GRID.boxColors.available;
    }
  }
}