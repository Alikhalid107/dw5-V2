// src/ui/UpgradeMenu/UpgradeButton.js
import { IconManager } from '../../utils/IconManager.js';
import { FactorySpriteManager } from './FactorySpriteManager.js';
import { UniversalBoxState } from "../universalSystem/UniversalBoxState.js";
import { UniversalBoxController } from "../universalSystem/UniversalBoxController.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { UPGRADE_BUTTON_CONFIG } from '../../config/UpgradeButtonConfig.js';
import { UNIVERSAL_PANEL_CONFIG } from '../../config/UniversalPanelConfig.js';

/**
 * Upgrade button component using the universal UI system.
 */
export class UpgradeButton {
  constructor(config = UPGRADE_BUTTON_CONFIG,  iconManager = null, spriteManager = null ,config2 = UNIVERSAL_PANEL_CONFIG) {
    this.config = config;
    this.state = new UniversalBoxState({
      boxWidth: config2.grid.boxWidth,
      boxHeight: config2.grid.boxHeight,
    });
    this.controller = new UniversalBoxController(config);
    this.iconManager = new IconManager();
    this.spriteManager =  new FactorySpriteManager(config);
  }

  draw(ctx, x, y, factory) {
    this.state.setBounds(x, y);
    const context = {
      factory,
      isHovered: this.state.isHovered,
      spriteManager: this.spriteManager,
      iconManager: this.iconManager
    };
    UniversalPanelRenderer.drawUniversalBox(ctx, this.state, 'upgrade', context);
  }

  handleClick(mouseX, mouseY, factory) {
    return this.controller.handleClick(mouseX, mouseY, this.state, { factory }, 'upgrade');
  }

  updateHoverState(mouseX, mouseY) {
    return this.controller.updateHoverState(mouseX, mouseY, this.state);
  }

  get buttonBounds() { return this.state.bounds; }
  
  getPosition() {
    return this.state.bounds ? { x: this.state.bounds.x, y: this.state.bounds.y } : null;
  }

  getDimensions() {
    return { width: this.state.width, height: this.state.height };
  }

  updateManagers(iconManager = null, spriteManager = null) {
    if (iconManager) this.iconManager = iconManager;
    if (spriteManager) this.spriteManager = spriteManager;
  }
}