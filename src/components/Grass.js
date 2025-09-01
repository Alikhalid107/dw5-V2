import { GameObject } from "../core/GameObject";

export class Grass {
  constructor(worldWidth, worldHeight) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.objects = [];
    this.setupGrassTiling();
  }

  setupGrassTiling() {
    const tileW = 1200;
    const tileH = 400;

    const grassFiles = [
      "../public/map0.jpg",
      "../public/map1.jpg",
      "../public/map2.jpg",
      "../public/map3.jpg",
      "../public/map4.jpg",
      "../public/map5.jpg",
      "../public/map6.jpg",
    ];

    const cols = Math.ceil(this.worldWidth / tileW);
    const rows = Math.ceil(this.worldHeight / tileH);

    let idx = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const src = grassFiles[idx % grassFiles.length];
        idx++;

        this.objects.push(
          new GameObject(
            x * tileW,
            y * tileH,
            tileW,
            tileH,
            -100,
            src
          )
        );
      }
    }
  }

  getObjects() {
    return this.objects;
  }
}