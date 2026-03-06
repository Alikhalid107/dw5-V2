import { describe, it, expect, beforeEach } from 'vitest';
import { FlakBuildSystem } from '../src/sections/FlakBuildSystem.js';

describe('FlakBuildSystem', () => {
  let buildSystem;

  beforeEach(() => {
    buildSystem = new FlakBuildSystem();
    buildSystem.buildDuration = 5000;
    buildSystem.buildTimer = 0;
  });

  describe('initial state', () => {
    it('should not be building initially', () => {
      expect(buildSystem.isBuilding()).toBe(false);
      expect(buildSystem.building).toBe(false);
      expect(buildSystem.buildTimer).toBe(0);
    });

    it('should have zero progress initially', () => {
      expect(buildSystem.getBuildProgress()).toBe(0);
    });

    it('should have zero remaining time initially', () => {
      expect(buildSystem.getRemainingBuildTime()).toBe(0);
    });
  });

  describe('startBuilding', () => {
    it('should start building when callback returns true', () => {
      const started = buildSystem.startBuilding(() => true);
      expect(started).toBe(true);
      expect(buildSystem.isBuilding()).toBe(true);
    });

    it('should not start building when callback returns false', () => {
      const started = buildSystem.startBuilding(() => false);
      expect(started).toBe(false);
      expect(buildSystem.isBuilding()).toBe(false);
    });

    it('should not start if already building', () => {
      buildSystem.startBuilding(() => true);
      const startedAgain = buildSystem.startBuilding(() => true);
      expect(startedAgain).toBe(false);
    });

    it('should set build timer to build duration', () => {
      buildSystem.startBuilding(() => true);
      expect(buildSystem.buildTimer).toBe(buildSystem.buildDuration);
    });
  });

  describe('update', () => {
    it('should return false when not building', () => {
      const completed = buildSystem.update(100);
      expect(completed).toBe(false);
    });

    it('should decrease build timer', () => {
      buildSystem.startBuilding(() => true);
      const initial = buildSystem.buildTimer;
      buildSystem.update(1000);
      expect(buildSystem.buildTimer).toBe(initial - 1000);
    });

    it('should handle fractional deltaTime (seconds) by converting to ms', () => {
      buildSystem.startBuilding(() => true);
      const initial = buildSystem.buildTimer;
      buildSystem.update(0.5);
      expect(buildSystem.buildTimer).toBe(initial - 500);
    });

    it('should complete build when timer reaches zero', () => {
      buildSystem.startBuilding(() => true);
      const completed = buildSystem.update(buildSystem.buildDuration + 1);
      expect(completed).toBe(true);
      expect(buildSystem.isBuilding()).toBe(false);
      expect(buildSystem.buildTimer).toBe(0);
    });
  });

  describe('getBuildProgress', () => {
    it('should return 0 when not building', () => {
      expect(buildSystem.getBuildProgress()).toBe(0);
    });

    it('should return value between 0 and 1 during build', () => {
      buildSystem.startBuilding(() => true);
      buildSystem.update(buildSystem.buildDuration / 2);
      const progress = buildSystem.getBuildProgress();
      expect(progress).toBeGreaterThan(0);
      expect(progress).toBeLessThanOrEqual(1);
    });

    it('should return approximately 0.5 at halfway', () => {
      buildSystem.startBuilding(() => true);
      buildSystem.update(buildSystem.buildDuration / 2);
      expect(buildSystem.getBuildProgress()).toBeCloseTo(0.5, 1);
    });
  });

  describe('getRemainingBuildTime', () => {
    it('should return 0 when not building', () => {
      expect(buildSystem.getRemainingBuildTime()).toBe(0);
    });

    it('should return remaining seconds during build', () => {
      buildSystem.startBuilding(() => true);
      const remaining = buildSystem.getRemainingBuildTime();
      expect(remaining).toBeGreaterThan(0);
    });
  });

  describe('completeBuild', () => {
    it('should reset building state', () => {
      buildSystem.startBuilding(() => true);
      buildSystem.completeBuild();
      expect(buildSystem.isBuilding()).toBe(false);
      expect(buildSystem.buildTimer).toBe(0);
    });
  });
});
