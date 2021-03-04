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
    this.entity = entity;
    const myClass = this.getClass();
    if (myClass.unique && entity.components.has(myClass)) {
      return console.warn("Didn't add unique component. Already present in entity.");
    }
    if (myClass.requires) {
      if ((myClass.requires.prototype instanceof Component) || !(myClass.requires instanceof Set)) {
        myClass.requires = new Set(myClass.requires);
      }
      for (const requiredClass of myClass.requires) {
        if (!entity.components.has(requiredClass)) return console.warn("Didn't add component. Required components are not present in entity.");
      }
      entity.dependentComponents.set(myClass, this);
    }
    entity.components.set(myClass, this);
    entity.world.components.add(this);
    if (this.load) this.load();
    if (this.onAdd) this.onAdd(args);
  }

  get exists() {return this.entity !== null}

  remove(...args) {
    this.entity.components.delete(myClass, this);
    this.entity.world.components.delete(this);
    const myClass = this.getClass();
    if (myClass.requires) this.entity.dependentComponents.delete(myClass, this);
    for (const [compClass, compSet] of this.entity.dependentComponents) {
      if (compClass.requires.has(myClass)) compSet.forEach(component => component.remove());
    }
    if (this.onRemove) this.onRemove(args);
    if (this.unload) this.unload();
    this.entity = null;
  }

  getClass() {
    return this.constructor;
  }
}

export default Component;