import { Flak } from "../components/Flak.js";

export class FlakManager {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;

    this.flakScaleFactor = 1;
    this.currentFlakCount = 0;
    this.maxFlakCapacity = 50;

    this.building = false;
    this.buildTimer = 0;
    this.buildDuration = 1;

    this.flakRows = [
      { count: 8, zIndex: -89, rowOffsetY: -15, rowOffsetX: -60, spacing: 33 },
      { count: 7, zIndex: -90, rowOffsetY: -25, rowOffsetX: -50, spacing: 33 },
      { count: 6, zIndex: -91, rowOffsetY: -35, rowOffsetX: -30, spacing: 33 },
      { count: 4, zIndex: -92, rowOffsetY: -45, rowOffsetX: -10, spacing: 33 },
    ];

    this.pendingPositions = new Set();
    this.objects = [];

    this.initializeFirstFlaks();
  }

  // --------------- helpers ---------------
  totalCapacityForRow(i) {
    return (this.flakRows[i]?.count || 0) * 2;
  }

  getFlaksOnRow(rowIndex) {
    // number of flaks currently assigned to this row (0..capacity)
    let prev = 0;
    for (let i = 0; i < rowIndex; i++) prev += this.totalCapacityForRow(i);
    return Math.max(0, Math.min(this.currentFlakCount - prev, this.totalCapacityForRow(rowIndex)));
  }

  getLeftRightCounts(rowIndex) {
    const total = this.getFlaksOnRow(rowIndex);
    return { left: Math.ceil(total / 2), right: Math.floor(total / 2) };
  }

  getCurrentRowIndex() {
    let totalPrev = 0;
    for (let i = 0; i < this.flakRows.length; i++) {
      const cap = this.totalCapacityForRow(i);
      if (this.currentFlakCount <= totalPrev + cap) return i;
      totalPrev += cap;
    }
    return -1;
  }

  findRowWithSpace(startIndex = 0) {
    for (let i = Math.max(0, startIndex); i < this.flakRows.length; i++) {
      const { left, right } = this.getLeftRightCounts(i);
      const rowCount = this.flakRows[i].count;
      if (left < rowCount || right < rowCount) return i;
    }
    return -1;
  }

  scheduleAsyncPositioning(flak, getTargetX) {
    const id = Symbol("pos");
    this.pendingPositions.add(id);

    const attempt = () => {
      if (!this.pendingPositions.has(id)) return;
      if (flak.ready) {
        flak.x = getTargetX();
        this.pendingPositions.delete(id);
      } else {
        setTimeout(attempt, 10);
      }
    };
    setTimeout(attempt, 10);
  }

  createFlakAt(side, rowIndex) {
    const row = this.flakRows[rowIndex];
    const baseY = this.garageY + this.garageHeight + row.rowOffsetY;
    const f = new Flak(0, baseY, this.flakScaleFactor);
    f.zIndex = row.zIndex;
    f.type = "flak";

    const { left, right } = this.getLeftRightCounts(rowIndex);
    if (side === "left") {
      const indexOnSide = left + 1; // next left index
      this.scheduleAsyncPositioning(f, () =>
        this.garageX - row.rowOffsetX - indexOnSide * row.spacing
      );
    } else {
      const indexOnSide = right + 1; // next right index
      this.scheduleAsyncPositioning(f, () =>
        this.garageX + this.garageWidth + row.rowOffsetX + indexOnSide * row.spacing - f.width
      );
    }

    this.objects.push(f);
    this.currentFlakCount++;
    return f;
  }

  // --------------- initialization ---------------
  initializeFirstFlaks() {
    const firstRowIndex = 0;
    // left
    this.createFlakAt("left", firstRowIndex);
    // right (positioned asynchronously)
    this.createFlakAt("right", firstRowIndex);
    // ensure count matches original behaviour (createFlakAt increments)
  }

  // --------------- build flow ---------------
  startBuilding() {
    if (this.building || !this.canBuild()) return false;
    this.building = true;
    this.buildTimer = this.buildDuration;
    return true;
  }

  update(deltaTime) {
    if (!this.building) return false;
    const dtMs = (typeof deltaTime === "number" && deltaTime < 1) ? deltaTime * 1000 : deltaTime;
    this.buildTimer -= dtMs;
    if (this.buildTimer <= 0) {
      this.completeBuild();
      return true;
    }
    return false;
  }

  completeBuild() {
    this.building = false;
    this.buildTimer = 0;
    this.addNewFlak();
  }

  addNewFlak() {
    if (this.currentFlakCount >= this.maxFlakCapacity) return false;

    const suggestedRow = Math.max(0, this.getCurrentRowIndex());
    const rowIndex = this.findRowWithSpace(suggestedRow);
    if (rowIndex === -1) return false;

    const flaksOnRow = this.getFlaksOnRow(rowIndex);
    const { left: leftCount, right: rightCount } = this.getLeftRightCounts(rowIndex);

    // alternate by total on row but never exceed per-side limits
    let addLeft = flaksOnRow % 2 === 0;
    const rowLimit = this.flakRows[rowIndex].count;

    if (addLeft && leftCount >= rowLimit) addLeft = false;
    else if (!addLeft && rightCount >= rowLimit) addLeft = true;

    // if chosen side is still full, try the other; if still full, fail this row (shouldn't happen due to findRowWithSpace)
    if (addLeft && leftCount >= rowLimit) {
      if (rightCount < rowLimit) addLeft = false;
      else return false;
    } else if (!addLeft && rightCount >= rowLimit) {
      if (leftCount < rowLimit) addLeft = true;
      else return false;
    }

    this.createFlakAt(addLeft ? "left" : "right", rowIndex);
    return true;
  }

  cleanup() {
    this.pendingPositions.clear();
    this.objects = [];
  }

  // --------------- public getters / setters ---------------
  isBuilding() { return this.building; }
  getBuildProgress() {
    return this.building ? Math.min(1, Math.max(0, 1 - (this.buildTimer / this.buildDuration))) : 0;
  }
  getRemainingBuildTime() { return this.building ? Math.ceil(this.buildTimer / 1000) : 0; }
  canBuild() { return !this.building && this.currentFlakCount < this.maxFlakCapacity; }
  getMaxFlakCapacity() { return this.maxFlakCapacity; }

  getObjects() { return this.objects || []; }
  getAllFlaks() { return this.objects.filter(o => o?.type === "flak" || o?.constructor?.name === "Flak"); }
  getCurrentFlakCount() { return this.getAllFlaks().length; }
  getTotalFlakCount() { return this.currentFlakCount; }

  setFlakScale(scale) {
    const targetCount = this.currentFlakCount;
    this.flakScaleFactor = scale;
    this.cleanup();
    this.currentFlakCount = 0;
    this.initializeFirstFlaks();
    // add remaining flaks (start from 2 created above)
    while (this.currentFlakCount < targetCount) {
      if (!this.addNewFlak()) break;
    }
  }

  updateFlakRowConfig(index, newConfig) {
    if (index >= 0 && index < this.flakRows.length) {
      this.flakRows[index] = { ...this.flakRows[index], ...newConfig };
    }
  }
}
