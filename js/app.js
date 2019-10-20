//game logic go here.

//the Gear class is essentially a game engine utilizing a fixed time step game loop. This game loop is known to be universally applicable(across all game genres), updating at the same uniform rate across different devices.
class Gear {
  constructor(fps) {
    this.elapsedTime = 0; //time since last update.
    this.animationFrameRequest = undefined;
    this.time = undefined;
    this.timeStep = 1000 / fps; //sets the rate of update revolving around the idea of 'fps', or Frames per Second.
    this.updated = false;
    this.run = (timestamp) => {
      this.revolution(timestamp)
    };
  }
  update() {
    Labyrinth.update()
  }
  render() {
    Labyrinth.render()
  }

  //gameloop cycle
  revolution(timestamp) {
    this.elapsedTime += (timestamp) - this.time;
    this.time = timestamp;

    //catch slow devices from overloading the cpu;
    //dont allow 3 frames to pass without update.
    if (this.elapsedTime >= this.timeStep * 3) {
      this.elapsedTime = this.timeStep;
    }
    while (this.elapsedTime >= this.timeStep) {
      this.elapsedTime -= this.timeStep;
      this.update(timestamp);
      this.updated = true;
    }
    if (this.updated) {
      this.updated = false;
      this.render(timestamp);
    }
    this.animationFrameRequest = window.requestAnimationFrame(this.run);
  }
  start() {
    this.elapsedTime = this.timeStep;
    this.time = window.performance.now();
    this.animationFrameRequest = window.requestAnimationFrame(this.run);
  }
  stop() {
    window.cancelAnimationFrame(this.animationFrameRequest);
  }
}

//the Game class handles all the game logic that has to do with the context of the game itself. I kid you not, this one class can and will go on for a few hundred more lines. had to split this up into multiple sub-classes(nested classes), because
class Game {
  constructor() {
    class Player {
      constructor(x, y) {
        this.vCoefficient = 1; //adjusts speed.
        this.color = '#000000';
        this.height = 30;
        this.width = 20;
        this.jumpState = true;
        this.bHop = 1.75;
        this.vX = 0;
        this.vY = 0;
        this.posX = (x != undefined) ? x : 50;
        this.posY = (y != undefined) ? y : 50;
      }
      jump() {
        if (!this.jumpState) {
          this.jumpState = true;
          this.vX *= (this.vX == 0) ? 0 : this.bHop; //bunnyhop
          this.vY -= 15;
        }
      }
      dive() {
        if (this.jumpState) {
          this.jumpState = false;
          this.vY += 20 / this.vCoefficient;
        }
      }
      moveLeft() {
        this.vX -= 0.65 * this.vCoefficient
      }
      moveRight() {
        this.vX += 0.65 * this.vCoefficient
      }
      //this updates the position accoding to the speed.
      stepThrough() {
        this.posX += this.vX;
        this.posY += this.vY;
      }
    }
    class World {
      constructor(friction, gravity) {
        this.bgColor = /*'rgba(40,48,56,0.25)'*/ "#9cd7f0";
        this.friction = 0.9; //ice = 1.001
        this.resistance = 0.96;
        this.gravity = 0.69;
        this.player = new Player();


        // hardcoded map data.
        this.columns = 40;
        this.rows = 25;
        this.tile_size = 32;
        this.map = [9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,18,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,19,0,0,19,19,0,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,19,0,0,19,19,0,0,0,0,0,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,19,0,0,19,19,19,19,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,19,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,0,20,18,0,0,19,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,0,20,18,0,0,19,19,0,19,0,19,19,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,0,0,0,0,0,0,20,18,0,0,19,0,0,19,0,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,19,19,19,20,18,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,20,18,0,0,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,20,18,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,20,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,0,19,19,0,0,20,18,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,20,18,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,0,0,20,18,0,0,19,19,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,0,20,18,0,0,19,19,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,19,20,18,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,20,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,20,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,20,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29];

        this.height = this.tile_size * this.rows;
        this.width = this.tile_size * this.columns;

        //  // old game size
        // this.height = 800;
        // this.width = 1280;
      }
      collision(touch) {
        if (touch.posX < 0) {
          touch.posX = 0;
          touch.vX = 0;
        } else if (touch.posX + touch.width > this.width) {
          touch.posX = this.width - touch.width;
          touch.vX = 0;
        }
        if (touch.posY < 0) {
          touch.posY = 0;
          touch.vY = 0;
        } else if (touch.posY + touch.height > this.height) {
          touch.jumpState = false;
          touch.posY = this.height - touch.height;
          touch.vY = 0;
        }
      }
      update() {
        this.player.vY += this.gravity;
        this.player.stepThrough();

        this.player.vX *= (!this.player.jumpState) ? this.friction : this.resistance;
        //below commented out because vertical air resistance won't be introduced in this game.
        //but leaving this here just in case physics screw up again.
        // this.player.vY *= this.friction;

        this.collision(this.player);
      }
    }
    this.world = new World()
  }
  update() {
    this.world.update()
  }
  mov() {
    if (controller.left.active) {
      // console.log("Moving left");
      game.world.player.moveLeft();
    }
    if (controller.right.active) {
      // console.log("Moving right");
      game.world.player.moveRight();
    }
    if (controller.up.active) {
      // console.log("Jumping");
      game.world.player.jump();
    }
    if (controller.down.active) {
      game.world.player.dive();
    }
    this.update();
  }
}

//Players
//Objectives
//Procedures
//Rules
//Resources
