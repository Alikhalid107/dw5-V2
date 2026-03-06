export class FactoryProductionSystem {
  constructor() {
    this.isProducing = false;
    this.productionTimeRemaining = 0; // milliseconds
    this.maxProductionTime = 15 * 60 * 60 * 1000; // 15 hours
    this.showProductionComplete = false;
    this.productionCompleteTimer = 0;
  }

  update(deltaMs) {
    if (this.isProducing && this.productionTimeRemaining > 0) {
      this.productionTimeRemaining = Math.max(0, this.productionTimeRemaining - deltaMs);
      
      if (this.productionTimeRemaining <= 0) {
        this.completeProduction();
      }
    }

    if (this.showProductionComplete) {
      this.productionCompleteTimer += deltaMs;
      if (this.productionCompleteTimer >= 2000) {
        this.showProductionComplete = false;
        this.productionCompleteTimer = 0;
      }
    }
  }

  startProduction(hours) {
    const timeMs = hours * 60 * 60 * 1000;
    
    if (!this.isProducing) {
      this.isProducing = true;
      this.productionTimeRemaining = Math.min(timeMs, this.maxProductionTime);
    } else {
      this.productionTimeRemaining = Math.min(
        this.productionTimeRemaining + timeMs, 
        this.maxProductionTime
      );
    }
    
    return this.productionTimeRemaining >= this.maxProductionTime;
  }

  canStart15HourProduction() {
    return !this.isProducing;
  }

  cancelProduction() {
    this.isProducing = false;
    this.productionTimeRemaining = 0;
    this.showProductionComplete = false;
    this.productionCompleteTimer = 0;
  }

  completeProduction() {
    this.isProducing = false;
    this.productionTimeRemaining = 0;
    this.showProductionComplete = true;
    this.productionCompleteTimer = 0;
  }

  getFormattedProductionTime() {
    if (!this.isProducing || this.productionTimeRemaining <= 0) return "";
    
    const totalSeconds = Math.ceil(this.productionTimeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}