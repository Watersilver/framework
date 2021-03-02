import World from "./World.js";

class worldData {
  constructor() {
    this.entitiesToBeAdded = new Set();
    this.entitiesToBeRemoved = new Set();
  }
}

const allData = new WeakMap();

class SharedPrivateData {
  constructor() {
    
  }

  getWorldData(world) {
    if (!(world instanceof World)) throw TypeError("getWorldData takes a World as argument.");
    if (allData.has(world)) return allData.get(world);
    else return allData.set(world, new worldData);
  }
}

export default new SharedPrivateData;