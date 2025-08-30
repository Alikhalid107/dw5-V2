import { Flak } from "../components/Flak.js";

export class FlakManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;

    this.flakScaleFactor = 1;
    this.enableMultipleFlakRows = true;

    this.flakRows = [
      { count: 8, zIndex: -89, rowOffsetY: -15, rowOffsetX: -60, spacing: 35 },
      { count: 7, zIndex: -90, rowOffsetY: -25, rowOffsetX: -50, spacing: 35 },
      { count: 6, zIndex: -91, rowOffsetY: -35, rowOffsetX: -30, spacing: 35 },
      { count: 4, zIndex: -92, rowOffsetY: -45, rowOffsetX: -10, spacing: 35 },
    ];

    this.objects = this.createFlaks();
  }

  createFlaks() {
    const objects = [];

    if (this.enableMultipleFlakRows) {
      this.flakRows.forEach((row, idx) =>
        this.createFlakRow(objects, row)
      );
    } else {
      this.createSingleRow(objects);
    }

    return objects;
  }

  createSingleRow(objects) {
    // Just reused from your original single flak setup
  }

  createFlakRow(objects, { count, zIndex, rowOffsetY, rowOffsetX, spacing }) {
    const baseY = this.garageY + this.garageHeight + rowOffsetY;

    // Left side
    for (let i = 0; i < count; i++) {
      const flakX = this.garageX - rowOffsetX - ((i + 1) * spacing);
      const flak = new Flak(flakX, baseY, this.flakScaleFactor);
      flak.zIndex = zIndex;
      objects.push(flak);
    }

    // Right side (same async placement trick as your code)
    for (let i = 0; i < count; i++) {
      const flak = new Flak(0, baseY, this.flakScaleFactor);
      flak.zIndex = zIndex;

      const position = () => {
        if (flak.ready) {
          flak.x = this.garageX + this.garageWidth + rowOffsetX + ((i + 1) * spacing) - flak.width;
        } else {
          setTimeout(position, 10);
        }
      };

      setTimeout(position, 10);
      objects.push(flak);
    }
  }

  // --- helpers ---
  getObjects() { return this.objects; }
  setFlakScale(scale) { this.flakScaleFactor = scale; }
  getAllFlaks() { return this.objects.filter(o => o instanceof Flak); }
  getTotalFlakCount() {
    return this.enableMultipleFlakRows
      ? this.flakRows.reduce((t, r) => t + r.count * 2, 0)
      : 2;
  }
  updateFlakRowConfig(idx, cfg) { this.flakRows[idx] = { ...this.flakRows[idx], ...cfg }; }
  toggleFlakRows() { this.enableMultipleFlakRows = !this.enableMultipleFlakRows; }
}
