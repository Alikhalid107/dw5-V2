// src/universal/UniversalBoxController.js
import { FactoryUtils } from "../../utils/FactoryUtils.js";

export class UniversalBoxController {
  constructor(config) {
    this.config = config;
  }

  handleClick(mouseX, mouseY, state, context, actionType = "default") {
    if (!state || !state.bounds) return false;

    switch (actionType) {
      case "factory":
        // Pass entire context to FactoryUtils; FactoryUtils handles messaging now.
        return FactoryUtils.handleFactoryClick(context);

      case "build":
        if (context.boxIndex === 0) {
          return context.flakManager?.canBuild()
            ? context.flakManager.startBuilding()
            : false;
        }
        return false;

      default:
        return true;
    }
  }
}
