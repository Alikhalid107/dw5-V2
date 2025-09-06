import { PanelBase } from './PanelBase.js';

export class ConfirmationDialog extends PanelBase {
  constructor() {
    super();
    this.showConfirmDialog = false;
    this.confirmYesBounds = null;
    this.confirmNoBounds = null;
    this.dialogBounds = null;
  }

  _roundedRect(ctx, x, y, w, h, r = 8) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  draw(ctx, panelX, panelY, panelWidth) {
    if (!this.showConfirmDialog) return;

    // Draw overlay
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate modal dimensions and position
    const w = Math.min(500, Math.max(320, panelWidth * 0.5));
    const h = Math.max(140, Math.round(w * 0.25));
    const dx = Math.round((ctx.canvas.width - w) / 2);
    const dy = Math.round((ctx.canvas.height - h) / 2);

    this.dialogBounds = this._bounds(dx, dy, w, h);

    // Draw popup with shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    this._roundedRect(ctx, dx, dy, w, h, 4);
    ctx.fillStyle = '#112233';
    ctx.fill();

    // Draw title
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.884)';
    ctx.font = '300 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Really cancel?', dx + w / 2, dy + 40);

    // Draw buttons
    this._drawButtons(ctx, dx, dy, w, h);
    ctx.restore();
  }

  _drawButtons(ctx, dx, dy, w, h) {
    const buttonWidth = 60;
    const buttonHeight = 48;
    const buttonGap = 6;
    const totalButtonsWidth = (buttonWidth * 2) + buttonGap;
    const buttonStartX = dx + (w - totalButtonsWidth) / 2;
    const buttonY = dy + h - buttonHeight - 20;

    // YES button
    const yesX = buttonStartX;
    this.confirmYesBounds = this._bounds(yesX, buttonY, buttonWidth, buttonHeight);
    this._drawButton(ctx, yesX, buttonY, buttonWidth, buttonHeight, 'YES');

    // NO button
    const noX = buttonStartX + buttonWidth + buttonGap;
    this.confirmNoBounds = this._bounds(noX, buttonY, buttonWidth, buttonHeight);
    this._drawButton(ctx, noX, buttonY, buttonWidth, buttonHeight, 'NO');
  }

  _drawButton(ctx, x, y, width, height, text) {
    // Button with shadow
    ctx.save();
    ctx.shadowColor = '#010127';
    ctx.shadowOffsetY = 4;
    
    this._roundedRect(ctx, x, y, width, height, 3);
    ctx.fillStyle = '#3737c5';
    ctx.fill();

    // Bottom shadow
    ctx.fillStyle = 'rgba(1, 1, 39, 0.12)';
    ctx.fillRect(x, y + height, width, 4);

    // Button text
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + width / 2, y + height / 2);
    ctx.restore();
  }

  handleClick(mouseX, mouseY, factory, factoryManager) {
    if (!this.showConfirmDialog) return false;

    // Check if click is inside dialog
    if (!this.isPointInBounds(mouseX, mouseY, this.dialogBounds)) {
      return false;
    }

    if (this.isPointInBounds(mouseX, mouseY, this.confirmYesBounds)) {
      factory.cancelProduction();
      this._hideDialog(factoryManager, factory.type);
      return true;
    }

    if (this.isPointInBounds(mouseX, mouseY, this.confirmNoBounds)) {
      this._hideDialog(factoryManager, factory.type);
      return true;
    }

    return true; // Consume clicks within dialog
  }

  _hideDialog(factoryManager, factoryType) {
    this.showConfirmDialog = false;
    if (factoryManager) {
      factoryManager.setConfirmationDialog(factoryType, false);
    }
  }

  show(factoryManager, factoryType) {
    this.showConfirmDialog = true;
    if (factoryManager) {
      factoryManager.setConfirmationDialog(factoryType, true);
    }
  }

  hide(factoryManager, factoryType) {
    this._hideDialog(factoryManager, factoryType);
  }

  _bounds(x, y, width, height) {
    return { x, y, width, height };
  }

  isPointInBounds(x, y, bounds) {
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width && 
           y >= bounds.y && y <= bounds.y + bounds.height;
  }
}