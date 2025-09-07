export class WallConfig {
  constructor() {
    this.wallWidth = 485;
    this.wallHeight = 59;
    
    // Default offsets
    this.leftWallOffsetX = 200;
    this.leftWallOffsetY = 415;
    this.rightWallOffsetX = -715;
    this.rightWallOffsetY = 415;
    
    // Image paths
    this.leftWallImage = 'simpleWallLeft.png';
    this.rightWallImage = 'simpleWallRight.png';
    
    // Z-index
    this.wallZIndex = 5;
  }
}