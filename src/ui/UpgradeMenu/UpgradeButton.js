// src/ui/UpgradeMenu/UpgradeButton.js
import { IconManager } from '../../utils/IconManager.js';
import { FactorySpriteManager } from './FactorySpriteManager.js'; // Adjust path if needed
// Import the static calculator
import { UniversalBoxState } from "../universalSystem/UniversalBoxState.js";
import { UniversalBoxController } from "../universalSystem/UniversalBoxController.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { UPGRADE_BUTTON_CONFIG } from '../../config/UpgradeButtonConfig.js';

/**
 * Represents an upgrade button, now leveraging the universal UI system.
 */
export class UpgradeButton {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
    // Use UniversalBoxState for managing position, dimensions, and hover state
    this.state = new UniversalBoxState(config);
    // Use UniversalBoxController for handling interactions
    this.controller = new UniversalBoxController(config);
    
    this.iconManager = new IconManager();
    this.spriteManager = new FactorySpriteManager(config);
  }

  /**
   * Draws the upgrade button using the universal renderer.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {Object} factory - The factory object.
   */
  draw(ctx, x, y, factory) {
    // Set the button's bounds
    this.state.setBounds(x, y);

    // Prepare context for the universal renderer
    const context = {
      factory: factory,
      isHovered: this.state.isHovered, // Get hover state from UniversalBoxState
      spriteManager: this.spriteManager,
      iconManager: this.iconManager
    };

    // Delegate all drawing to the universal system
    UniversalPanelRenderer.drawUniversalBox(ctx, this.state, 'upgrade', context);
  }

  /**
   * Handles click events using the universal controller.
   * @param {number} mouseX - Mouse X coordinate.
   * @param {number} mouseY - Mouse Y coordinate.
   * @param {Object} factory - The factory object.
   * @returns {boolean} True if clicked, false otherwise.
   */
  handleClick(mouseX, mouseY, factory) {
    // Delegate click handling to the universal controller
    return this.controller.handleClick(mouseX, mouseY, this.state,
      { factory: factory }, 'upgrade');
  }

  /**
   * Updates the hover state using the universal controller.
   * @param {number} mouseX - Mouse X coordinate.
   * @param {number} mouseY - Mouse Y coordinate.
   * @returns {boolean} True if hover state changed, false otherwise.
   */
  updateHoverState(mouseX, mouseY) {
    // Delegate hover state update to the universal controller
    return this.controller.updateHoverState(mouseX, mouseY, this.state);
  }

  // --- Utility and Legacy Compatibility Methods ---

  /**
   * Draws only the upgrade-specific content (sprite).
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {Object} factory - The factory object.
   */
  drawUpgradeContent(ctx, x, y, factory) {
    this.state.setBounds(x, y);
    const context = {
      factory,
      spriteManager: this.spriteManager,
      isHovered: this.state.isHovered
    };
    UniversalPanelRenderer.drawUpgradeContent(ctx, this.state, context);
  }

  /**
   * Calculates sprite dimensions.
   * @param {SpriteFrameUtility} sprite - The sprite utility.
   * @param {string} factoryType - The factory type.
   * @param {number} scaleFactor - The scale factor.
   * @returns {Object} Dimensions object with width and height.
   */
  calculateSpriteDimensions(sprite, factoryType, scaleFactor) {
    return UniversalPanelRenderer.calculateSpriteDimensions(sprite, factoryType, scaleFactor);
  }

  /**
   * Resets canvas shadow properties.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  resetShadow(ctx) {
    UniversalPanelRenderer.resetShadow(ctx);
  }

  /**
   * Gets the button's bounds.
   * @returns {Object|null} The bounds object or null.
   */
  get buttonBounds() {
    return this.state.bounds;
  }
}