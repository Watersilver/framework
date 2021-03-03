import sharedPrivateData from "./sharedPrivateData.js";
import Entity from "./Entity.js";
import Component from "./Component.js";

class World {
  constructor(max_dt = 0.02, maxTimesBiggerThanMaxDt = 10) {
    // this._shared = sharedPrivateData.getWorldData(this);

    this.max_dt = max_dt;
    this.maxTimesBiggerThanMaxDt = maxTimesBiggerThanMaxDt;

    this.entities = new Set(); // All existing entities
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