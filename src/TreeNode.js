class TreeNode {
  constructor() {
    this._children = new Set(); // Set of TreeNodes
    this._parent = null; // TreeNode
  }
  get parent() {return this._parent;}
  set parent(_) {throw Error("parent is read-only");}
  get children() {return Array(...this._children);}
  set children(_) {throw Error("children is read-only");}

  addChild(node) {
    // Make sure "this" is not descendant of new child
    if (this.ascendUntil(anc => anc === node)) {
      throw Error("new child can't be TreeNode's ancestor")
    }

    node.detach();
    this._children.add(node);
    node._parent = this;
  }

  removeChild(node) {
    return node.detach();
  }

  detach() {
    if (!this._parent) return false;
    this._parent._children.delete(this);
    this._parent = null;
    return true;
  }

  descendUntil(callback) {
    for (const child of this._children) {
      let stop;
      stop = callback(child);
      if (stop) return stop;
      stop = child.descendUntil(callback);
      if (stop) return stop;
    }
  }

  ascendUntil(callback) {
    let node = this._parent;
    while (node) {
      const stop = callback(node);
      if (stop) return stop;
      node = node._parent;
    }
  }

  fromRootToParentUntil(callback) {
    const ancestors = [];
    let node = this._parent;
    while (node) {
      ancestors.push(node);
      node = node._parent;
    }
    for (let i = ancestors.length - 1; i >= 0; i++) {
      const ancestor = ancestors[i];
      const stop = callback(ancestor);
      if (stop) return stop;
    }
  }
}

export default TreeNode;
