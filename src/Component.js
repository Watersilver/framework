import shared from "./sharedPrivateData.js";
import Entity from "./Entity.js";

class Component {

  static index = 0;

  // Sets of components or components I will run before or after. Overwrites index.
  static before = null;
  static after = null;

  // Can't be added to Entity that doesn't have instances of following components
  static require = null;

  constructor(entity) {
    if (!(entity instanceof Entity)) throw TypeError("Component constructor argument must be an Entity.");
    
  }

  getClass() {
    return this.constructor;
  }
}

export default Component;