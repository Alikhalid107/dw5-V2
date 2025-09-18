export class UniversalBoxController {
  constructor(config) {
    this.config = config;
  }

  handleClick(mouseX, mouseY, state, context, actionType = 'default') {
    // DON'T use state.isPointInside(mouseX, mouseY) here — UniversalBox already validated world bounds.
    if (!state || !state.bounds) return false;

    switch (actionType) {
      case 'upgrade':
        return !context.factory?.upgrading && !context.factory?.isMaxLevel();

      case 'build':
        if (context.boxIndex === 0) {
          return context.flakManager?.canBuild()
            ? context.flakManager.startBuilding()
            : false;
        }
        return false; // other boxes: later handling

      default:
        return true;
    }
  }

  updateHoverState(mouseX, mouseY, state) {
    // If you want controller to handle hover, use world-aware test (see note below).
    return state.updateHoverState(mouseX, mouseY);
  }
}
