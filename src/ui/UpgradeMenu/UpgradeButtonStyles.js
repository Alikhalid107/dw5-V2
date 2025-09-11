export class UpgradeButtonStyles {
  constructor() {
    this.backgroundColors = {
      upgrading: "rgba(255, 165, 0, 0.8)",
      maxLevel: "rgba(115, 145, 167, 0.7)",
      default: "rgba(115, 145, 167, 0.7)",
      hovered: "rgba(180, 210, 235, 0.9)"
    };

    this.glowColors = {
      'concrete': 'rgba(252, 252, 139, 0.8)',
      'steel': 'rgba(220, 20, 60, 0.8)',
      'carbon': 'rgba(50, 205, 50, 0.8)',
      'oil': 'rgba(153, 50, 204, 0.8)',
      'default': 'rgba(255, 255, 255, 0.8)'
    };
  }

  getBackgroundColor(factory, isHovered) {
    if (factory.upgrading) return this.backgroundColors.upgrading;
    if (factory.isMaxLevel()) return this.backgroundColors.maxLevel;
    if (isHovered) return this.backgroundColors.hovered;
    return this.backgroundColors.default;
  }

  getFactoryGlowColor(factoryType) {
    return this.glowColors[factoryType] || this.glowColors.default;
  }

  shouldShowGlow(factory, isHovered) {
    return isHovered && !factory.upgrading && !factory.isMaxLevel();
  }

  getScaleFactor(factory, isHovered, baseScale = 0.6) {
    return this.shouldShowGlow(factory, isHovered) ? baseScale * 1.15 : baseScale;
  }
}