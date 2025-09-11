import { BoxPositionCalculator } from "./BoxPositionCalculator.js";

export class UniversalBox {
  constructor(panelUI, row, col, index, panelType, textConfig, styling) {
    this.panelUI = panelUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.panelType = panelType;
    this.textConfig = textConfig;
    this.styling = styling;
    this.isHovered = false;
    this.bounds = null;
    
    // Special handling for garage boxes
    this.canBuild = panelType === 'garage' && index === 0;
  }

  calculateBoxPosition(panelX, panelY) {
    return BoxPositionCalculator.calculate(
      panelX, panelY, this.row, this.col, this.panelUI.gridConfig
    );
  }

  draw(ctx, panelX, panelY) {
    const pos = this.calculateBoxPosition(panelX, panelY);
    const config = this.panelUI.gridConfig;

    // Box background
    let boxColor = this.styling.boxColor;
    
    // Special color logic for garage boxes
    if (this.panelType === 'garage' && this.canBuild && this.panelUI.flakManager) {
      boxColor = this.getGarageBoxColor();
    }
    
    ctx.fillStyle = boxColor;
    ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);

    // Border for radar boxes
    if (this.panelType === 'radar') {
      ctx.strokeStyle = this.styling.borderColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(pos.x, pos.y, config.boxWidth, config.boxHeight);
    }

    // Hover effect
    if (this.isHovered && this.shouldShowHover()) {
      ctx.fillStyle = this.styling.hoverColor;
      ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);
    }

    // Draw text content
    this.drawContent(ctx, pos.x, pos.y, config);

    // Store bounds in world coordinates
    this.bounds = {
      x: pos.x + this.panelUI.currentOffsetX,
      y: pos.y + this.panelUI.currentOffsetY,
      width: config.boxWidth,
      height: config.boxHeight
    };
  }

  getGarageBoxColor() {
    const manager = this.panelUI.flakManager;
    if (!this.canBuild) return 'rgba(115, 145, 167, 0.6)';
    if (manager.isBuilding()) return 'rgba(255, 165, 0, 0.8)';
    if (manager.canBuild()) return 'rgba(115, 145, 167, 0.6)';
    return 'rgba(34, 139, 34, 0.8)';
  }

  shouldShowHover() {
    if (this.panelType === 'garage') {
      return this.canBuild && this.panelUI.flakManager?.canBuild();
    }
    return true; // Always show hover for other panel types
  }

  drawContent(ctx, x, y, config) {
    const textData = this.getTextData();
    if (!textData) return;

    ctx.fillStyle = 'white';
    ctx.font = this.panelType === 'radar' ? '12px Arial' : '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = x + config.boxWidth / 2;
    const centerY = y + config.boxHeight / 2;

    if (textData.line2) {
      // Two lines of text
      ctx.fillText(textData.line1, centerX, centerY - 6);
      ctx.fillText(textData.line2, centerX, centerY + 6);
    } else {
      // Single line
      ctx.fillText(textData.line1, centerX, centerY);
    }

    // Progress bar for garage
    if (textData.showProgress && this.panelType === 'garage') {
      this.drawProgressBar(ctx, x, y, config, textData.progress);
    }
  }

  drawProgressBar(ctx, x, y, config, progress) {
    const progressBarWidth = config.boxWidth - 10;
    const progressX = x + 5;
    const progressY = y + config.boxHeight - 8;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(progressX, progressY, progressBarWidth, 4);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(progressX, progressY, progressBarWidth * progress, 4);
  }

  getTextData() {
    if (typeof this.textConfig.getBoxText === 'function') {
      const manager = this.panelUI.flakManager || null;
      return this.textConfig.getBoxText(this.index, manager);
    } else if (this.textConfig.staticText && this.textConfig.staticText[this.index]) {
      return this.textConfig.staticText[this.index];
    }
    return null;
  }

  updateHoverState(mouseX, mouseY) {
    const shouldCheck = this.panelType === 'radar' || (this.panelType === 'garage' && this.canBuild);
    
    this.isHovered = shouldCheck && this.bounds &&
                     mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;
  }

  handleClick(mouseX, mouseY) {
    if (!this.bounds) return false;

    const isInside = mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;

    if (isInside) {
      if (this.panelType === 'garage' && this.canBuild) {
        return this.panelUI.flakManager?.canBuild() ? this.panelUI.flakManager.startBuilding() : false;
      } else if (this.panelType === 'radar') {
        console.log(`Clicked on radar box ${this.index + 1}`);
        return true;
      }
    }
    return false;
  }

  update(deltaTime) {
    // Placeholder for animations
  }
}