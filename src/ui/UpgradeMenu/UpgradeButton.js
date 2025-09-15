// UpgradeButton.js - Direct usage of UniversalPanelRenderer
import { IconManager } from '../../utils/IconManager.js';
import { FactorySpriteManager } from './FactorySpriteManager.js';
import { UniversalColorCalculator } from "../universalSystem/UniversalColorCalculator.js";
import { UniversalBoxState } from "../universalSystem/UniversalBoxState.js";
import { UniversalBoxController } from "../universalSystem/UniversalBoxController.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js"; // Direct import

import { UPGRADE_BUTTON_CONFIG } from '../../config/UpgradeButtonConfig.js';

export class UpgradeButton {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
    
    // Initialize universal components
    this.state = new UniversalBoxState(config);
    this.colorCalculator = new UniversalColorCalculator(config);
    this.controller = new UniversalBoxController(config);
    
    // Initialize dependencies (no more renderer wrapper)
    this.iconManager = new IconManager();
    this.spriteManager = new FactorySpriteManager(config);
  }

  draw(ctx, x, y, factory) {
    this.state.setBounds(x, y);
    
    // Create context with all dependencies
    const context = {
      factory: factory,
      isHovered: this.state.isHovered,
      iconManager: this.iconManager,
      spriteManager: this.spriteManager,
      colorCalculator: this.colorCalculator
    };
    
    // Use UniversalPanelRenderer directly - no wrapper needed
    UniversalPanelRenderer.drawUniversalBox(ctx, this.state, 'upgrade', context);
  }

  handleClick(mouseX, mouseY, factory) {
    return this.controller.handleClick(mouseX, mouseY, this.state, 
      { factory: factory }, 'upgrade');
  }

  updateHoverState(mouseX, mouseY) {
    return this.controller.updateHoverState(mouseX, mouseY, this.state);
  }

  // Direct access to specific rendering methods if needed
  drawUpgradeContent(ctx, x, y, factory) {
    this.state.setBounds(x, y);
    const context = { 
      factory, 
      spriteManager: this.spriteManager,
      isHovered: this.state.isHovered 
    };
    UniversalPanelRenderer.drawUpgradeContent(ctx, this.state, context);
  }

  // Utility methods - direct calls to UniversalPanelRenderer
  calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    return UniversalPanelRenderer.calculateSpriteDimensions(sprite, factoryType, scaleFactor);
  }

  resetShadow(ctx) {
    UniversalPanelRenderer.resetShadow(ctx);
  }

  // Legacy compatibility methods
  get buttonBounds() {
    return this.state.bounds;
  }

  get styles() {
    return this.colorCalculator;
  }
}