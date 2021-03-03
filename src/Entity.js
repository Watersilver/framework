// import { v4 as uuidv4 } from 'uuid';

// import sharedPrivateData from "./sharedPrivateData.js";
import TreeNode from "./TreeNode.js";
import MapOfSets from "./MapOfSets.js";
import World from "./World.js";

class Entity extends TreeNode {
  constructor(world) {
    super();
    if (!(world instanceof World)) throw TypeError("Entity constructor first argument must be a World.");
    // this.id = uuidv4();
    // while (world.entities[this.id]) this.id = uuidv4();
    // world.entities[this.id] = this;
    world.entities.add(this);
    this.world = world;
    this.components = new MapOfSets();
    // this._shared = sharedPrivateData.getWorldData(this.world);
  }

  remove() {
    this.detach();
    // delete this.world.entities[this.id];
    world.entities.delete(this);
    for (const [_, compSet] of this.components) {
      for (const component of compSet) {
        if (component.onEntityRemove) component.onEntityRemove();
        if (component.unload) component.unload();
      };
    }
  }

  // get exists() {return this.world.entities.hasOwnProperty(this.id);}
  get exists() {return this.world.entities.has(this);}
}

export default Entity;