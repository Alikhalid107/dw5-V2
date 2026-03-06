import { describe, it, expect, beforeEach } from 'vitest';
import { FactoryProductionSystem } from '../src/sections/Factory/FactoryProductionSystem.js';

describe('FactoryProductionSystem', () => {
  let production;

  beforeEach(() => {
    production = new FactoryProductionSystem();
  });

  describe('initial state', () => {
    it('should not be producing initially', () => {
      expect(production.isProducing).toBe(false);
      expect(production.productionTimeRemaining).toBe(0);
      expect(production.showProductionComplete).toBe(false);
    });

    it('should have a max production time of 15 hours', () => {
      expect(production.maxProductionTime).toBe(15 * 60 * 60 * 1000);
    });
  });

  describe('startProduction', () => {
    it('should start production with correct time in ms', () => {
      production.startProduction(1);
      expect(production.isProducing).toBe(true);
      expect(production.productionTimeRemaining).toBe(1 * 60 * 60 * 1000);
    });

    it('should start 15-hour production', () => {
      production.startProduction(15);
      expect(production.isProducing).toBe(true);
      expect(production.productionTimeRemaining).toBe(15 * 60 * 60 * 1000);
    });

    it('should add time when already producing', () => {
      production.startProduction(1);
      production.startProduction(1);
      expect(production.productionTimeRemaining).toBe(2 * 60 * 60 * 1000);
    });

    it('should cap time at 15 hours and return true when capped', () => {
      production.startProduction(10);
      const wasCapped = production.startProduction(10);
      expect(wasCapped).toBe(true);
      expect(production.productionTimeRemaining).toBe(15 * 60 * 60 * 1000);
    });

    it('should return false when not capped', () => {
      const wasCapped = production.startProduction(1);
      expect(wasCapped).toBe(false);
    });
  });

  describe('canStart15HourProduction', () => {
    it('should allow 15hr when not producing', () => {
      expect(production.canStart15HourProduction()).toBe(true);
    });

    it('should disallow 15hr when already producing', () => {
      production.startProduction(1);
      expect(production.canStart15HourProduction()).toBe(false);
    });
  });

  describe('update', () => {
    it('should decrease remaining time', () => {
      production.startProduction(1);
      const initial = production.productionTimeRemaining;
      production.update(1000);
      expect(production.productionTimeRemaining).toBe(initial - 1000);
    });

    it('should not go below zero', () => {
      production.startProduction(1);
      production.update(999999999);
      expect(production.productionTimeRemaining).toBe(0);
    });

    it('should complete production when timer reaches zero', () => {
      production.startProduction(1);
      production.update(1 * 60 * 60 * 1000 - 1);
      expect(production.isProducing).toBe(true);
      production.update(2);
      expect(production.isProducing).toBe(false);
      expect(production.showProductionComplete).toBe(true);
    });

    it('should clear production complete flag after 2 seconds', () => {
      production.startProduction(1);
      production.update(1 * 60 * 60 * 1000 - 1);
      production.update(2);
      expect(production.showProductionComplete).toBe(true);
      production.update(1997);
      expect(production.showProductionComplete).toBe(true);
      production.update(1);
      expect(production.showProductionComplete).toBe(false);
    });

    it('should not change time when not producing', () => {
      production.update(5000);
      expect(production.productionTimeRemaining).toBe(0);
      expect(production.isProducing).toBe(false);
    });
  });

  describe('cancelProduction', () => {
    it('should reset all production state', () => {
      production.startProduction(5);
      production.cancelProduction();
      expect(production.isProducing).toBe(false);
      expect(production.productionTimeRemaining).toBe(0);
      expect(production.showProductionComplete).toBe(false);
      expect(production.productionCompleteTimer).toBe(0);
    });
  });

  describe('completeProduction', () => {
    it('should set showProductionComplete and stop producing', () => {
      production.startProduction(1);
      production.completeProduction();
      expect(production.isProducing).toBe(false);
      expect(production.productionTimeRemaining).toBe(0);
      expect(production.showProductionComplete).toBe(true);
    });
  });

  describe('getFormattedProductionTime', () => {
    it('should return empty string when not producing', () => {
      expect(production.getFormattedProductionTime()).toBe('');
    });

    it('should format hours correctly', () => {
      production.startProduction(2);
      const formatted = production.getFormattedProductionTime();
      expect(formatted).toBe('02:00:00');
    });

    it('should format minutes/seconds without hours prefix', () => {
      production.isProducing = true;
      production.productionTimeRemaining = 5 * 60 * 1000 + 30 * 1000;
      const formatted = production.getFormattedProductionTime();
      expect(formatted).toBe('05:30');
    });

    it('should pad single digit values', () => {
      production.isProducing = true;
      production.productionTimeRemaining = 1 * 60 * 60 * 1000 + 5 * 60 * 1000 + 3 * 1000;
      const formatted = production.getFormattedProductionTime();
      expect(formatted).toBe('01:05:03');
    });
  });
});
