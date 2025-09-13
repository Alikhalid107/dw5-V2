// =============================================================================
// UNIVERSAL PANEL COMPONENT - One component to rule all panels
// =============================================================================
import {UniversalPanelRenderer,} from "./UniversalPanelConfig.js";
import {UniversalPositionCalculator,} from "./UniversalPositionCalculator.js";
import {ConfigurationMerger} from "./ConfigurationMerger.js";
import {UNIVERSAL_PANEL_CONFIG} from "../config/UniversalPanelConfig.js";


export class UniversalPanel {
  constructor(target, panelType, customConfig = {}) {
    this.target = target; // Factory, garage, or any target object
    this.panelType = panelType; // 'factory', 'garage', 'upgrade', etc.
    this.config = this.mergeConfiguration(customConfig);

    // Initialize state
    this.showPanel = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;
    this.panelBounds = null;

    // Initialize components based on panel type
    this.initializeComponents();
  }

  mergeConfiguration(customConfig) {
    switch (this.panelType) {
      case "factory":
        return ConfigurationMerger.getFactoryPanelConfig(
          this.target.type,
          customConfig
        );
      case "garage":
        return ConfigurationMerger.getGarageUIConfig(customConfig);
      case "upgrade":
        return ConfigurationMerger.getUpgradeButtonConfig(customConfig);
      case "production":
        return ConfigurationMerger.getProductionButtonsConfig(customConfig);
      default:
        return ConfigurationMerger.merge(
          UNIVERSAL_PANEL_CONFIG.LAYOUT,
          customConfig
        );
    }
  }

  initializeComponents() {
    switch (this.panelType) {
      case "factory":
        this.initializeFactoryComponents();
        break;
      case "garage":
        this.initializeGarageComponents();
        break;
      case "upgrade":
        this.initializeUpgradeComponents();
        break;
      case "production":
        this.initializeProductionComponents();
        break;
    }
  }

  initializeFactoryComponents() {
    // Factory panel specific components
    this.components = {
      upgradeButton: { type: "button", config: this.config.upgradeButton },
      productionButtons: {
        type: "buttonGroup",
        config: this.config.productionButtons,
      },
      cancelBadges: { type: "badgeGroup", config: this.config.cancelBadges },
      confirmDialog: { type: "dialog", config: this.config.confirmDialog },
      messageDisplay: { type: "message", config: this.config.messageDisplay },
    };
  }

  initializeGarageComponents() {
    // Create grid-based components
    this.components = {
      grid: this.createGridComponents(),
    };

    // Calculate panel dimensions based on grid
    this.calculateGridPanelDimensions();
  }

