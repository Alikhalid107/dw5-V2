import { UniversalBoxesFactory } from "../universalSystem/UniversalBoxesFactory.js";
import { UniversalPanelRenderer } from "../../universal/UniversalPanelRenderer.js";
import { ConfigurationMerger } from "../../universal/ConfigurationMerger.js";
import { IconManager } from "../../utils/IconManager.js";
import { LongRangeBuilding } from "../../gameObjects/LongRangeBuilding.js";
import { GarageSpriteManager } from "../../managers/GarageSpriteManager.js";

export class GarageUI {
  constructor(
    flakManager,
    garageX,
    garageY,
    garageWidth,
    garageHeight,
    wallSection = null,
    customConfig = {}
  ) {
    this.flakManager = flakManager;
    this.garageX = garageX;  // Visual garage position (for UI panel)
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.wallSection = wallSection;
    this.iconManager = new IconManager();
    this.showGrid = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    // Store logical garage position for object spawning
    this.logicalGarageX = customConfig.logicalGarageX ?? garageX;
    this.logicalGarageY = customConfig.logicalGarageY ?? garageY;

    this.longRangeBuilding = null;
    this.longRangeCfg = customConfig.longRange ?? {};
    this.garageSpriteManager = new GarageSpriteManager();

    this.config = ConfigurationMerger.getGarageUIConfig(customConfig);
    this.gridConfig = this.config.grid;
    this.gridConfig.buildableBoxIndex = this.config.panel.buildableBoxIndex;

    // ── Apply type2 hover/panel overrides ──────────────────────────────────
    if (customConfig.hoverAreaX !== undefined)      this.config.panel.hoverAreaX = customConfig.hoverAreaX;
    if (customConfig.hoverAreaY !== undefined)      this.config.panel.hoverAreaY = customConfig.hoverAreaY;
    if (customConfig.hoverAreaWidth !== undefined)  this.config.panel.hoverAreaWidth = customConfig.hoverAreaWidth;
    if (customConfig.hoverAreaHeight !== undefined) this.config.panel.hoverAreaHeight = customConfig.hoverAreaHeight;
    if (customConfig.panelOffsetX !== undefined)    this.config.panel.offsetX = customConfig.panelOffsetX;
    if (customConfig.panelOffsetY !== undefined)    this.config.panel.offsetY = customConfig.panelOffsetY;
    // ──────────────────────────────────────────────────────────────────────

    this.calculatePanelDimensions();
    this.panelBounds = null;
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, {
      skipLast: true,
    });
  }

  calculatePanelDimensions() {
    const alignment = this.gridConfig.alignment;
    const paddingLeft = alignment.paddingLeft;
    const paddingRight = alignment.paddingRight;
    const paddingTop = alignment.paddingTop;
    const paddingBottom = alignment.paddingBottom;

    const gridWidth =
      this.gridConfig.cols * this.gridConfig.boxWidth +
      (this.gridConfig.cols - 1) * this.gridConfig.spacing;
    const gridHeight =
      this.gridConfig.rows * this.gridConfig.boxHeight +
      (this.gridConfig.rows - 1) * this.gridConfig.spacing;

    this.panelWidth = gridWidth + paddingLeft + paddingRight;
    this.panelHeight = gridHeight + paddingTop + paddingBottom;
  }

  calculatePanelPosition() {
    return {
      x: this.garageX + this.garageWidth / 2 - this.panelWidth / 2 +
         (this.config.panel.offsetX ?? 0),
      y: this.garageY + this.garageHeight +
         (this.config.panel.offsetY ?? 10),
    };
  }

  drawUI(ctx, offsetX, offsetY) {
    if (!this.showGrid) return;

    this.currentOffsetX = offsetX;
    this.currentOffsetY = offsetY;

    const pos = this.calculatePanelPosition();
    const x = pos.x - offsetX;
    const y = pos.y - offsetY;

    this.panelBounds = {
      x: pos.x,
      y: pos.y,
      width: this.panelWidth,
      height: this.panelHeight,
    };

    UniversalPanelRenderer.drawPanelBackground(
      ctx, x, y, this.panelWidth, this.panelHeight,
    );

    const hoveredBox = this.boxes.find(
      (box) => box.state && box.state.isHovered
    );
    const headerText = hoveredBox
      ? hoveredBox.description ||
        `This is box ${this.boxes.indexOf(hoveredBox) + 1}`
      : this.defaultHeaderText || "Hover a box for details";

    UniversalPanelRenderer.drawPanelHeader(
      ctx, x, y, this.panelWidth, headerText,
      { padding: 10, offsetY: 20 }
    );

    this.boxes.forEach((box) => box.draw(ctx, x, y, {
      renderType: "garage",
      wallSection: this.wallSection,
      iconManager: this.iconManager,
      garageUI: this,
      garageSpriteManager: this.garageSpriteManager,
      panelBounds: { x, y, width: this.panelWidth, height: this.panelHeight },
    }));
  }

  handleMouseMove(mouseX, mouseY) {
    const hoverArea = {
      x: this.garageX + (this.config.panel.hoverAreaX || 0),
      y: this.garageY + (this.config.panel.hoverAreaY || 0),
      width: this.config.panel.hoverAreaWidth || this.garageWidth,
      height: this.config.panel.hoverAreaHeight || this.garageHeight,
    };

    const isOverGarage =
      this.config.panel.garageHoverEnabled &&
      mouseX >= hoverArea.x &&
      mouseX <= hoverArea.x + hoverArea.width &&
      mouseY >= hoverArea.y &&
      mouseY <= hoverArea.y + hoverArea.height;

    const isOverPanel =
      this.config.panel.panelHoverEnabled &&
      this.panelBounds &&
      mouseX >= this.panelBounds.x &&
      mouseX <= this.panelBounds.x + this.panelBounds.width &&
      mouseY >= this.panelBounds.y &&
      mouseY <= this.panelBounds.y + this.panelBounds.height;

    this.showGrid = isOverGarage || isOverPanel;

    if (this.showGrid) {
      this.boxes.forEach((box) => box.updateHoverState(mouseX, mouseY));
    } else {
      this.boxes.forEach((box) => (box.isHovered = false));
    }

    return this.showGrid;
  }

  handleClick(mouseX, mouseY) {
    return this.boxes.find(box => {
      if (!box._isPointInWorldBounds(mouseX, mouseY)) return false;
      return box.controller.handleClick(mouseX, mouseY, box.state, {
        flakManager: this.flakManager,
        wallSection: this.wallSection,
        garageUI: this,
        boxIndex: box.index,
        gridConfig: this.gridConfig
      }, 'build');
    }) || false;
  }

  // ── Updated: pass longRangeCfg to LongRangeBuilding ──────────────────────
  spawnLongRange() {
    if (this.longRangeBuilding) return false;
    // Use logical garage position for spawning objects
    this.longRangeBuilding = new LongRangeBuilding(this.logicalGarageX, this.logicalGarageY, this.longRangeCfg);
    return true;
  }

  update(deltaTime) {
    const flakBox = this.boxes[0];
    const lrBox = this.boxes[2];

    this.garageSpriteManager.update(
      deltaTime,
      flakBox?.state?.isHovered || false,
      lrBox?.state?.isHovered || false
    );
    this.longRangeBuilding?.update(deltaTime);
  }

  updateConfig(newConfig) {
    this.config = ConfigurationMerger.getGarageUIConfig(newConfig);
    this.gridConfig = this.config.grid;
    this.gridConfig.buildableBoxIndex = this.config.panel.buildableBoxIndex;
    this.calculatePanelDimensions();
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig);
  }
}