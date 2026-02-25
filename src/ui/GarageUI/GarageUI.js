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
    wallSection = null, // ← add wallSection to constructor
    customConfig = {}
  ) {
    this.flakManager = flakManager;
    this.garageX = garageX;
    this.garageY = garageY;
    this.garageWidth = garageWidth;
    this.garageHeight = garageHeight;
    this.wallSection = wallSection;
    this.iconManager = new IconManager(); // ← add
    this.showGrid = false;
    this.currentOffsetX = 0;
    this.currentOffsetY = 0;

    this.longRangeBuilding = null;
    this.garageSpriteManager = new GarageSpriteManager();


    this.config = ConfigurationMerger.getGarageUIConfig(customConfig);
    this.gridConfig = this.config.grid;
    this.gridConfig.buildableBoxIndex = this.config.panel.buildableBoxIndex;

    this.calculatePanelDimensions();
    this.panelBounds = null;
    this.boxes = UniversalBoxesFactory.createBoxes(this, this.gridConfig, {
      skipLast: true,
    });
  }

  calculatePanelDimensions() {
    const alignment = this.gridConfig.alignment ;
    const paddingLeft = alignment.paddingLeft ;
    const paddingRight = alignment.paddingRight ;
    const paddingTop = alignment.paddingTop ;
    const paddingBottom = alignment.paddingBottom ;

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
      x:
        this.garageX +
        this.garageWidth / 2 -
        this.panelWidth / 2 +
        this.config.panel.offsetX,
      y: this.garageY + this.garageHeight + this.config.panel.offsetY,
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

    // draw background
    UniversalPanelRenderer.drawPanelBackground(
      ctx,
      x,
      y,
      this.panelWidth,
      this.panelHeight,
    );

    // ---- NEW: determine hovered box and header text ----
    const hoveredBox = this.boxes.find(
      (box) => box.state && box.state.isHovered
    );
    const headerText = hoveredBox
      ? hoveredBox.description ||
        `This is box ${this.boxes.indexOf(hoveredBox) + 1}`
      : this.defaultHeaderText || "Hover a box for details";

    UniversalPanelRenderer.drawPanelHeader(
      ctx,
      x,
      y,
      this.panelWidth,
      headerText,
      {
        padding: 10,
        offsetY: 20,
      }
    );
    // ---- end new --------------------------------------

    // draw boxes (they will draw letters/sprites themselves)
   this.boxes.forEach((box) => box.draw(ctx, x, y, {
  renderType: "garage",
  wallSection: this.wallSection,
  iconManager: this.iconManager,
  garageUI: this,
  garageSpriteManager: this.garageSpriteManager,  // ← add
  panelBounds: { x, y, width: this.panelWidth, height: this.panelHeight }, // ← add
}))}
  

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
      garageUI: this,              // ← THIS WAS MISSING
      boxIndex: box.index,
      gridConfig: this.gridConfig
    }, 'build');
  }) || false;
}

  spawnLongRange() {
  if (this.longRangeBuilding) return false;
  this.longRangeBuilding = new LongRangeBuilding(this.garageX, this.garageY);
  return true;
}

  update(deltaTime) {
  const flakBox = this.boxes[0];   // ← verify with log
  const lrBox = this.boxes[2];     // ← verify with log

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
