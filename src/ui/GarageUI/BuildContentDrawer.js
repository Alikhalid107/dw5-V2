import { UNIVERSAL_PANEL_CONFIG} from '../../config/UniversalPanelConfig.js';
import { GARAGE_UI_CONFIG } from '../../config/GarageUIConfig.js';

export class BuildContentDrawer {
  static draw(ctx, x, y, config, flakManager) {
    const textConfig = UNIVERSAL_PANEL_CONFIG.COMPONENTS.text;
    const contentConfig = GARAGE_UI_CONFIG.content;
    
    ctx.fillStyle = textConfig.colors.primary;
    ctx.font = textConfig.defaultFont;
    ctx.textAlign = 'center';

    const centerX = x + config.boxWidth / 2;

    if (flakManager.isBuilding()) {
      const progress = flakManager.getBuildProgress();
      const timeLeft = flakManager.getRemainingBuildTime();

      // Use config text values
      const buildingText = contentConfig.buildingText[0]; // 'Building...'
      const timeText = contentConfig.buildingText[1].replace('{}', timeLeft); // Replace {} with actual time

      ctx.fillText(buildingText, centerX, y + contentConfig.textOffsetY[0]);
      ctx.fillText(timeText, centerX, y + contentConfig.textOffsetY[1]);

      // Progress bar using config values
      const progressConfig = UNIVERSAL_PANEL_CONFIG.EFFECTS.progress;
      const progressBarWidth = config.boxWidth - 10;
      const progressX = x + 5;
      const progressY = y + config.boxHeight - contentConfig.progressBarOffset;

      ctx.fillStyle = progressConfig.backgroundColor;
      ctx.fillRect(progressX, progressY, progressBarWidth, progressConfig.height);

      ctx.fillStyle = progressConfig.fillColor;
      ctx.fillRect(progressX, progressY, progressBarWidth * progress, progressConfig.height);
    } else if (!flakManager.canBuild()) {
      // Use config text values for max capacity
      ctx.fillText(contentConfig.maxCapacityText[0], centerX, y + contentConfig.textOffsetY[0]);
      ctx.fillText(contentConfig.maxCapacityText[1], centerX, y + contentConfig.textOffsetY[1]);
    } else {
      const nextLevel = flakManager.getTotalFlakCount() + 1;
      
      // Use config text values for build text
      const buildText = contentConfig.buildText[0]; // 'Build'
      const levelText = contentConfig.buildText[1].replace('{}', nextLevel); // Replace {} with level
      
      ctx.fillText(buildText, centerX, y + contentConfig.textOffsetY[0]);
      ctx.fillText(levelText, centerX, y + contentConfig.textOffsetY[1]);
    }
  }
}