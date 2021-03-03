const emptySet = new Set();

class MapOfSets extends Map {
  constructor() {
    super();
    this._set = Map.prototype.set;
    this._get = Map.prototype.get;
    this._delete = Map.prototype.delete;
  }

  set(key, value) {
    if (!this.has(key)) this.set(key, new Set());
    return this.get(key).add(value);
  }

  get(key) {
    const got = this._get(key);
    if (got) return got;
    else return emptySet;
  }

  delete(key, value) {
    if (arguments.length === 1) {
      return this._delete(key);
    } else {
      if (!this.has(key)) return false;
      const deleted = this.get(key).delete(value);
      if (this.get(key).size === 0) this._delete(key);
      return deleted;
    }
  }
}

export default MapOfSets;