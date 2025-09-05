import { PanelBase } from './PanelBase.js';

export class ConfirmationDialog extends PanelBase {
  constructor() {
    super();
    this.showConfirmDialog = false;
    this.confirmYesBounds = null;
    this.confirmNoBounds = null;
    this.dialogBounds = null;
  }

  // small helper to draw rounded rect
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

    // Draw overlay to dim background
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();

    // Modal size (50% of panel width, 25% height, with max limits)
    const w = Math.min(500, Math.max(320, panelWidth * 0.5));
    const h = Math.max(140, Math.round(w * 0.25));

    // Center modal on the canvas
    const dx = Math.round((ctx.canvas.width - w) / 2);
    const dy = Math.round((ctx.canvas.height - h) / 2);

    // Store dialog bounds for click detection
    this.dialogBounds = this._bounds(dx, dy, w, h);

    // Popup box with shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Draw popup background
    this._roundedRect(ctx, dx, dy, w, h, 4);
    ctx.fillStyle = '#112233';
    ctx.fill();

    // Remove shadow for text and buttons
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Title text "Really cancel?"
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.884)';
    ctx.font = '300 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Really cancel?', dx + w / 2, dy + 40);
    ctx.restore();

    // Buttons
    const buttonWidth = 60;
    const buttonHeight = 48;
    const buttonGap = 6;
    const totalButtonsWidth = (buttonWidth * 2) + buttonGap;
    
    const buttonStartX = dx + (w - totalButtonsWidth) / 2;
    const buttonY = dy + h - buttonHeight - 20;

    // YES button
    const yesX = buttonStartX;
    this.confirmYesBounds = this._bounds(yesX, buttonY, buttonWidth, buttonHeight);

    // YES button shadow effect
    ctx.save();
    ctx.shadowColor = '#010127';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // YES button background
    this._roundedRect(ctx, yesX, buttonY, buttonWidth, buttonHeight, 3);
    ctx.fillStyle = '#3737c5';
    ctx.fill();

    // YES button bottom shadow effect
    ctx.fillStyle = 'rgba(1, 1, 39, 0.12)';
    ctx.fillRect(yesX, buttonY + buttonHeight, buttonWidth, 4);
    ctx.restore();

    // YES text
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = ' 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('YES', yesX + buttonWidth / 2, buttonY + buttonHeight / 2);
    ctx.restore();

    // NO button
    const noX = buttonStartX + buttonWidth + buttonGap;
    this.confirmNoBounds = this._bounds(noX, buttonY, buttonWidth, buttonHeight);

    // NO button shadow effect
    ctx.save();
    ctx.shadowColor = '#010127';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    
    // NO button background
    this._roundedRect(ctx, noX, buttonY, buttonWidth, buttonHeight, 3);
    ctx.fillStyle = '#3737c5';
    ctx.fill();

    // NO button bottom shadow effect
    ctx.fillStyle = 'rgba(1, 1, 39, 0.12)';
    ctx.fillRect(noX, buttonY + buttonHeight, buttonWidth, 4);
    ctx.restore();

    // NO text
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = ' 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NO', noX + buttonWidth / 2, buttonY + buttonHeight / 2);
    ctx.restore();

    ctx.restore(); // Restore from popup box save
  }

  handleClick(mouseX, mouseY, factory, factoryManager) {
    if (!this.showConfirmDialog) return false;

    // Check if click is inside the dialog area
    if (!this.isPointInBounds(mouseX, mouseY, this.dialogBounds)) {
      return false; // Allow clicks outside dialog to pass through
    }

    if (this.isPointInBounds(mouseX, mouseY, this.confirmYesBounds)) {
      factory.cancelProduction();
      this.showConfirmDialog = false;
      if (factoryManager) {
        factoryManager.setConfirmationDialog(factory.type, false);
      }
      return true;
    }

    if (this.isPointInBounds(mouseX, mouseY, this.confirmNoBounds)) {
      this.showConfirmDialog = false;
      if (factoryManager) {
        factoryManager.setConfirmationDialog(factory.type, false);
      }
      return true;
    }

    return true; // Consume clicks within dialog area
  }

  show(factoryManager, factoryType) {
    this.showConfirmDialog = true;
    if (factoryManager) {
      factoryManager.setConfirmationDialog(factoryType, true);
    }
  }

  hide(factoryManager, factoryType) {
    this.showConfirmDialog = false;
    if (factoryManager) {
      factoryManager.setConfirmationDialog(factoryType, false);
    }
  }

  // Helper method to create bounds object
  _bounds(x, y, width, height) {
    return { x, y, width, height };
  }

  // Check if point is within bounds
  isPointInBounds(x, y, bounds) {
    if (!bounds) return false;
    return x >= bounds.x && 
           x <= bounds.x + bounds.width && 
           y >= bounds.y && 
           y <= bounds.y + bounds.height;
  }
}