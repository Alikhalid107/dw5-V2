export class UIManager {
  constructor() {
    this.uiComponents = [];
  }
  
  registerUI(uiComponent) {
    this.uiComponents.push(uiComponent);
  }
  
  drawUI(ctx, offsetX, offsetY) {
    this.uiComponents.forEach(component => {
      if (component.drawUI) component.drawUI(ctx, offsetX, offsetY);
    });
  }
}