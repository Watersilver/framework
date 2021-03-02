import sharedPrivateData from "./sharedPrivateData.js";
import TreeNode from "./TreeNode.js";
import World from "./World.js";

class Entity extends TreeNode {
  constructor(world) {
    super();
    if (!(world instanceof World)) throw TypeError("Entity constructor first argument must be a World.");
    this.world = world;
    this._shared = sharedPrivateData.getWorldData(world);
    this._shared.entitiesToBeAdded.set(this);
  }

  die() {
    if (this._shared.entitiesToBeAdded.delete(this)) return;
    if (!this.exists) return;
    this._shared.entitiesToBeRemoved.add(this);
  }

  get exists() {return this.world.entities.has(this);}
}

export default Entity;