import { FACTORY_PANEL_CONFIG } from '../config/FactoryPanelConfig.js';

export class FactoryPanelPositioning {
  constructor(panelConfig) {
    this.panelWidth = panelConfig?.panelWidth || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelWidth;
    this.panelHeight = (panelConfig?.panelHeight || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelHeight) ; // Reduced from +45 to +30
    this.panelOffsetX = panelConfig?.panelOffsetX || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelOffsetX;
    this.panelOffsetY = panelConfig?.panelOffsetY || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelOffsetY;
    
    // Store hover area settings
    this.hoverAreaX = panelConfig?.hoverAreaX || 0;
    this.hoverAreaY = panelConfig?.hoverAreaY || 0;
    this.hoverAreaWidth = panelConfig?.hoverAreaWidth || this.panelWidth;
    this.hoverAreaHeight = panelConfig?.hoverAreaHeight || this.panelHeight;
    
    // Debug mode for visual borders
    this.debugMode = FACTORY_PANEL_CONFIG.DEBUG.enabled || false;

    this.calculateComponentPositions();
  }


    calculateComponentPositions() {
  const { panelPadding, componentSpacing } = FACTORY_PANEL_CONFIG.COMPONENT_SPACING;
  const { 
    upgradeButtonWidth, 
    productionButtonsWidth, 
    factoryInfoWidth 
  } = FACTORY_PANEL_CONFIG.COMPONENT_SIZES;
  
  // Get positioning config (with defaults if not defined)
  const positioningConfig = FACTORY_PANEL_CONFIG.COMPONENT_POSITIONING || {};
  const buttonsOffsetX = positioningConfig.buttonsOffsetX || 0;
  const buttonsOffsetY = positioningConfig.buttonsOffsetY || 0;
  const centerVertically = positioningConfig.centerVertically !== false; // Default to true
  
  // Calculate total width needed for components
  const totalComponentsWidth = upgradeButtonWidth + productionButtonsWidth + factoryInfoWidth + 
                              (componentSpacing * 2);
  
  // Center components horizontally within the panel (with offset)
  const startX = panelPadding + buttonsOffsetX;
  
  // Calculate Y position
  let componentY;
  if (centerVertically) {
    // Original centering logic
    componentY = (this.panelHeight - FACTORY_PANEL_CONFIG.COMPONENT_SIZES.upgradeButtonHeight) / 2;
  } else {
    // Use custom offset from top of panel
    componentY = panelPadding + buttonsOffsetY;
  }
  
  // Calculate X positions for each component
  this.componentPositions = {
    upgradeButton: { 
      x: startX, 
      y: componentY 
    },
    productionButtons: { 
      x: startX + upgradeButtonWidth + componentSpacing, 
      y: componentY 
    },
    factoryInfo: { 
      x: startX + upgradeButtonWidth + productionButtonsWidth + (componentSpacing * 2), 
      y: componentY 
    }
  };
}


  calculatePanelPosition(factory) {
    const factoryCenterX = factory.x + factory.width / 2;
    return {
      x: factoryCenterX + this.panelOffsetX - this.panelWidth / 2,
      y: factory.y + this.panelOffsetY,
    };
  }

  calculateHoverArea(factory) {
    return {
      x: factory.x + this.hoverAreaX,
      y: factory.y + this.hoverAreaY,
      width: this.hoverAreaWidth,
      height: this.hoverAreaHeight
    };
  }

  getScreenPosition(factory, offsetX = 0, offsetY = 0) {
    const pos = this.calculatePanelPosition(factory);
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;
    
    return { x, y, isValid: isFinite(x) && isFinite(y) };
  }

  getHoverScreenPosition(factory, offsetX = 0, offsetY = 0) {
    const hover = this.calculateHoverArea(factory);
    return {
      x: hover.x - offsetX,
      y: hover.y - offsetY,
      width: hover.width,
      height: hover.height
    };
  }

 getComponentPosition(componentName, panelX, panelY) {
    const componentPos = this.componentPositions[componentName];
    if (!componentPos) return { x: panelX, y: panelY };
    
    return {
      x: panelX + componentPos.x,
      y: panelY + componentPos.y
    };
  }


  convertToRelativeCoordinates(mouseX, mouseY, offsetX, offsetY) {
    return {
      x: mouseX - offsetX,
      y: mouseY - offsetY
    };
  }

  // Unified hover detection - ONLY RED ZONE
  isPointInHoverArea(mouseX, mouseY, factory) {
    // ONLY check hover area (red zone) - ignore factory bounds (green zone)
    const hoverArea = this.calculateHoverArea(factory);
    return mouseX >= hoverArea.x && 
           mouseX <= hoverArea.x + hoverArea.width && 
           mouseY >= hoverArea.y && 
           mouseY <= hoverArea.y + hoverArea.height;
  }
  
  // Optional: Keep factory bounds check as separate method if needed elsewhere
  isPointInFactoryBounds(mouseX, mouseY, factory) {
    return factory.isPointInside(mouseX, mouseY);
  }

  // Debug drawing for visual feedback
  drawDebugBorders(ctx, factory, offsetX = 0, offsetY = 0) {
    if (!this.debugMode) return;
    
    const panelPos = this.getScreenPosition(factory, offsetX, offsetY);
    const hoverPos = this.getHoverScreenPosition(factory, offsetX, offsetY);
    
    if (!panelPos.isValid) return;
    
    // Save context
    ctx.save();
    
    // Draw hover area (red border)
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(hoverPos.x, hoverPos.y, hoverPos.width, hoverPos.height);
    
    // Draw panel area (blue border)
    ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.strokeRect(panelPos.x, panelPos.y, this.panelWidth, this.panelHeight);
    
    // Draw factory bounds (green border)
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(factory.x - offsetX, factory.y - offsetY, factory.width, factory.height);
    
    // Draw labels
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('HOVER', hoverPos.x + 5, hoverPos.y + 15);
    ctx.fillText('PANEL', panelPos.x + 5, panelPos.y + 15);
    ctx.fillText('FACTORY', factory.x - offsetX + 5, factory.y - offsetY + 15);
    
    // Restore context
    ctx.restore();
  }

  // Bounds helper
  createBounds(x, y, width, height) {
    return { x, y, width, height };
  }

  isPointInBounds(x, y, bounds) {
    if (!bounds) return false;
    return x >= bounds.x && x <= bounds.x + bounds.width && 
           y >= bounds.y && y <= bounds.y + bounds.height;
  }
}