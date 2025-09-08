import { WALL_CONFIG } from '../config/WallConfig.js';

export class WallPositioning {
  static calculateWallPosition(side, baseX, baseY, baseWidth, customOffsets = {}) {
    const offsets = {
      ...WALL_CONFIG.OFFSETS[side],
      ...customOffsets
    };

    if (side === 'left') {
      return {
        x: baseX + offsets.x,
        y: baseY + offsets.y
      };
    } else if (side === 'right') {
      return {
        x: baseX + baseWidth + offsets.x,
        y: baseY + offsets.y
      };
    }
    
    throw new Error(`Invalid wall side: ${side}`);
  }

  static updateWallPosition(wall, baseX, baseY, baseWidth, customOffsets = {}) {
    const position = this.calculateWallPosition(wall.side, baseX, baseY, baseWidth, customOffsets);
    wall.x = position.x;
    wall.y = position.y;
  }
}