import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig';
import { GARAGE_UI_CONFIG } from '../../config/GarageUIConfig';

export class BoxColorCalculator {
  static getColor(canBuild, flakManager) {
    const colors = GARAGE_UI_CONFIG.boxColors;
    
    
    
    if (flakManager.isBuilding()) return colors.building;
    if (!flakManager.canBuild()) return colors.maxCapacity;
    return colors;
  }
}