  createGridComponents() {
    const grid = [];
    const gridConfig = this.config.grid;

    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        const index = row * gridConfig.cols + col;
        grid.push({
          row,
          col,
          index,
          isInteractive: this.isGridBoxInteractive(index),
          bounds: null,
          isHovered: false,
          content: this.getGridBoxContent(index),
        });
      }
    }
    return grid;
  }

  isGridBoxInteractive(index) {
    // Override in subclasses - by default only first box is interactive
    return index === (this.config.panel?.buildableBoxIndex || 0);
  }

  getGridBoxContent(index) {
    // Override in subclasses - default content for garage UI
    if (!this.isGridBoxInteractive(index)) {
      return {
        text: [],
        backgroundColor: UNIVERSAL_PANEL_CONFIG.GRID.boxColors.disabled,
      };
    }

    // For garage UI - show building status
    if (this.target.flakManager?.isBuilding?.()) {
      const progress = this.target.flakManager.getBuildProgress();
      const timeLeft = this.target.flakManager.getRemainingBuildTime();
      return {
        text: ["Building...", `${timeLeft}s`],
        progress: progress,
        backgroundColor: UNIVERSAL_PANEL_CONFIG.GRID.boxColors.building,
      };
    }

    if (!this.target.flakManager?.canBuild?.()) {
      return {
        text: ["MAX", "CAPACITY"],
        backgroundColor: UNIVERSAL_PANEL_CONFIG.GRID.boxColors.maxCapacity,
      };
    }

    const nextLevel = (this.target.flakManager?.getTotalFlakCount?.() || 0) + 1;
    return {
      text: ["Build", `Flak Lvl ${nextLevel}`],
      backgroundColor: UNIVERSAL_PANEL_CONFIG.GRID.boxColors.available,
    };
  }

  calculateGridPanelDimensions() {
    const gridConfig = this.config.grid;
    this.config.panelWidth =
      gridConfig.cols * (gridConfig.boxWidth + gridConfig.spacing) -
      gridConfig.spacing +
      gridConfig.padding / 2;
    this.config.panelHeight =
      gridConfig.padding +
      gridConfig.rows * (gridConfig.boxHeight + gridConfig.spacing) -
      gridConfig.spacing +
      2;
  }

  // =============================================================================
  // POSITIONING SYSTEM
  // =============================================================================
  calculatePanelPosition() {
    return UniversalPositionCalculator.calculatePanelPosition(
      this.target,
      this.config
    );
  }

  calculateHoverArea() {
    return UniversalPositionCalculator.calculateHoverArea(
      this.target,
      this.config
    );
  }

  getScreenPosition(offsetX = 0, offsetY = 0) {
    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;
    return { x, y, isValid: isFinite(x) && isFinite(y) };
  }

  isPointInHoverArea(mouseX, mouseY) {
    const hoverArea = this.calculateHoverArea();
    return (
      mouseX >= hoverArea.x &&
      mouseX <= hoverArea.x + hoverArea.width &&
      mouseY >= hoverArea.y &&
      mouseY <= hoverArea.y + hoverArea.height
    );
  }

  isPointInPanelArea(mouseX, mouseY) {
    if (!this.panelBounds) return false;
    return (
      mouseX >= this.panelBounds.x &&
      mouseX <= this.panelBounds.x + this.panelBounds.width &&
      mouseY >= this.panelBounds.y &&
      mouseY <= this.panelBounds.y + this.panelBounds.height
    );
  }

  // =============================================================================
  // EVENT HANDLING SYSTEM
  // =============================================================================
  handleMouseMove(mouseX, mouseY) {
    // Handle different hover logic based on panel type
    switch (this.panelType) {
      case "factory":
        return this.handleFactoryHover(mouseX, mouseY);
      case "garage":
        return this.handleGarageHover(mouseX, mouseY);
      default:
        this.showPanel = this.isPointInHoverArea(mouseX, mouseY);
        return this.showPanel;
    }
  }

  handleFactoryHover(mouseX, mouseY) {
    this.showPanel = this.isPointInHoverArea(mouseX, mouseY);
    return this.showPanel;
  }

  handleGarageHover(mouseX, mouseY) {
    // Check if mouse is over garage area or panel area
    const isOverGarage =
      mouseX >= this.target.garageX &&
      mouseX <= this.target.garageX + this.target.garageWidth &&
      mouseY >= this.target.garageY &&
      mouseY <= this.target.garageY + this.target.garageHeight;

    const isOverPanel = this.isPointInPanelArea(mouseX, mouseY);
    this.showPanel = isOverGarage || isOverPanel;

    // Update grid hover states
    if (this.showPanel && this.components.grid) {
      this.updateGridHoverStates(mouseX, mouseY);
    } else {
      this.resetGridHoverStates();
    }

    return this.showPanel;
  }

  updateGridHoverStates(mouseX, mouseY) {
    this.components.grid.forEach((box) => {
      if (box.isInteractive && box.bounds) {
        box.isHovered =
          mouseX >= box.bounds.x &&
          mouseX <= box.bounds.x + box.bounds.width &&
          mouseY >= box.bounds.y &&
          mouseY <= box.bounds.y + box.bounds.height;
      }
    });
  }

  resetGridHoverStates() {
    if (this.components.grid) {
      this.components.grid.forEach((box) => (box.isHovered = false));
    }
  }

  handleClick(mouseX, mouseY) {
    if (!this.showPanel) return false;

    switch (this.panelType) {
      case "factory":
        return this.handleFactoryClick(mouseX, mouseY);
      case "garage":
        return this.handleGarageClick(mouseX, mouseY);
      default:
        return false;
    }
  }

  handleFactoryClick(mouseX, mouseY) {
    // Factory click handling - delegate to factory-specific logic
    // This would integrate with your existing factory click handlers
    return false; // Placeholder
  }

  handleGarageClick(mouseX, mouseY) {
    if (!this.components.grid) return false;

    return this.components.grid.some((box) => {
      if (!box.isInteractive || !box.bounds) return false;

      const isInside =
        mouseX >= box.bounds.x &&
        mouseX <= box.bounds.x + box.bounds.width &&
        mouseY >= box.bounds.y &&
        mouseY <= box.bounds.y + box.bounds.height;

      if (isInside && this.target.flakManager?.canBuild?.()) {
        return this.target.flakManager.startBuilding();
      }

      return false;
    });
  }

  // =============================================================================
  // RENDERING SYSTEM
  // =============================================================================
  draw(ctx, offsetX = 0, offsetY = 0) {
    if (!this.showPanel) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const screenPos = this.getScreenPosition(offsetX, offsetY);
    if (!screenPos.isValid) return;

    const { x: panelX, y: panelY } = screenPos;

    // Update panel bounds for click detection
    this.panelBounds = {
      x: panelX + offsetX,
      y: panelY + offsetY,
      width: this.config.panelWidth,
      height: this.config.panelHeight,
    };

    // Draw background
    UniversalPanelRenderer.drawPanelBackground(
      ctx,
      panelX,
      panelY,
      this.config.panelWidth,
      this.config.panelHeight
    );

    // Draw components based on panel type
    switch (this.panelType) {
      case "factory":
        this.drawFactoryComponents(ctx, panelX, panelY);
        break;
      case "garage":
        this.drawGarageComponents(ctx, panelX, panelY);
        break;
      case "upgrade":
        this.drawUpgradeComponents(ctx, panelX, panelY);
        break;
    }

    // Draw debug borders if enabled
    this.drawDebugBorders(ctx, offsetX, offsetY);
  }

  drawFactoryComponents(ctx, panelX, panelY) {
    // This would integrate with your existing factory component rendering
    // For now, placeholder implementation
    const componentPositions =
      UniversalPositionCalculator.calculateComponentPositions(
        this.config,
        UNIVERSAL_PANEL_CONFIG.COMPONENTS
      );

    // Draw each component at calculated positions
    Object.entries(componentPositions).forEach(([componentName, pos]) => {
      const componentX = panelX + pos.x;
      const componentY = panelY + pos.y;
      // Render component at componentX, componentY
    });
  }

  drawGarageComponents(ctx, panelX, panelY) {
    if (!this.components.grid) return;

    this.components.grid.forEach((box) => {
      const boxPos = UniversalPositionCalculator.calculateGridBoxPosition(
        panelX,
        panelY,
        box.row,
        box.col,
        this.config.grid
      );

      // Update box bounds for click detection
      box.bounds = {
        x: boxPos.x + this.currentOffsetX,
        y: boxPos.y + this.currentOffsetY,
        width: this.config.grid.boxWidth,
        height: this.config.grid.boxHeight,
      };

      // Refresh content for interactive boxes
      if (box.isInteractive) {
        box.content = this.getGridBoxContent(box.index);
      }

      // Draw the box
      UniversalPanelRenderer.drawGridBox(
        ctx,
        boxPos.x,
        boxPos.y,
        this.config.grid.boxWidth,
        this.config.grid.boxHeight,
        box.content,
        box.isHovered,
        this.config.grid
      );
    });
  }

  drawUpgradeComponents(ctx, panelX, panelY) {
    // Placeholder for upgrade-specific rendering
    // Would integrate with your UpgradeButton components
  }

  drawDebugBorders(ctx, offsetX, offsetY) {
    if (!UNIVERSAL_PANEL_CONFIG.DEBUG.enabled) return;

    const panelPos = this.getScreenPosition(offsetX, offsetY);
    const hoverArea = this.calculateHoverArea();
    const targetPos = {
      x: this.target.x - offsetX,
      y: this.target.y - offsetY,
      width: this.target.width || this.target.garageWidth || 100,
      height: this.target.height || this.target.garageHeight || 100,
    };

    const hoverPos = {
      x: hoverArea.x - offsetX,
      y: hoverArea.y - offsetY,
      width: hoverArea.width,
      height: hoverArea.height,
    };

    UniversalPanelRenderer.drawDebugBorders(ctx, panelPos, hoverPos, targetPos);
  }

  // =============================================================================
  // UPDATE SYSTEM
  // =============================================================================
  update(deltaTime) {
    // Update components based on panel type
    switch (this.panelType) {
      case "garage":
        this.updateGarageComponents(deltaTime);
        break;
      case "factory":
        this.updateFactoryComponents(deltaTime);
        break;
    }
  }

  updateGarageComponents(deltaTime) {
    // Update grid content if needed
    if (this.components.grid) {
      this.components.grid.forEach((box) => {
        if (box.isInteractive) {
          // Refresh content to show current state
          box.content = this.getGridBoxContent(box.index);
        }
      });
    }
  }

  updateFactoryComponents(deltaTime) {
    // Placeholder for factory component updates
  }

  // =============================================================================
  // UTILITY METHODS
  // =============================================================================
  show() {
    this.showPanel = true;
  }

  hide() {
    this.showPanel = false;
    this.resetGridHoverStates();
  }

  isVisible() {
    return this.showPanel;
  }

  setTarget(newTarget) {
    this.target = newTarget;
  }

  updateConfig(newConfig) {
    this.config = this.mergeConfiguration(newConfig);
    if (this.panelType === "garage") {
      this.calculateGridPanelDimensions();
    }
  }

  // =============================================================================
  // LEGACY COMPATIBILITY METHODS
  // =============================================================================
  drawUI(ctx, offsetX, offsetY) {
    this.draw(ctx, offsetX, offsetY);
  }

  handleMouseMove(mouseX, mouseY) {
    return this.handleMouseMove(mouseX, mouseY);
  }

  // Method to get positioning object for FactoryManager compatibility
  get positioning() {
    return {
      isPointInHoverArea: (mouseX, mouseY, target) =>
        this.isPointInHoverArea(mouseX, mouseY),
      drawDebugBorders: (ctx, target, offsetX, offsetY) =>
        this.drawDebugBorders(ctx, offsetX, offsetY),
    };
  }
}

