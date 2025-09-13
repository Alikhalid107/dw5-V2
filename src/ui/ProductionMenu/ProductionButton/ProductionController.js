// ProductionController.js - Updated with config support
import { PRODUCTION_BUTTONS_CONFIG } from "../../../config/ProductionButtonConfig";
export class ProductionController {
  constructor(config = PRODUCTION_BUTTONS_CONFIG) {
    this.config = config;
  }

  canStartProduction(factory, hours) {
    if (hours === 1) return true;
    
    return factory.canStart15HourProduction 
      ? factory.canStart15HourProduction()
      : !factory.isProducing;
  }

  handleProductionStart(factory, hours, messageCallback) {
    if (!factory.isProducing) {
      factory.startProduction(hours);
    } else {
      const wasCapped = factory.startProduction(hours);
      if (wasCapped) {
        messageCallback("Capped at 15 hours");
      }
    }
    return true;
  }

  handleButtonClick(button, factory, messageCallback) {
    if (button.hours === 15 && !this.canStartProduction(factory, 15)) {
      messageCallback("Cannot start 15hr production while active (max limit is 15 hours)");
      return true;
    }
    
    return this.handleProductionStart(factory, button.hours, messageCallback);
  }
}
