export class GarageUI {
  constructor(flakManager, garageX, garageY, garageWidth, garageHeight) {
    this.flakManager = flakManager;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.showGrid = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    this.gridConfig = {
      rows: 8,
      cols: 4,
      boxWidth: 70,
      boxHeight: 50,
      spacing: 2,
      padding: 70
    };

    this.panelWidth = (this.gridConfig.cols * (this.gridConfig.boxWidth + this.gridConfig.spacing)) - this.gridConfig.spacing + 4;
    this.panelHeight = this.gridConfig.padding + (this.gridConfig.rows * (this.gridConfig.boxHeight + this.gridConfig.spacing)) - this.gridConfig.spacing + 2;
    this.panelBounds = null;
    this.boxes = this.createBoxes();
  }

  createBoxes() {
    const boxes = [];
    for (let row = 0; row < this.gridConfig.rows; row++) {
      for (let col = 0; col < this.gridConfig.cols; col++) {
        boxes.push(new GarageBox(this, row, col, row * this.gridConfig.cols + col));
      }
    }
    return boxes;
  }

  calculatePanelPosition() {
    return {
      x: this.garageX + (this.garageWidth / 2) - (this.panelWidth / 2),
      y: this.garageY + this.garageHeight + 10
    };
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.panelBounds = { x: pos.x, y: pos.y, width: this.panelWidth, height: this.panelHeight };
    this.drawBackground(ctx, x, y);
    this.drawBoxes(ctx, x, y);
  }

  drawBackground(ctx, x, y) {
    const gradient = ctx.createLinearGradient(x, y, x, y + this.panelHeight);
    gradient.addColorStop(0, 'rgba(21, 59, 70, 0.93)');
    gradient.addColorStop(1, 'rgba(21, 59, 70, 0.93)');

    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, this.panelWidth, this.panelHeight);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, this.panelWidth, this.panelHeight);
  }

  drawBoxes(ctx, panelX, panelY) {
    this.boxes.forEach(box => box.draw(ctx, panelX, panelY));
  }

  handleMouseMove(mouseX, mouseY) {
    const isOverGarage = mouseX >= this.garageX && mouseX <= this.garageX + this.garageWidth &&
                        mouseY >= this.garageY && mouseY <= this.garageY + this.garageHeight;

    const isOverPanel = this.panelBounds &&
                       mouseX >= this.panelBounds.x && mouseX <= this.panelBounds.x + this.panelBounds.width &&
                       mouseY >= this.panelBounds.y && mouseY <= this.panelBounds.y + this.panelBounds.height;

    this.showGrid = isOverGarage || isOverPanel;

    if (this.showGrid) {
      this.boxes.forEach(box => box.updateHoverState(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY));
    } else {
      this.boxes.forEach(b => b.isHovered = false);
    }
  }

  handleClick(mouseX, mouseY) {
    if (!this.showGrid) return false;
    return this.boxes.some(box => box.handleClick(mouseX, mouseY, this.currentOffsetX, this.currentOffsetY));
  }

  update(deltaTime) {
    this.boxes.forEach(box => box.update(deltaTime));
  }
}

export class GarageBox {
  constructor(garageUI, row, col, index) {
    this.garageUI = garageUI;
    this.row = row;
    this.col = col;
    this.index = index;
    this.isHovered = false;
    this.canBuild = index === 0;
    this.bounds = null;
  }

  calculateBoxPosition(panelX, panelY) {
    const config = this.garageUI.gridConfig;
    return {
      x: panelX + 2 + this.col * (config.boxWidth + config.spacing),
      y: panelY + config.padding + this.row * (config.boxHeight + config.spacing)
    };
  }

  draw(ctx, panelX, panelY) {
    const pos = this.calculateBoxPosition(panelX, panelY);
    const config = this.garageUI.gridConfig;

    // Box background
    ctx.fillStyle = this.getBoxColor();
    ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);

    // Hover effect
    if (this.isHovered && this.canBuild && this.garageUI.flakManager.canBuild()) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(pos.x, pos.y, config.boxWidth, config.boxHeight);
    }

    // Draw content for buildable box
    if (this.canBuild) {
      this.drawBuildContent(ctx, pos.x, pos.y, config);
    }

    // Store bounds in world coordinates
    this.bounds = {
      x: pos.x + this.garageUI.currentOffsetX,
      y: pos.y + this.garageUI.currentOffsetY,
      width: config.boxWidth,
      height: config.boxHeight
    };
  }

  getBoxColor() {
    if (!this.canBuild) return 'rgba(75, 103, 123, 1)';
    
    const flakManager = this.garageUI.flakManager;
    if (flakManager.isBuilding()) return 'rgba(255, 165, 0, 0.8)';
    if (flakManager.canBuild()) return 'rgba(82, 122, 151, 1)';
    return 'rgba(34, 139, 34, 0.8)';
  }

  drawBuildContent(ctx, x, y, config) {
  ctx.fillStyle = 'white';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';

  const flakManager = this.garageUI.flakManager;
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


  updateHoverState(mouseX, mouseY) {
    this.isHovered = this.canBuild && this.bounds &&
                     mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;
  }

  handleClick(mouseX, mouseY) {
    if (!this.canBuild || !this.bounds || !this.garageUI.flakManager.canBuild()) {
      return false;
    }

    const isInside = mouseX >= this.bounds.x && mouseX <= this.bounds.x + this.bounds.width &&
                     mouseY >= this.bounds.y && mouseY <= this.bounds.y + this.bounds.height;

    return isInside ? this.garageUI.flakManager.startBuilding() : false;
  }

  update(deltaTime) {
    // Placeholder for future animations
  }
}