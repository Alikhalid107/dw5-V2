// BoxColorCalculator.js
export class BoxColorCalculator {
  static getColor(canBuild, flakManager) {
    if (!canBuild) return 'rgba(75, 103, 123, 1)';
    
    if (flakManager.isBuilding()) return 'rgba(255, 165, 0, 0.8)';
    if (flakManager.canBuild()) return 'rgba(82, 122, 151, 1)';
    return 'rgba(34, 139, 34, 0.8)';
  }
}