// =============================================================================
// FACTORY PANEL WRAPPER - Maintains compatibility with existing factory system
// =============================================================================
export class FactoryPanel extends UniversalPanel {
  constructor(factory, factoryType) {
    super(factory, "factory", {
      panelConfig: factory.panelConfig,
    });

    this.factory = factory;
    this.factoryType = factoryType;
  }

  // Override factory-specific methods
  isPointInHoverArea(mouseX, mouseY, factory = this.factory) {
    return super.isPointInHoverArea(mouseX, mouseY);
  }

  // Legacy compatibility properties
  get width() {
    return this.config.panelWidth;
  }
  get confirmationDialog() {
    return this.components.confirmDialog;
  }
}

// =============================================================================
// GARAGE UI WRAPPER - Maintains compatibility with existing garage system
// =============================================================================
export class GarageUI extends UniversalPanel {
  constructor(
    flakManager,
    garageX,
    garageY,
    garageWidth,
    garageHeight,
    customConfig = {}
  ) {
    const target = { flakManager, garageX, garageY, garageWidth, garageHeight };
    super(target, "garage", customConfig);

    this.flakManager = flakManager;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
  }

  // Override garage-specific behavior
  isGridBoxInteractive(index) {
    return index === 0; // Only first box is buildable in garage
  }
}

