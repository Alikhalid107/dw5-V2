// UpgradeButton.js - Main orchestrator class (refactored)
import { PanelBase } from '../ProductionMenu/PanelBase.js';
import { FACTORY_PANEL_CONFIG } from '../../config/FactoryPanelConfig.js';
import { IconManager } from '../../utils/IconManager.js';
import { UpgradeButtonState } from './UpgradeButtonState.js';
import { FactorySpriteManager } from './FactorySpriteManager.js';
import { UpgradeButtonStyles } from './UpgradeButtonStyles.js';
import { UpgradeButtonRenderer } from './UpgradeButtonRenderer.js';
import { UpgradeButtonController } from './UpgradeButtonController.js';

export class UpgradeButton extends PanelBase {
  constructor() {
    super();
    
    // Initialize state
    this.state = new UpgradeButtonState(
      FACTORY_PANEL_CONFIG.COMPONENT_SIZES.upgradeButtonWidth,
      FACTORY_PANEL_CONFIG.COMPONENT_SIZES.upgradeButtonHeight
    );
    
    // Initialize components
    this.iconManager = new IconManager();
    this.spriteManager = new FactorySpriteManager();
    this.styles = new UpgradeButtonStyles();
    this.renderer = new UpgradeButtonRenderer(this.iconManager, this.spriteManager, this.styles);
    this.controller = new UpgradeButtonController();
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

  // Legacy compatibility methods (if needed)
  get buttonBounds() {
    return this.state.bounds;
  }

  get isButtonHovered() {
    return this.state.isHovered;
  }
}