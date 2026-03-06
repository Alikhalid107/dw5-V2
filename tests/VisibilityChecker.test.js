import { describe, it, expect } from 'vitest';
import { VisibilityChecker } from '../src/core/GameObjectSystem/VisibilityChecker.js';

describe('VisibilityChecker', () => {
  const viewW = 800;
  const viewH = 600;

  describe('isVisible', () => {
    it('should return false when visible flag is false', () => {
      expect(VisibilityChecker.isVisible(100, 100, 50, 50, 0, 0, viewW, viewH, false)).toBe(false);
    });

    it('should return true for object fully inside viewport', () => {
      expect(VisibilityChecker.isVisible(100, 100, 50, 50, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should return true for object partially visible on left edge', () => {
      expect(VisibilityChecker.isVisible(-25, 100, 50, 50, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should return true for object partially visible on top edge', () => {
      expect(VisibilityChecker.isVisible(100, -25, 50, 50, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should return true for object partially visible on right edge', () => {
      expect(VisibilityChecker.isVisible(780, 100, 50, 50, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should return true for object partially visible on bottom edge', () => {
      expect(VisibilityChecker.isVisible(100, 580, 50, 50, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should return false for object completely off-screen to the left', () => {
      expect(VisibilityChecker.isVisible(-100, 100, 50, 50, 0, 0, viewW, viewH, true)).toBe(false);
    });

    it('should return false for object completely off-screen to the right', () => {
      expect(VisibilityChecker.isVisible(900, 100, 50, 50, 0, 0, viewW, viewH, true)).toBe(false);
    });

    it('should return false for object completely off-screen above', () => {
      expect(VisibilityChecker.isVisible(100, -100, 50, 50, 0, 0, viewW, viewH, true)).toBe(false);
    });

    it('should return false for object completely off-screen below', () => {
      expect(VisibilityChecker.isVisible(100, 700, 50, 50, 0, 0, viewW, viewH, true)).toBe(false);
    });

    it('should account for camera offset', () => {
      expect(VisibilityChecker.isVisible(500, 300, 50, 50, 500, 300, viewW, viewH, true)).toBe(true);
      expect(VisibilityChecker.isVisible(100, 100, 50, 50, 500, 500, viewW, viewH, true)).toBe(false);
    });

    it('should handle object larger than viewport', () => {
      expect(VisibilityChecker.isVisible(-100, -100, 2000, 2000, 0, 0, viewW, viewH, true)).toBe(true);
    });

    it('should handle zero-size objects at viewport boundary', () => {
      expect(VisibilityChecker.isVisible(0, 0, 0, 0, 0, 0, viewW, viewH, true)).toBe(false);
    });

    it('should return true for object exactly at origin with size', () => {
      expect(VisibilityChecker.isVisible(0, 0, 1, 1, 0, 0, viewW, viewH, true)).toBe(true);
    });
  });
});
