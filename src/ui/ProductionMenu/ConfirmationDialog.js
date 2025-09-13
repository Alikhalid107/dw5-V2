import { PanelBase } from './PanelBase.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';

export class ConfirmationDialog extends PanelBase {
  constructor(config = UNIVERSAL_PANEL_CONFIG.CONFIRMATION_DIALOG) {
    super();
    this.config = config;
    this.showConfirmDialog = false;
    this.confirmYesBounds = null;
    this.confirmNoBounds = null;
    this.dialogBounds = null;
  }

  _roundedRect(ctx, x, y, w, h, r = null) {
    const radius = r || this.config.modal.cornerRadius;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.arcTo(x + w, y, x + w, y + radius, radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
    ctx.lineTo(x + radius, y + h);
    ctx.arcTo(x, y + h, x, y + h - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
  }

  draw(ctx, panelX, panelY, panelWidth) {
    if (!this.showConfirmDialog) return;

    // Draw overlay
    ctx.save();
    ctx.fillStyle = this.config.modal.overlayColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Calculate modal dimensions and position using config
    const w = Math.min(
      this.config.modal.maxWidth, 
      Math.max(this.config.modal.minWidth, panelWidth * 0.5)
    );
    const h = Math.max(
      this.config.modal.minHeight, 
      Math.round(w * this.config.modal.heightRatio)
    );
    const dx = Math.round((ctx.canvas.width - w) / 2);
    const dy = Math.round((ctx.canvas.height - h) / 2);

    this.dialogBounds = this._bounds(dx, dy, w, h);

    // Draw popup with shadow
    ctx.shadowColor = this.config.modal.shadowColor;
    ctx.shadowBlur = this.config.modal.shadowBlur;
    this._roundedRect(ctx, dx, dy, w, h);
    ctx.fillStyle = this.config.modal.backgroundColor;
    ctx.fill();

    // Draw title
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.fillStyle = this.config.title.color;
    ctx.font = this.config.title.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.config.title.text, dx + w / 2, dy + this.config.title.offsetY);

    // Draw buttons
    this._drawButtons(ctx, dx, dy, w, h);
    ctx.restore();
  }

  _drawButtons(ctx, dx, dy, w, h) {
    const { width: buttonWidth, height: buttonHeight, gap: buttonGap, bottomMargin } = this.config.buttons;
    const totalButtonsWidth = (buttonWidth * 2) + buttonGap;
    const buttonStartX = dx + (w - totalButtonsWidth) / 2;
    const buttonY = dy + h - buttonHeight - bottomMargin;

    // YES button
    const yesX = buttonStartX;
    this.confirmYesBounds = this._bounds(yesX, buttonY, buttonWidth, buttonHeight);
    this._drawButton(ctx, yesX, buttonY, buttonWidth, buttonHeight, this.config.buttons.labels.yes);

    // NO button
    const noX = buttonStartX + buttonWidth + buttonGap;
    this.confirmNoBounds = this._bounds(noX, buttonY, buttonWidth, buttonHeight);
    this._drawButton(ctx, noX, buttonY, buttonWidth, buttonHeight, this.config.buttons.labels.no);
  }

  _drawButton(ctx, x, y, width, height, text) {
    // Button with shadow
    ctx.save();
    ctx.shadowColor = this.config.buttons.shadowColor;
    ctx.shadowOffsetY = this.config.buttons.shadowOffsetY;
    
    this._roundedRect(ctx, x, y, width, height, this.config.buttons.cornerRadius);
    ctx.fillStyle = this.config.buttons.backgroundColor;
    ctx.fill();

    // Bottom shadow
    ctx.fillStyle = `rgba(1, 1, 39, ${this.config.buttons.shadowOpacity})`;
    ctx.fillRect(x, y + height, width, this.config.buttons.shadowHeight);

    // Button text
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = this.config.buttons.textColor;
    ctx.font = this.config.buttons.textFont;
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