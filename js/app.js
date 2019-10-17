//game logic go here.

// console.log("app.js linked.");

class Game {
  constructor() {
    class Player {
      constructor(x,y) {
        this.color      = '#000000';
        this.height     = 16;
        this.width      = 4;
        this.jumpState  = false;
        this.vX         = 0;
        this.vY         = 0;
        this.posX       = (x!=undefined)?x:50;
        this.posY       = (y!=undefined)?y:50;
      }
      jump(){
        if (!this.jumpState) {
          this.jumpState = true;
          this.vY -=30;
        }
      }
      moveLeft(){this.vX -=0.75}
      moveRight(){this.vX +=0.75}
      stepThrough(){
<<<<<<< HEAD
        this.posX += this.vX;
        this.posY += this.vY;
=======
        this.x += this.vX;
        this.y += this.vY;
>>>>>>> 24b7e9653a04feeb6cb15daee422d41ed7ecffb0
      }
    }
    this.world = {
      'bgColor':/*'rgba(40,48,56,0.25)'*/"#87CEEB",
      'friction':0.9,
      'gravity':1.44,
      'player':new Player(),
      'height':72,
      'width':128,
      'collision': function(touch) {
        if (touch.posX < 0) { touch.posX = 0; touch.vX = 0; }
        else if (touch.posX + touch.width > this.width) { touch.posX = this.width - touch.width; touch.vX = 0; }
        if (touch.posY < 0) { touch.posY = 0; touch.vY = 0; }
<<<<<<< HEAD
        else if (touch.posY + touch.height > this.height) { touch.jumpState = false; touch.posY = this.height - touch.height; touch.vY = 0; }
=======
        else if (touch.posY + touch.height > this.height) { touch.jumping = false; touch.posY = this.height - touch.height; touch.vY = 0; }
>>>>>>> 24b7e9653a04feeb6cb15daee422d41ed7ecffb0
      },
      'update': function() {
        this.player.vY += this.gravity;
        this.player.stepThrough();

        this.player.vX *= this.friction;
        this.player.vY *= this.friction;

        this.collision(this.player);
      }
    };
  }
  update(){this.world.update()}
  mov(){
    if (controller.left.active) {
<<<<<<< HEAD
      // console.log("Moving left");
      game.world.player.moveLeft();
    }
    if (controller.right.active) {
      // console.log("Moving right");
      game.world.player.moveRight();
    }
    if (controller.up.active) {
      // console.log("Jumping");
=======
      game.world.player.moveLeft();
    }
    if (controller.right.active) {
      game.world.player.moveRight();
    }
    if (controller.up.active) {
>>>>>>> 24b7e9653a04feeb6cb15daee422d41ed7ecffb0
      game.world.player.jump();
    }
    this.update();
  }
}

class Gear {
  constructor(fps) {
    this.elapsedTime = 0;
    this.animationFrameRequest = undefined;
    this.time = undefined;
    this.timeStep = 1000/fps;
    this.updated = false;
    this.run = (timestamp)=>{this.revolution(timestamp)};
  }
  update(){Labyrinth.update()}
  render(){Labyrinth.render()}
  revolution(timestamp){
    this.elapsedTime += (timestamp) - this.time;
    this.time = timestamp;
    if (this.elapsedTime >= this.timeStep*3) {
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
  start(){
    this.elapsedTime = this.timeStep;
    this.time = window.performance.now();
    this.animationFrameRequest = window.requestAnimationFrame(this.run);
  }
  stop(){
    window.cancelAnimationFrame(this.animationFrameRequest);
  }
}
//Players
//Objectives
//Procedures
//Rules
//Resources
