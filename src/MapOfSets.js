const emptySet = new Set();

class MapOfSets extends Map {
  constructor() {
    super();
    this._set = Map.prototype.set;
    this._get = Map.prototype.get;
    this._delete = Map.prototype.delete;
  }

  set(key, value) {
    if (!this.has(key)) this._set(key, new Set());
    return this._get(key).add(value);
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
      const got = this._get(key);
      if (!got) return false;
      const deleted = got.delete(value);
      if (got.size === 0) this._delete(key);
      return deleted;
    }
  }
}

export default MapOfSets;