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
    // while (world._entities[this.id]) this.id = uuidv4();
    // world._entities[this.id] = this;
    world._entities.add(this);
    this._components = new MapOfSets();
    // this._shared = sharedPrivateData.getWorldData(this.world);
    this._dependentComponents = new MapOfSets();
    this._world = world;
  }

  get world() {return this._world;}

  getComponent(componentClass) {
    if (!this._components.has(componentClass)) return null;
    return this._components.get(componentClass).values().next().value;
  }

  numberOfComponents(componentClass) {
    if (!componentClass) {
      let number = 0;
      for (const [_, set] of this._components) {
        number += set.size;
      }
      return number;
    }
    return this._components.get(componentClass).size;
  }

  iteratorOfComponents(componentClass) {
    return this._components.get(componentClass).values();
  }

  iteratorOfComponentTypes() {
    return this._components.keys();
  }

  remove() {
    this.detach();
    // delete this.world._entities[this.id];
    this.world._entities.delete(this);
    for (const [_, compSet] of this._components) {
      for (const component of compSet) {
        this.world._components.delete(component);
        if (component.onEntityRemove) component.onEntityRemove();
        if (component.unload) component.unload();
      };
    }

    // Remove children too.
    for (const child of this.children) {
      child.remove();
    }
  }

  // get exists() {return this.world._entities.hasOwnProperty(this.id);}
  get exists() {return this.world._entities.has(this);}
}

export default Entity;