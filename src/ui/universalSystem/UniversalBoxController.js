export class UniversalBoxController {
  constructor(config) {
    this.config = config;
  }

  handleClick(mouseX, mouseY, state, context, actionType = 'default') {
    if (!state.isPointInside(mouseX, mouseY)) return false;

    switch (actionType) {
      case 'upgrade': return !context.factory.upgrading && !context.factory.isMaxLevel();
      case 'build': return context.flakManager.canBuild() ? context.flakManager.startBuilding() : false;
      default: return true;
    }
  }

  updateHoverState(mouseX, mouseY, state) {
    return state.updateHoverState(mouseX, mouseY);
  }
}
