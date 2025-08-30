// export class FlakButton {
//   constructor(flakManager, panelX, panelY) {
//     this.flakManager = flakManager;
//     this.panelX = panelX;
//     this.panelY = panelY;
    
//     // Position flak button below the 4 factory buttons (2x2 grid)
//     this.buttonWidth = 140; // Make it wider to span across panel
//     this.buttonHeight = 25;
//     this.buttonSpacing = 5;
    
//     // Position below the factory buttons grid (which takes up 2 rows)
//     this.buttonX = panelX + 10; // Align with panel edge
//     this.buttonY = panelY + 25 + 2 * (40 + this.buttonSpacing) + 10; // Below 2x2 factory grid + some spacing
//   }

//   draw(ctx, offsetX, offsetY) {
//     const x = this.buttonX - offsetX;
//     const y = this.buttonY - offsetY;
//     const width = this.buttonWidth;
//     const height = this.buttonHeight;
//     const flakManager = this.flakManager;

//     // Button background
//     let buttonColor = "rgba(70, 130, 180, 0.8)";
//     if (flakManager.upgrading) {
//       buttonColor = "rgba(255, 165, 0, 0.8)";
//     } else if (flakManager.isMaxLevel()) {
//       buttonColor = "rgba(34, 139, 34, 0.8)";
//     }

//     ctx.fillStyle = buttonColor;
//     ctx.fillRect(x, y, width, height);

//     // Button border
//     ctx.strokeStyle = "#91A3AE";
//     ctx.lineWidth = 1;
//     ctx.strokeRect(x, y, width, height);

//     // Button text
//     ctx.fillStyle = "white";
//     ctx.font = "10px Arial";
//     ctx.textAlign = "center";

//     if (flakManager.upgrading) {
//       const timeLeft = flakManager.getRemainingUpgradeTime();
//       ctx.fillText(`Upgrading Flaks... ${timeLeft}s`, x + width / 2, y + 16);
//     } else if (flakManager.isMaxLevel()) {
//       ctx.fillText(`Flaks Level ${flakManager.getLevel()} MAX`, x + width / 2, y + 16);
//     } else {
//       ctx.fillText(`UPGRADE FLAKS (${flakManager.getLevel()} → ${flakManager.getLevel() + 1})`, x + width / 2, y + 16);
//     }

//     // Progress bar for upgrading
//     if (flakManager.upgrading) {
//       const progress = flakManager.getUpgradeProgress();
//       const progressWidth = width * progress;
      
//       ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
//       ctx.fillRect(x, y + height - 3, progressWidth, 3);
//     }
//   }

//   isPointInside(mouseX, mouseY, offsetX, offsetY) {
//     const bounds = {
//       x: this.buttonX + offsetX,
//       y: this.buttonY + offsetY,
//       width: this.buttonWidth,
//       height: this.buttonHeight
//     };
    
//     return (
//       mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
//       mouseY >= bounds.y && mouseY <= bounds.y + bounds.height
//     );
//   }
// }

// export class FlakTimer {
//   constructor(flakManager) {
//     this.flakManager = flakManager;
//   }

//   draw(ctx, offsetX, offsetY) {
//     const flakManager = this.flakManager;
//     if (!flakManager.upgrading) return;

//     // Position the timer above the garage area
//     const x = flakManager.garageX + flakManager.garageWidth / 2 - 50 - offsetX;
//     const y = flakManager.garageY - 70 - offsetY;
    
//     const progress = flakManager.getUpgradeProgress();
//     const timeLeft = flakManager.getRemainingUpgradeTime();
//     const width = 100;
//     const height = 15;

//     // Timer background
//     ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
//     ctx.fillRect(x, y, width, height);

//     // Progress bar
//     ctx.fillStyle = "#4CAF50";
//     ctx.fillRect(x, y, width * progress, height);

//     // Timer text
//     ctx.fillStyle = "white";
//     ctx.font = "10px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(
//       `Flak Upgrade: ${timeLeft}s`,
//       x + width / 2,
//       y + 11
//     );
//   }
// }

// export class FlakUI {
//   constructor(flakManager, panelX, panelY) {
//     this.flakManager = flakManager;
//     this.flakButton = new FlakButton(flakManager, panelX, panelY);
//     this.flakTimer = new FlakTimer(flakManager);
//   }

//   draw(ctx, offsetX, offsetY) {
//     this.flakButton.draw(ctx, offsetX, offsetY);
//     this.flakTimer.draw(ctx, offsetX, offsetY);
//   }

//   update(deltaTime) {
//     if (this.flakManager.update(deltaTime)) {
//       this.completeUpgrade();
//     }
//   }

//   handleClick(mouseX, mouseY) {
//     if (this.flakButton.isPointInside(mouseX, mouseY, 0, 0)) {
//       return this.startUpgrade();
//     }
//     return false;
//   }

//   startUpgrade() {
//     return this.flakManager.startUpgrade();
//   }

//   completeUpgrade() {
//     const newLevel = this.flakManager.completeUpgrade();
//     console.log(`Flaks upgraded to level ${newLevel} (${this.flakManager.getCurrentFlakCount()} flaks)`);
//   }
// }