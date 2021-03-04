import World from "./World.js";
import Entity from "./Entity.js";

const allData = new WeakMap();

class EntityData {
  constructor() {
    
  }
}

class WorldData {
  constructor() {

  }
}

class SharedPrivateData {
  constructor() {
    
  }

  getWorldData(world) {
    if (!(world instanceof World)) throw TypeError("getWorldData takes a World as argument.");
    if (allData.has(world)) return allData.get(world);
    else return allData.set(world, new WorldData());
  }

  getEntityData(entity) {
    if (!(entity instanceof Entity)) throw TypeError("getEntityData takes an Entity as argument.");
    if (allData.has(entity)) return allData.get(entity);
    else return allData.set(entity, new EntityData());
  }
}

export default new SharedPrivateData();
