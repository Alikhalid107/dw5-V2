export class BaseObjectUpdater {
  constructor(flakManager, factoryManager) {
    this.flakManager = flakManager;
    this.factoryManager = factoryManager;
  }

  updateFlakObjects(objects) {
    if (!objects || !this.flakManager) return;
    
    // Remove old flak objects
    const nonFlakObjects = objects.filter(obj => 
      obj && obj.type !== "flak" && obj.constructor?.name !== "Flak"
    );
    
    // Replace with updated flak objects
    objects.length = 0;
    objects.push(...nonFlakObjects, ...(this.flakManager.getObjects() || []));
  }

  updateFactoryObjects(objects) {
    if (!objects || !this.factoryManager) return;
    
    const currentFactoryObjects = this.factoryManager.getObjects();
    const currentFactoryCount = objects.filter(obj => 
      obj.type === "factory" || obj.type === "factory_additional"
    ).length;
    
    // Only update if factory count changed
    if (currentFactoryCount !== currentFactoryObjects.length) {
      // Remove old factory objects
      const nonFactoryObjects = objects.filter(obj => 
        obj.type !== "factory" && obj.type !== "factory_additional"
      );
      
      // Replace with updated factory objects
      objects.length = 0;
      objects.push(...nonFactoryObjects, ...currentFactoryObjects);
    }
  }
}