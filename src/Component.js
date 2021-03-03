// import sharedPrivateData from "./sharedPrivateData.js";
import Entity from "./Entity.js";

class Component {

  static index = 0;

  // component I will run before or after. Overwrites index.
  static before = null;
  static after = null;

  // Can't be added to Entity that doesn't have instances of following components
  static requires = null;

  static unique = false;

  constructor(entity) {
    if (!(entity instanceof Entity)) throw TypeError("Component constructor argument must be an Entity.");
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
    }
    entity.components.set(myClass, this);
    if (this.load) this.load();
    if (this.onAdd) this.onAdd();
  }

  remove() {
    this.entity.components.delete(myClass, this);
    const myClass = this.getClass();
    for (const [compClass, compSet] of this.entity.components) {
      if (compClass.requires.has(myClass)) compSet.forEach(component => component.remove());
    }
    if (this.onRemove) this.onRemove();
    if (this.unload) this.unload();
  }

  getClass() {
    return this.constructor;
  }
}

export default Component;