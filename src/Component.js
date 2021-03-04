import sharedPrivateData from "./sharedPrivateData.js";
import Entity from "./Entity.js";

class Component {

  // Can't be added to Entity that doesn't have instances of following components
  // I will run after all components that I require.
  static requires = null;

  static unique = false;

  constructor(entity, ...args) {
    if (!(entity instanceof Entity)) throw TypeError("Component constructor argument must be an Entity.");
    if (!entity.exists) return;
    this._entity = entity;
    const myClass = this.getClass();
    if (myClass.unique && entity._components.has(myClass)) {
      return console.warn("Didn't add unique component. Already present in entity.");
    }
    if (myClass.requires) {
      if ((myClass.requires.prototype instanceof Component) || !(myClass.requires instanceof Set)) {
        myClass.requires = new Set([myClass.requires]);
      }
      for (const requiredClass of myClass.requires) {
        if (!entity._components.has(requiredClass)) return console.warn("Didn't add component. Required components are not present in entity.");
      }
      entity._dependentComponents.set(myClass, this);
    }
    entity._components.set(myClass, this);
    entity.world._components.add(this);
    if (this.load) this.load();
    if (this.onAdd) this.onAdd(...args);
  }

  get exists() {return this._entity !== null;}

  get entity() {return this._entity;}

  remove(...args) {
    const myClass = this.getClass();
    const entity = this._entity;
    entity._components.delete(myClass, this);
    entity.world._components.delete(this);
    if (myClass.requires) entity._dependentComponents.delete(myClass, this);
    for (const [compClass, compSet] of entity._dependentComponents) {
      if (compClass.requires.has(myClass)) compSet.forEach(component => component.remove());
    }
    if (this.onRemove) this.onRemove(...args);
    if (this.unload) this.unload();
    this._entity = null;
  }

  getClass() {
    return this.constructor;
  }
}

export default Component;