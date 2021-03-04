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

  static unique = true;

  load() {
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.left = "0px";
    this.div.style.top = "0px";
    this.div.style.width = "50px";
    this.div.style.height = "50px";
    this.div.style.backgroundColor = "black";
    document.getElementsByTagName("body")[0].appendChild(this.div);
  }

  onAdd(x = 0, y = 0) {
    this.x = x;
    this.y = y;
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

    if (keyboard.isHeld("Delete")) this.entity.remove();
  }

  draw() {
    this.div.style.left = this.x + "px";
    this.div.style.top = this.y + "px";
  }

  unload() {
    this.div.remove();
  }
}

class PlayaIndex extends Component {
  static requires = Player;

  load() {
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.left = "0px";
    this.div.style.top = "0px";
    this.div.style.width = "50px";
    this.div.style.height = "10px";
    this.div.style.backgroundColor = "red";
    document.getElementsByTagName("body")[0].appendChild(this.div);
    
    console.log(this.entity.getComponent(Player));
  }

  unload() {
    this.div.remove();
  }

  draw() {
    const plcomp = this.entity.getComponent(Player)
    this.div.style.left = plcomp.x + "px";
    this.div.style.top = plcomp.y + "px";
  }
}

document.addEventListener("click", () => {
  const playa = new Entity(world);
  new PlayaIndex(playa);
  new Player(playa);
  new Player(playa);
  new PlayaIndex(playa);
  new PlayaIndex(playa);
  new PlayaIndex(playa);
});
