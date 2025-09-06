export class ObjectManager {
    constructor(grassObjects, bases) {
        this.grassObjects = grassObjects;
        this.bases = bases;
    }

    getDrawObjects() {
        const baseObjects = this.bases.flatMap(base => base.getObjects());
        const allObjects = [...this.grassObjects, ...baseObjects];
        
        // Remove duplicates using Set
        const uniqueObjects = [];
        const seen = new Set();
        
        for (const obj of allObjects) {
            if (!seen.has(obj)) {
                seen.add(obj);
                uniqueObjects.push(obj);
            }
        }
        
        return uniqueObjects;
    }

    update(deltaTime) {
        this.bases.forEach(base => base.update?.(deltaTime));
        this.grassObjects.forEach(obj => obj.update?.(deltaTime));
    }

    getBase(index = 0) { return this.bases[index]; }
    getAllBases() { return this.bases; }
}