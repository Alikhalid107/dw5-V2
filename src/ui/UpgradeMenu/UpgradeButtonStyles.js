import { UPGRADE_BUTTON_CONFIG } from "../../config/UpgradeButtonConfig";
export class UpgradeButtonStyles {
  constructor(config = UPGRADE_BUTTON_CONFIG) {
    this.config = config;
  }

  getBackgroundColor(factory, isHovered) {
    const { STYLING } = this.config;
    
    if (factory.upgrading) return STYLING.upgradingBackgroundColor;
    if (factory.isMaxLevel()) return STYLING.maxLevelBackgroundColor;
    if (isHovered) return STYLING.hoverBackgroundColor;
    return STYLING.backgroundColor;
  }

  getFactoryGlowColor(factoryType) {
    const { FACTORY_COLORS } = this.config;
    return FACTORY_COLORS[factoryType] || FACTORY_COLORS.default;
  }

  shouldShowGlow(factory, isHovered) {
    if (!this.config.EFFECTS.glowEnabled) return false;
    return isHovered && !factory.upgrading && !factory.isMaxLevel();
  }

  getScaleFactor(factory, isHovered, baseScale) {
    const { STYLING } = this.config;
    const scale = baseScale || STYLING.baseScaleFactor;
    return this.shouldShowGlow(factory, isHovered) ? scale * STYLING.hoverScaleFactor : scale;
  }

  getButtonGlowSettings() {
    const { EFFECTS } = this.config;
    return {
      color: EFFECTS.buttonGlowColor,
      blur: EFFECTS.buttonGlowBlur
    };
  }

  getSpriteGlowSettings() {
    const { EFFECTS } = this.config;
    return {
      blur: EFFECTS.spriteGlowBlur
    };
  }

  getHoverOverlayColor() {
    return this.config.EFFECTS.hoverOverlayColor;
  }

  getProgressBarSettings() {
    const { EFFECTS } = this.config;
    return {
      backgroundColor: EFFECTS.progressBackgroundColor,
      height: EFFECTS.progressHeight
    };
  }

  getCheckmarkSettings() {
    const { EFFECTS, DIMENSIONS } = this.config;
    return {
      glowColor: EFFECTS.checkmarkGlowColor,
      glowBlur: EFFECTS.checkmarkGlowBlur,
      baseSize: Math.min(DIMENSIONS.width, DIMENSIONS.height) * 1.3,
      hoverScale: 1.1
    };
  }

  getFallbackTextSettings(isHovered) {
    const { STYLING } = this.config;
    return {
      text: STYLING.fallbackText,
      fontSize: STYLING.fallbackTextSize * (isHovered ? STYLING.hoverFontScale : 1),
      textColor: isHovered ? STYLING.hoverTextColor : STYLING.textColor,
      outlineColor: STYLING.textOutlineColor,
      outlineWidth: isHovered ? STYLING.hoverTextOutlineWidth : STYLING.textOutlineWidth
    };
  }
}
