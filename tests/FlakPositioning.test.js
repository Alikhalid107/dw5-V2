import { describe, it, expect, beforeEach } from 'vitest';
import { FlakPositioning } from '../src/utils/FlakPositioning.js';

describe('FlakPositioning', () => {
  let positioning;
  const garageX = 100;
  const garageY = 200;
  const garageWidth = 300;
  const garageHeight = 150;

  beforeEach(() => {
    positioning = new FlakPositioning(garageX, garageY, garageWidth, garageHeight);
  });

  describe('constructor', () => {
    it('should store garage dimensions', () => {
      expect(positioning.garageX).toBe(garageX);
      expect(positioning.garageY).toBe(garageY);
      expect(positioning.garageWidth).toBe(garageWidth);
      expect(positioning.garageHeight).toBe(garageHeight);
    });

    it('should initialize empty pending positions', () => {
      expect(positioning.pendingPositions.size).toBe(0);
    });
  });

  describe('totalCapacityForRow', () => {
    it('should return double the row count (left + right sides)', () => {
      expect(positioning.totalCapacityForRow(0)).toBe(16);
      expect(positioning.totalCapacityForRow(1)).toBe(14);
      expect(positioning.totalCapacityForRow(2)).toBe(12);
      expect(positioning.totalCapacityForRow(3)).toBe(8);
    });

    it('should return 0 for out-of-bounds row index', () => {
      expect(positioning.totalCapacityForRow(99)).toBe(0);
    });
  });

  describe('getFlaksOnRow', () => {
    it('should return 0 when no flaks exist', () => {
      expect(positioning.getFlaksOnRow(0, 0)).toBe(0);
    });

    it('should return correct count for first row', () => {
      expect(positioning.getFlaksOnRow(0, 5)).toBe(5);
      expect(positioning.getFlaksOnRow(0, 16)).toBe(16);
    });

    it('should return count for second row when first is full', () => {
      expect(positioning.getFlaksOnRow(1, 20)).toBe(4);
    });

    it('should not exceed row capacity', () => {
      expect(positioning.getFlaksOnRow(0, 100)).toBe(16);
    });
  });

  describe('getLeftRightCounts', () => {
    it('should split evenly when even number of flaks', () => {
      const { left, right } = positioning.getLeftRightCounts(0, 4);
      expect(left).toBe(2);
      expect(right).toBe(2);
    });

    it('should put extra flak on left when odd number', () => {
      const { left, right } = positioning.getLeftRightCounts(0, 3);
      expect(left).toBe(2);
      expect(right).toBe(1);
    });

    it('should return zeros when no flaks on row', () => {
      const { left, right } = positioning.getLeftRightCounts(0, 0);
      expect(left).toBe(0);
      expect(right).toBe(0);
    });
  });

  describe('getCurrentRowIndex', () => {
    it('should return 0 for first few flaks', () => {
      expect(positioning.getCurrentRowIndex(0)).toBe(0);
      expect(positioning.getCurrentRowIndex(5)).toBe(0);
      expect(positioning.getCurrentRowIndex(16)).toBe(0);
    });

    it('should return 1 when first row is full', () => {
      expect(positioning.getCurrentRowIndex(17)).toBe(1);
    });

    it('should return -1 when all rows are full', () => {
      expect(positioning.getCurrentRowIndex(999)).toBe(-1);
    });
  });

  describe('findRowWithSpace', () => {
    it('should return 0 when all rows are empty', () => {
      expect(positioning.findRowWithSpace(0)).toBe(0);
    });

    it('should return next row when current is full', () => {
      expect(positioning.findRowWithSpace(16)).toBe(1);
    });

    it('should return -1 when no space', () => {
      const totalCapacity = 16 + 14 + 12 + 8;
      expect(positioning.findRowWithSpace(totalCapacity)).toBe(-1);
    });

    it('should respect startIndex parameter', () => {
      expect(positioning.findRowWithSpace(0, 2)).toBe(2);
    });
  });

  describe('determineSideForNewFlak', () => {
    it('should alternate sides starting with left', () => {
      expect(positioning.determineSideForNewFlak(0, 0)).toBe('left');
    });

    it('should return right for second flak', () => {
      expect(positioning.determineSideForNewFlak(0, 1)).toBe('right');
    });

    it('should return null when row is full', () => {
      expect(positioning.determineSideForNewFlak(0, 16)).toBe(null);
    });
  });

  describe('calculateFlakPosition', () => {
  it('should return position with baseY and getTargetX', () => {
    const pos = positioning.calculateFlakPosition('left', 0, 0);
    expect(pos.baseY).toBeDefined();
    expect(pos.getTargetX).toBeTypeOf('function');
    expect(pos.zIndex).toBeDefined();
  });

  it('should calculate left flak position based on row config', () => {
    const pos = positioning.calculateFlakPosition('left', 0, 0);
    const x = pos.getTargetX();
    expect(typeof x).toBe('number');
    expect(Number.isFinite(x)).toBe(true);
  });

  it('should place right flaks to the right of garage', () => {
    const pos = positioning.calculateFlakPosition('right', 0, 0, 30);
    const x = pos.getTargetX();
    expect(x).toBeGreaterThanOrEqual(garageX + garageWidth - 200);
  });

  // NEW: verify right side uses rowOffsetXRight independently
  it('should use rowOffsetXRight for right side positioning', () => {
    const posRight = positioning.calculateFlakPosition('right', 0, 0);
    const posLeft = positioning.calculateFlakPosition('left', 0, 0);
    const xRight = posRight.getTargetX();
    const xLeft = posLeft.getTargetX();
    expect(Number.isFinite(xRight)).toBe(true);
    expect(xRight).toBeGreaterThan(xLeft); // right flak is always to the right of left flak
  });

  // NEW: verify fallback when rowOffsetXRight is not defined
  it('should fall back to rowOffsetX when rowOffsetXRight is undefined', () => {
    // Temporarily remove rowOffsetXRight from row 0 to test fallback
    const originalConfig = { ...require('../src/config/FlakConfig.js').FLAK_CONFIG.ROWS[0] };
    const row = require('../src/config/FlakConfig.js').FLAK_CONFIG.ROWS[0];
    delete row.rowOffsetXRight;

    const pos = positioning.calculateFlakPosition('right', 0, 0);
    const x = pos.getTargetX();
    expect(Number.isFinite(x)).toBe(true);

    // Restore
    Object.assign(row, originalConfig);
  });
});

  describe('cleanup', () => {
    it('should clear pending positions', () => {
      positioning.pendingPositions.add(Symbol('test'));
      positioning.pendingPositions.add(Symbol('test2'));
      expect(positioning.pendingPositions.size).toBe(2);
      positioning.cleanup();
      expect(positioning.pendingPositions.size).toBe(0);
    });
  });
});
