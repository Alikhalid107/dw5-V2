// UniversalBoxesFactory.js
import { UniversalBox } from "./UniversalBox.js";

export class UniversalBoxesFactory {
  static createBoxes(parentUI, gridConfig, options = {}) {
    const boxes = [];
    let totalBoxes;

    // Prefer explicit options
    if (options.totalBoxes !== undefined) {
      totalBoxes = options.totalBoxes;
    } else {
      totalBoxes = gridConfig.rows * gridConfig.cols;
    }

    for (let i = 0; i < totalBoxes; i++) {
      const row = Math.floor(i / gridConfig.cols);
      const col = i % gridConfig.cols;

      // Allow panels to tell us if they want to skip last box
      if (options.skipLast &&
          row === gridConfig.rows - 1 &&
          col === gridConfig.cols - 1) {
        continue;
      }

      boxes.push(new UniversalBox(parentUI, row, col, i, gridConfig));
    }

    return boxes;
  }
}
