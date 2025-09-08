import { FACTORY_PANEL_CONFIG } from '../config/FactoryPanelConfig.js';

export class FactoryPanelPositioning {
  constructor(panelConfig) {
    this.panelWidth = panelConfig?.panelWidth || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelWidth;
    this.panelHeight = (panelConfig?.panelHeight || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelHeight) + 45;
    this.panelOffsetX = panelConfig?.panelOffsetX || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelOffsetX;
    this.panelOffsetY = panelConfig?.panelOffsetY || FACTORY_PANEL_CONFIG.LAYOUT.defaultPanelOffsetY;
  }

  calculatePanelPosition(factory) {
    const factoryCenterX = factory.x + factory.width / 2;
    return {
      x: factoryCenterX + this.panelOffsetX - this.panelWidth / 2,
      y: factory.y + this.panelOffsetY,
    };
  }

  getScreenPosition(factory, offsetX = 0, offsetY = 0) {
    const pos = this.calculatePanelPosition(factory);
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;
    
    return { x, y, isValid: isFinite(x) && isFinite(y) };
  }

  getComponentPosition(componentName, panelX, panelY) {
    const componentPos = FACTORY_PANEL_CONFIG.COMPONENT_POSITIONS[componentName];
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