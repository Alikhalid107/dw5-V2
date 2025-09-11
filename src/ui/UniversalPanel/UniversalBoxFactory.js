import { UniversalBox } from "./UniversalBox.js";

export class UniversalBoxFactory {
  static createBoxes(panelUI, gridConfig, panelType, textConfig, styling) {
    const boxes = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        const index = row * gridConfig.cols + col;
        boxes.push(new UniversalBox(
          panelUI, row, col, index, panelType, textConfig, styling
        ));
      }
    }
    return boxes;
  }
}
