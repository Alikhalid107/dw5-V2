export class ObjectManager {
  setManagers(flakManager, factoryManager) {
    this.flakManager = flakManager;
    this.factoryManager = factoryManager;
  }

  updateFlakObjects(objects) {
    if (!objects || !this.flakManager) return;
    
    // Filter out old flak objects
    const newObjects = objects.filter(obj => 
      obj && obj.type !== "flak" && obj.constructor?.name !== "Flak"
    );
    
    // Add new flak objects
    objects.length = 0;
    objects.push(...newObjects, ...(this.flakManager.getObjects() || []));
  }

  updateFactoryObjects(objects) {
    if (!objects || !this.factoryManager) return;
    
    const currentFactoryObjects = this.factoryManager.getObjects();
    const currentCount = objects.filter(obj => 
      obj.type === "factory" || obj.type === "factory_additional"
    ).length;
    
    if (currentCount !== currentFactoryObjects.length) {
      // Filter out old factory objects
      const newObjects = objects.filter(obj => 
        obj.type !== "factory" && obj.type !== "factory_additional"
      );
      
      // Add new factory objects
      objects.length = 0;
      objects.push(...newObjects, ...currentFactoryObjects);
    }
  }
}