export class UniversalGridPanel {
  constructor(parentUI, gridConfig) {
    this.parentUI = parentUI;
    this.gridConfig = gridConfig;
    this.boxes = UniversalBoxsesFactory.createBoxes(parentUI, gridConfig);
  }

  draw(ctx, panelX, panelY) {
    this.boxes.forEach(box => box.draw(ctx, panelX, panelY));
  }

  updateHoverStates(mouseX, mouseY) {
    this.boxes.forEach(box => box.updateHoverState(mouseX, mouseY));
  }

  handleClick(mouseX, mouseY) {
    return this.boxes.some(box => box.handleClick(mouseX, mouseY));
  }
}
