import { FactoryUtils } from "../../utils/FactoryUtils.js";

export class UniversalBoxController {
  constructor(config) {
    this.config = config;
  }

  handleClick(mouseX, mouseY, state, context, actionType = "default") {
    if (!state || !state.bounds) return false;

    switch (actionType) {
      case "factory":
        return FactoryUtils.handleFactoryClick(context);

      case "build":
        if (context.boxIndex === 0) {
          return context.flakManager?.canBuild()
            ? context.flakManager.startBuilding()
            : false;
        }
        if (context.boxIndex === 1) {  // ← box 2, wall upgrade
          return context.wallSection?.upgradeWalls() || false;
        }
         if (context.boxIndex === 2) {  // ← box 3
          return context.garageUI?.spawnLongRange() || false;
        }
        return false;

      default:
        return true;
    }
  }
}