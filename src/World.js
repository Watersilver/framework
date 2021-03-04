import sharedPrivateData from "./sharedPrivateData.js";
import Entity from "./Entity.js";
import Component from "./Component.js";

const callbackNames = [
  "earlyUpdate", "calculus",
  "update", "draw"
]

class ComponentsIterationTree {
  constructor() {
    for (const callbackName of callbackNames) {
      this[callbackName] = new Set();
    }
  }

  add(component) {
    for (const callbackName of callbackNames) {
      if (component[callbackName]) this[callbackName].add(component);
    }
  }

  delete(component) {
    for (const callbackName of callbackNames) {
      if (component[callbackName]) this[callbackName].delete(component);
    }
  }
}

class World {
  constructor(max_dt = 0.02, maxTimesBiggerThanMaxDt = 10) {
    // this._shared = sharedPrivateData.getWorldData(this);

    this.max_dt = max_dt;
    this.maxTimesBiggerThanMaxDt = maxTimesBiggerThanMaxDt;

    this.entities = new Set(); // All existing entities
    this.components = new ComponentsIterationTree();
  }

  _earlyUpdate(deltaT, now, before) {
    for (const component of this.components.earlyUpdate) {
      component.earlyUpdate(deltaT, now, before);
    }
  }

  _calculus(deltaT) {
    const iterations = Math.ceil(deltaT / this.max_dt);
    const dt = deltaT / iterations;

    for (let i = 0; i < iterations; i++) {
      for (const component of this.components.calculus) {
        component.calculus(dt);
      }
    }
  }

  _update(deltaT, now, before) {
    for (const component of this.components.update) {
      component.update(deltaT, now, before);
    }
  }

  _draw(deltaT, now, before) {
    for (const component of this.components.draw) {
      component.draw(deltaT, now, before);
    }
  }

  start() {
    // restart
    this.stop();

    let usedDivRealDeltaT = 1;

    let updateBefore = performance.now();
    this._updateId = setInterval(() => {

      const updateNow = performance.now();
      let deltaT = (updateNow - updateBefore) * 0.001;
      usedDivRealDeltaT = 1;

      // If deltaT is too big, induce slowdown to avoid strain.
      if (deltaT > this.maxTimesBiggerThanMaxDt * this.max_dt) {
        const newDeltaT = this.maxTimesBiggerThanMaxDt * this.max_dt;
        usedDivRealDeltaT = newDeltaT / deltaT;
        deltaT = newDeltaT;
      };

      this._earlyUpdate(deltaT, updateNow, updateBefore);

      this._calculus(deltaT);

      this._update(deltaT, updateNow, updateBefore);

      updateBefore = updateNow;
    });

    let drawBefore = performance.now();
    const draw = drawNow => {
      const deltaT = (drawNow - drawBefore) * 0.001 * usedDivRealDeltaT;

      this._draw(deltaT, drawNow, drawBefore);

      drawBefore = drawNow;
      this._drawId = requestAnimationFrame(draw);
    };
    this._drawId = requestAnimationFrame(draw);
  }

  stop() {
    clearInterval(this._updateId);
    cancelAnimationFrame(this._drawId);
    delete this._updateId;
    delete this._drawId;
  }
}

export default World;