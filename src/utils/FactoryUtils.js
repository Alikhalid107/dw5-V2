// src/utils/FactoryUtils.js
import { MessageBus } from "./MessageBus.js";

export class FactoryUtils {

  // Single entry point: handle factory UI click based on boxIndex
  static handleFactoryClick(context) {
    if (!context || !context.factory) return false;

    switch (context.boxIndex) {
      case 0:
        // Upgrade box: return whether upgrade action is allowed.
        // Note: upgrade performs the action silently (no success message).
        return this.handleUpgrade(context.factory);

      case 1:
        return this.handleProductionClick(context.factory, 1);

      case 2:
        return this.handleProductionClick(context.factory, 15);

      default:
        return false;
    }
  }

  // Upgrade: silent on success (as requested). Returns true if upgrade happened, false otherwise.
  static handleUpgrade(factory) {
    if (!factory) return false;

    if (factory.isMaxLevel && factory.isMaxLevel()) {
      // don't publish any message (silently fail)
      return false;
    }
    if (factory.upgrading) {
      // already upgrading — silent
      return false;
    }

    // perform upgrade (existing behavior)
    factory.level++;
    factory.updateVisuals?.();
    factory.updateSprite?.();
    return true;
  }

  static isFactoryAtMaxProduction(factory) {
    const maxProductionTimeMs = 15 * 60 * 60 * 1000;
    
    if (factory.productionTimeRemaining !== undefined) {
      return factory.productionTimeRemaining >= maxProductionTimeMs;
    }
    if (factory.canStart15HourProduction) {
      return !factory.canStart15HourProduction();
    }
    if (factory.totalProductionTime !== undefined) {
      return factory.totalProductionTime >= maxProductionTimeMs;
    }
    if (factory.initialProductionTime !== undefined) {
      return factory.initialProductionTime >= 15;
    }
    
    return false;
  }

  static getMaxProductionTimeMs() {
    return 15 * 60 * 60 * 1000;
  }

  // Production handler: uses MessageBus.publish to show messages instead of callback drilling.
  static handleProductionClick(factory, hours) {
    if (!factory) return false;

    if (factory.isProducing) {
      if (hours === 15) {
        MessageBus.publish("Cannot start 15hr production while active");
        return true;
      } else {
        const isAtMaxProduction = this.isFactoryAtMaxProduction(factory);
        if (isAtMaxProduction) {
          MessageBus.publish("Cannot add more time - already at 15 hour limit");
          return true;
        }
        
        const wasCapped1h = factory.startProduction(1);
        if (wasCapped1h) {
          MessageBus.publish("Capped at 15 hours");
        }
        return true;
      }
    } else {
      const wasCapped = factory.startProduction(hours);
      if (wasCapped) {
        MessageBus.publish("Capped at 15 hours");
      }
      return true;
    }
  }
}
