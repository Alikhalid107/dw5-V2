// UniversalBoxsesFactory.js
import { UniversalBox } from "./UniversalBox.js";

export class UniversalBoxsesFactory {
  static createBoxes(parentUI, gridConfig) {
    const boxes = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        // If this is the last row and last column, skip creating that box
        if (row === gridConfig.rows - 1 && col === gridConfig.cols - 1) {
          continue;
        }
        boxes.push(new UniversalBox(parentUI, row, col, row * gridConfig.cols + col, gridConfig));
      }
    }
    return boxes;
  }
}
