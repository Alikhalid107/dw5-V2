import { FactoryButton } from "./FactoryMenu/FactoryButton.js";
import { UpgradeAllButton } from "./FactoryMenu/UpgradeAllButton.js";
import { UpgradeTimer } from "./FactoryMenu/UpgradeTimer.js";


export class FactoryUI {
  constructor(factoryManager, flakManager = null) {
    this.factoryManager = factoryManager;
    this.flakManager = flakManager;
    
    // Constants to avoid duplication
    this.PANEL_WIDTH = 160;
    this.PANEL_HEIGHT = this.flakManager ? 150 : 120; // Increase height if flak manager present
    this.PANEL_OFFSET = 10;
    
    // Calculate panel position once
    this.panelX = this.factoryManager.garageX + this.factoryManager.garageWidth - this.PANEL_WIDTH - this.PANEL_OFFSET;
    this.panelY = this.factoryManager.garageY + this.PANEL_OFFSET;
    
    this.factoryButtons = this.createFactoryButtons();
    this.upgradeTimers = this.createUpgradeTimers();
    this.upgradeAllButton = this.createUpgradeAllButton();
    
    // Create flak button if flak manager is provided
    this.flakButton = this.flakManager ? this.createFlakButton() : null;
    this.flakTimer = this.flakManager ? this.createFlakTimer() : null;
  }

  createFactoryButtons() {
    const factoryOrder = ["concrete", "steel", "carbon", "oil"];
    
    return factoryOrder.map((type, index) => {
      const factory = this.factoryManager.factories[type];
      const row = Math.floor(index / 2);
      const col = index % 2;
      return new FactoryButton(factory, this.panelX, this.panelY, row, col);
    });
  }

  createUpgradeTimers() {
    return Object.values(this.factoryManager.factories).map(
      factory => new UpgradeTimer(factory)
    );
  }

  createUpgradeAllButton() {
    return new UpgradeAllButton(this.factoryManager, this.panelX, this.panelY);
  }

  createFlakButton() {
    // Create a simple flak upgrade button
    return {
      x: this.panelX + 10,
      y: this.panelY + 90, // Position below factory buttons
      width: 60,
      height: 20,
      isPointInside: function(mouseX, mouseY, offsetX, offsetY) {
        const adjustedMouseX = mouseX + offsetX;
        const adjustedMouseY = mouseY + offsetY;
        return adjustedMouseX >= this.x && adjustedMouseX <= this.x + this.width &&
               adjustedMouseY >= this.y && adjustedMouseY <= this.y + this.height;
      }
    };
  }

  createFlakTimer() {
    // Create a simple flak timer display
    return {
      x: this.panelX + 80,
      y: this.panelY + 105,
      draw: (ctx, offsetX, offsetY, flakManager) => {
        if (flakManager.isUpgrading()) {
          ctx.fillStyle = "yellow";
          ctx.font = "10px Arial";
          ctx.textAlign = "left";
          const remaining = flakManager.getRemainingUpgradeTime();
          ctx.fillText(`${remaining}s`, this.x - offsetX, this.y - offsetY);
        }
      }
    };
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.factoryManager.showGrid) return;
    
    this.drawGridOverlay(ctx, offsetX, offsetY);
    this.drawFactoryPanel(ctx, offsetX, offsetY);
    this.drawUpgradeTimers(ctx, offsetX, offsetY);
    this.drawUpgradeAllButton(ctx, offsetX, offsetY);
    