// =============================================================================
// USAGE EXAMPLES AND MIGRATION GUIDE
// =============================================================================

/*
// EXAMPLE 1: Replace existing FactoryPanel
// OLD:
// const factoryPanel = new IndividualFactoryPanel(factory, factoryType);

// NEW:
const factoryPanel = new FactoryPanel(factory, factoryType);
// OR
const factoryPanel = new UniversalPanel(factory, 'factory', {
  panelConfig: factory.panelConfig
});

// EXAMPLE 2: Replace existing GarageUI
// OLD:
// const garageUI = new GarageUI(flakManager, gx, gy, gw, gh);

// NEW:
const garageUI = new GarageUI(flakManager, gx, gy, gw, gh);
// OR
const garageUI = new UniversalPanel(
  { flakManager, garageX: gx, garageY: gy, garageWidth: gw, garageHeight: gh }, 
  'garage'
);

// EXAMPLE 3: Custom panel with different grid size
const customGarageUI = new UniversalPanel(target, 'garage', {
  grid: {
    rows: 6,           // Override: 6 rows instead of 8
    cols: 3,           // Override: 3 cols instead of 4  
    boxWidth: 80,      // Override: larger boxes
    boxHeight: 60,
    spacing: 5         // Override: more spacing
  },
  panel: {
    offsetY: 20        // Override: different panel position
  }
});

// EXAMPLE 4: Factory panel with custom hover area
const customFactoryPanel = new UniversalPanel(factory, 'factory', {
  hoverAreaX: 100,     // Override: extend hover area
  hoverAreaY: 50,
  hoverAreaWidth: 300, // Override: much wider hover area
  hoverAreaHeight: 80,
  panelOffsetY: -50    // Override: position panel higher
});
*/
