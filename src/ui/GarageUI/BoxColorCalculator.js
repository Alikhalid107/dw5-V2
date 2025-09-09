// BoxColorCalculator.js
export class BoxColorCalculator {
  static getColor(canBuild, flakManager) {
    if (!canBuild) return 'rgba(115, 145, 167, 0.6)';
    
    if (flakManager.isBuilding()) return 'rgba(255, 165, 0, 0.8)';
    if (flakManager.canBuild()) return 'rgba(115, 145, 167, 0.6)';
    return 'rgba(34, 139, 34, 0.8)';
  }
}