    // Draw flak button and timer if available
    if (this.flakManager) {
      this.drawFlakButton(ctx, offsetX, offsetY);
      if (this.flakTimer) {
        this.flakTimer.draw(ctx, offsetX, offsetY, this.flakManager);
      }
    }
  }

  drawGridOverlay(ctx, offsetX, offsetY) {
    ctx.fillStyle = "rgba(145, 163, 174, 0.1)";
    ctx.fillRect(
      this.factoryManager.garageX - offsetX,
      this.factoryManager.garageY - offsetY,
      this.factoryManager.garageWidth,
      this.factoryManager.garageHeight
    );
  }

  drawFactoryPanel(ctx, offsetX, offsetY) {
    const x = this.panelX - offsetX;
    const y = this.panelY - offsetY;

    // Panel background
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(x, y, this.PANEL_WIDTH, this.PANEL_HEIGHT);

    // Panel border
    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, this.PANEL_WIDTH, this.PANEL_HEIGHT);

    // Panel title
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Factory Upgrades", x + this.PANEL_WIDTH / 2, y + 15);

    // Draw factory buttons
    this.factoryButtons.forEach(button => button.draw(ctx, offsetX, offsetY));
  }

  drawFlakButton(ctx, offsetX, offsetY) {
    if (!this.flakButton || !this.flakManager) return;

    const x = this.flakButton.x - offsetX;
    const y = this.flakButton.y - offsetY;

    // Button background
    const isMaxLevel = this.flakManager.isMaxLevel();
    const isUpgrading = this.flakManager.isUpgrading();
    
    if (isMaxLevel) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Green for max level
    } else if (isUpgrading) {
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)"; // Yellow for upgrading
    } else {
      ctx.fillStyle = "rgba(0, 100, 200, 0.3)"; // Blue for available
    }
    
    ctx.fillRect(x, y, this.flakButton.width, this.flakButton.height);

    // Button border
    ctx.strokeStyle = "#91A3AE";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.flakButton.width, this.flakButton.height);

    // Button text
    ctx.fillStyle = "white";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    const level = this.flakManager.getLevel();
    const maxLevel = this.flakManager.maxLevel;
    ctx.fillText(`Flak ${level}/${maxLevel}`, x + this.flakButton.width / 2, y + 13);

    // Progress bar for upgrading
    if (isUpgrading) {
      const progress = this.flakManager.getUpgradeProgress();
      const progressWidth = this.flakButton.width * progress;
      
      ctx.fillStyle = "rgba(255, 255, 0, 0.6)";
      ctx.fillRect(x, y + this.flakButton.height - 3, progressWidth, 3);
    }
  }

  drawUpgradeTimers(ctx, offsetX, offsetY) {
    this.upgradeTimers.forEach(timer => timer.draw(ctx, offsetX, offsetY));
  }

  drawUpgradeAllButton(ctx, offsetX, offsetY) {
    this.upgradeAllButton.draw(ctx, offsetX, offsetY);
  }

  update(deltaTime) {
    if (this.upgradeAllButton.update(deltaTime)) {
      this.completeUpgradeAll();
    }
  }

  startUpgradeAll() {
    return this.upgradeAllButton.startUpgrade();
  }

  completeUpgradeAll() {
    this.upgradeAllButton.completeUpgrade();
    
    // CRITICAL FIX: Cancel all individual upgrades first and upgrade to max level
    Object.values(this.factoryManager.factories).forEach(factory => {
      // Cancel any ongoing individual upgrades to prevent level overflow
      if (factory.upgrading) {
        factory.upgrading = false;
        factory.upgradeTimer = 0;
      }
      
      // Only upgrade to max if not already at max
      if (!factory.isMaxLevel()) {
        factory.level = factory.maxLevel;
        factory.updateVisuals();
        console.log(`${factory.type} factory upgraded to max level ${factory.maxLevel}`);
      }
    });
  }

  handleClick(mouseX, mouseY) {
    if (!this.factoryManager.showGrid) return false;

    // Check factory buttons
    const factoryButtonClicked = this.factoryButtons.some(button => {
      if (button.isPointInside(mouseX, mouseY, 0, 0)) {
        return this.factoryManager.startUpgrade(button.factory.type);
      }
      return false;
    });
    
    if (factoryButtonClicked) return true;

    // Check flak button
    if (this.flakButton && this.flakManager && 
        this.flakButton.isPointInside(mouseX, mouseY, 0, 0)) {
      return this.flakManager.startUpgrade();
    }

    // Check upgrade all button
    return this.upgradeAllButton.isPointInside(mouseX, mouseY, 0, 0) && 
           this.startUpgradeAll();
  }
}