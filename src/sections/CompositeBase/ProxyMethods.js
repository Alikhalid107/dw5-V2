export class ProxyMethods {
  setManagers(flakManager, wallSection) {
    this.flakManager = flakManager;
    this.wallSection = wallSection;
  }

  getFlakCount() { return this.flakManager?.getTotalFlakCount() || 2; }
  isFlakBuilding() { return this.flakManager?.isBuilding() || false; }
  buildFlak() { return this.flakManager?.startBuilding() || false; }
  getFlakBuildProgress() { return this.flakManager?.getBuildProgress() || 0; }
  getRemainingFlakBuildTime() { return this.flakManager?.getRemainingBuildTime() || 0; }
  canBuildFlak() { return this.flakManager?.canBuild() || false; }
  getFlakCapacity() { return this.flakManager?.getMaxFlakCapacity() || 50; }
  setFlakScale(newScale) { this.flakManager?.setFlakScale(newScale); }
  getTotalFlakCount() { return this.flakManager?.getTotalFlakCount() || 0; }
  getAllFlaks() { return this.flakManager?.getAllFlaks() || []; }
  updateFlakRowConfig(rowIndex, newConfig) { this.flakManager?.updateFlakRowConfig(rowIndex, newConfig); }
  setWallOffsets(lx, ly, rx, ry) { this.wallSection?.setWallOffsets(lx, ly, rx, ry); }
  getLeftWall() { return this.wallSection?.getLeftWall(); }
  getRightWall() { return this.wallSection?.getRightWall(); }
}