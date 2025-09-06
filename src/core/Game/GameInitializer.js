import { Grass } from "../../components/Grass.js";
import { Base } from "../../components/Base.js";

export class GameInitializer {
    static setupGrassTiling(worldWidth, worldHeight) {
        const grass = new Grass(worldWidth, worldHeight);
        return grass.getObjects();
    }

    static spawnBases(worldWidth, worldHeight, baseCount) {
        return Array.from({ length: baseCount }, () => 
            new Base(worldWidth, worldHeight)
        );
    }
}