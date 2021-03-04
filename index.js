import World from "./src/World.js";
import Entity from "./src/Entity.js";
import Component from "./src/Component.js";
import Keyboard from "./Keyboard.js";
const keyboard = new Keyboard();

const world = new World();
world.start();
window.world = world;

window.Entity = Entity;
window.Component = Component;


class KeyboardSystem extends Component {
  earlyUpdate() {
    keyboard.update();
  }

  unload() {
    keyboard.destroy();
  }
}
new KeyboardSystem(new Entity(world));


class Player extends Component {
  load() {
    console.log("fuck yea")
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.left = "0px";
    this.div.style.top = "0px";
    this.div.style.width = "50px";
    this.div.style.height = "50px";
    this.div.style.backgroundColor = "black";
    this.x = 0;
    this.y = 0;
    document.getElementsByTagName("body")[0].appendChild(this.div);
  }

  update(deltaT) {
    const speed = 50;

    const directionVector = [0, 0];
    if (keyboard.isHeld("ArrowUp")) directionVector[1]--;
    if (keyboard.isHeld("ArrowLeft")) directionVector[0]--;
    if (keyboard.isHeld("ArrowDown")) directionVector[1]++;
    if (keyboard.isHeld("ArrowRight")) directionVector[0]++;

    this.x += directionVector[0] * speed * deltaT;
    this.y += directionVector[1] * speed * deltaT;
  }

  draw() {
    this.div.style.left = this.x + "px";
    this.div.style.top = this.y + "px";
  }

  unload() {
    this.div.remove();
  }
}
new Player(new Entity(world));