import { FLAK_CONFIG } from '../config/FlakConfig.js';

export class FlakPositioning {
  constructor(garageX, garageY, garageWidth, garageHeight) {
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.pendingPositions = new Set();
  }

  // ---------- capacity calculations ----------
  totalCapacityForRow(rowIndex) { 
    return (FLAK_CONFIG.ROWS[rowIndex]?.count || 0) * 2; 
  }

  getFlaksOnRow(rowIndex, currentFlakCount) {
    let prev = 0;
    for (let i = 0; i < rowIndex; i++) prev += this.totalCapacityForRow(i);
    return Math.max(0, Math.min(currentFlakCount - prev, this.totalCapacityForRow(rowIndex)));
  }

  getLeftRightCounts(rowIndex, currentFlakCount) {
    const total = this.getFlaksOnRow(rowIndex, currentFlakCount);
    return { left: Math.ceil(total / 2), right: Math.floor(total / 2) };
  }

  getCurrentRowIndex(currentFlakCount) {
    let totalPrev = 0;
    for (let i = 0; i < FLAK_CONFIG.ROWS.length; i++) {
      const cap = this.totalCapacityForRow(i);
      if (currentFlakCount <= totalPrev + cap) return i;
      totalPrev += cap;
    }
    return -1;
  }

  findRowWithSpace(currentFlakCount, startIndex = 0) {
    for (let i = Math.max(0, startIndex); i < FLAK_CONFIG.ROWS.length; i++) {
      const { left, right } = this.getLeftRightCounts(i, currentFlakCount);
      const rowCount = FLAK_CONFIG.ROWS[i].count;
      if (left < rowCount || right < rowCount) return i;
    }
    return -1;
  }

  // ---------- positioning ----------
  scheduleAsyncPositioning(flak, getTargetX) {
    const id = Symbol("pos");
    this.pendingPositions.add(id);

    const attempt = () => {
      if (!this.pendingPositions.has(id)) return;
      if (flak.ready) {
        let x = getTargetX();

        // clamp to a sane range (defensive: prevents huge out-of-map values)
        const leftClamp = this.garageX - FLAK_CONFIG.POSITIONING.CLAMP_OFFSET;
        const rightClamp = this.garageX + this.garageWidth + FLAK_CONFIG.POSITIONING.CLAMP_OFFSET;
        if (x < leftClamp) x = leftClamp;
        if (x > rightClamp) x = rightClamp;

        flak.x = x;
        this.pendingPositions.delete(id);
      } else {
        setTimeout(attempt, FLAK_CONFIG.POSITIONING.POSITIONING_RETRY_DELAY);
      }
    };

    setTimeout(attempt, FLAK_CONFIG.POSITIONING.POSITIONING_RETRY_DELAY);
  }

  calculateFlakPosition(side, rowIndex, currentFlakCount, flakWidth = 0) {
  const row = FLAK_CONFIG.ROWS[rowIndex];
  const baseY = this.garageY + this.garageHeight + row.rowOffsetY;
  const { left, right } = this.getLeftRightCounts(rowIndex, currentFlakCount);

  let getTargetX;
  if (side === "left") {
    const indexOnSide = left + 1;
    getTargetX = () =>
      this.garageX - row.rowOffsetX - indexOnSide * row.spacing;
  } else {
    // Use rowOffsetXRight if defined, otherwise fall back to rowOffsetX
    const rightOffset = row.rowOffsetXRight !== undefined ? row.rowOffsetXRight : row.rowOffsetX;
    const indexOnSide = right + 1;
    getTargetX = () =>
      this.garageX + this.garageWidth + rightOffset + (indexOnSide - 1) * row.spacing - flakWidth;
  }

  return { baseY, getTargetX, zIndex: row.zIndex };
}


  determineSideForNewFlak(rowIndex, currentFlakCount) {
    const flaksOnRow = this.getFlaksOnRow(rowIndex, currentFlakCount);
    const { left: leftCount, right: rightCount } = this.getLeftRightCounts(rowIndex, currentFlakCount);
    let addLeft = flaksOnRow % 2 === 0;
    const rowLimit = FLAK_CONFIG.ROWS[rowIndex].count;

    if (addLeft && leftCount >= rowLimit) addLeft = false;
    else if (!addLeft && rightCount >= rowLimit) addLeft = true;

    if (addLeft && leftCount >= rowLimit) {
      if (rightCount < rowLimit) addLeft = false;
      else return null; // No space
    } else if (!addLeft && rightCount >= rowLimit) {
      if (leftCount < rowLimit) addLeft = true;
      else return null; // No space
    }

    return addLeft ? "left" : "right";
  }

  cleanup() {
    this.pendingPositions.clear();
  }
}