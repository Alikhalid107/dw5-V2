// BuildContentDrawer.js
export class BuildContentDrawer {
  static draw(ctx, x, y, config, flakManager) {
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    const centerX = x + config.boxWidth / 2;

    if (flakManager.isBuilding()) {
      const progress = flakManager.getBuildProgress();
      const timeLeft = flakManager.getRemainingBuildTime();

      ctx.fillText('Building...', centerX, y + 18);
      ctx.fillText(`${timeLeft}s`, centerX, y + 32);

      // Progress bar
      const progressBarWidth = config.boxWidth - 10;
      const progressX = x + 5;
      const progressY = y + config.boxHeight - 8;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(progressX, progressY, progressBarWidth, 4);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(progressX, progressY, progressBarWidth * progress, 4);
    } else if (!flakManager.canBuild()) {
      ctx.fillText('MAX', centerX, y + 18);
      ctx.fillText('CAPACITY', centerX, y + 32);
    } else {
      const nextLevel = flakManager.getTotalFlakCount() + 1; // dynamic level
      ctx.fillText('Build', centerX, y + 18);
      ctx.fillText(`Flak Lvl ${nextLevel}`, centerX, y + 32);
    }
  }
}