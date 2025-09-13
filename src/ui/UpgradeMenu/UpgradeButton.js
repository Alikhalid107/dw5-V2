// UpgradeButton.js - Main orchestrator class (refactored)
import { PanelBase } from '../ProductionMenu/PanelBase.js';
import { IconManager } from '../../utils/IconManager.js';
import { UpgradeButtonState } from './UpgradeButtonState.js';
import { FactorySpriteManager } from './FactorySpriteManager.js';
import { UpgradeButtonStyles } from './UpgradeButtonStyles.js';
import { UpgradeButtonRenderer } from './UpgradeButtonRenderer.js';
import { UpgradeButtonController } from './UpgradeButtonController.js';
import { UPGRADE_BUTTON_CONFIG } from '../../config/UpgradeButtonConfig.js';

export class UpgradeButton extends PanelBase {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    super();
    
    this.config = config;
    
    // Initialize state with config
    this.state = new UpgradeButtonState(config);
    
    // Initialize components with config
    this.iconManager = new IconManager();
    this.spriteManager = new FactorySpriteManager(config);
    this.styles = new UpgradeButtonStyles(config);
    this.renderer = new UpgradeButtonRenderer(this.iconManager, this.spriteManager, this.styles, config);
    this.controller = new UpgradeButtonController(config);
  }

  draw(ctx, x, y, factory) {
    this.state.setBounds(x, y);
    this.renderer.draw(ctx, this.state, factory);
  }

  handleClick(mouseX, mouseY, factory) {
    return this.controller.handleClick(mouseX, mouseY, this.state, factory);
  }

  updateHoverState(mouseX, mouseY) {
    this.controller.updateHoverState(mouseX, mouseY, this.state);
  }

  // Legacy compatibility methods
  get buttonBounds() {
    return this.state.bounds;
  }

  get isButtonHovered() {
    return this.state.isHovered;
  }
}