import { UniversalBox } from "./UniversalBox";
export class UniversalBoxsesFactory {
  static createBoxes(parentUI, gridConfig) {
    const boxes = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        boxes.push(new UniversalBox(parentUI, row, col, row * gridConfig.cols + col, gridConfig));
      }
    }
    return boxes;
  }
}