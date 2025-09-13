import { GarageBox } from "./GarageBox.js";
// BoxFactory.js
export class BoxFactory {
  static createBoxes(garageUI, gridConfig) {
    const boxes = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      for (let col = 0; col < gridConfig.cols; col++) {
        boxes.push(new GarageBox(garageUI, row, col, row * gridConfig.cols + col));
      }
    }
    return boxes;
  }
}
