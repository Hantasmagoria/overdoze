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
    class World {
      constructor(friction, gravity) {
        class Collider{
          collide(val, touch, tileX, tileY, tileSize){//this was so painful...
            switch(val) {
              case  1: this.collidePlatformTop      (touch, tileY            ); break;
              case  2: this.collidePlatformRight    (touch, tileX + tileSize); break;
              case  3: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize); break;
              case  4: this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case  5: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case  6: if (this.collidePlatformRight(touch, tileX + tileSize)) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case  7: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformRight(touch, tileX + tileSize)) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case  8: this.collidePlatformLeft     (touch, tileX            ); break;
              case  9: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformLeft     (touch, tileX            ); break;
              case 10: if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize); break;
              case 11: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize); break;
              case 12: if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case 13: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case 14: if (this.collidePlatformLeft (touch, tileX            )) return;
                       if (this.collidePlatformRight(touch, tileX            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case 15: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       if (this.collidePlatformRight(touch, tileX + tileSize)) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
            }
          }
          collidePlatformBottom(touch, bottomOfTile){
            if (touch.getTop() < bottomOfTile && touch.getOldTop() >= bottomOfTile) {
            touch.setTop(bottomOfTile); // Move the top of the object to the bottom of the tile.
            touch.vY = 0;
            return true;  //collision detected.
            } return false;   //no collision.
          }
          collidePlatformLeft(touch, leftOfTile) {
            if (touch.getRight() > leftOfTile && touch.getOldRight() <= leftOfTile) {
              touch.setRight(leftOfTile - 0.01);
              touch.vX = 0;
              return true;  //collision detected.
            } return false;
          }
          collidePlatformRight(touch, rightOfTile) {
            if (touch.getLeft() < rightOfTile && touch.getOldLeft() >= rightOfTile) {
              touch.setLeft(rightOfTile);
              touch.vX = 0;
              return true;  //collision detected.
            } return false;
          }
          collidePlatformTop(touch, topOfTile) {
            if (touch.getBot() > topOfTile && touch.getOldBot() <= topOfTile) {
              touch.setBot(topOfTile - 0.01);
              touch.vY = 0;
              touch.jumpState = false;
              return true;  //collision detected.
            } return false;
          }
        }
        class Object{
          constructor(x,y,width,height){
            this.height = height;
            this.width = width;
            this.posX = x;
            this.oldX = x;
            this.posY = y;
            this.oldY = y;
          }
          getBot()  { return this.posY + this.height;}
          getLeft()  { return this.posX;}
          getRight()  { return this.posX + this.width;}
          getTop()  { return this.posY;}
          getOldBot()  { return this.oldY + this.height;}
          getOldLeft()  { return this.oldX;}
          getOldRight()  { return this.oldX + this.width;}
          getOldTop()  { return this.oldY}
          setBot(y) { this.posY = y - this.height;}
          setLeft(x) { this.posX = x;}
          setRight(x) { this.posX = x - this.width;}
          setTop(y) { this.posY = y;}
          setOldBot(y) { this.oldY = y - this.height;}
          setOldLeft(x) { this.oldX = x;}
          setOldRight(x) { this.oldX = x - this.width;}
          setOldTop(y) { this.oldY = y;}
        }
        class Player extends Object {
          constructor(x, y) {
            super((x != undefined) ? x : 50,(y != undefined) ? y : 50,20,30);
            this.vCoefficient = 1; //adjusts speed.
            this.color = '#000000';
            this.jumpState = true;
            this.bHop = 1.75;
            this.vX = 0;
            this.vY = 0;
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
            this.oldX = this.posX;
            this.oldY = this.posY;
            this.posX += this.vX;
            this.posY += this.vY;
          }
        }

        this.bgColor = /*'rgba(40,48,56,0.25)'*/ "#9cd7f0";
        this.friction = 0.9; //ice = 1.001
        this.resistance = 0.96;
        this.gravity = 0.69;
        this.player = new Player();
        this.hadron = new Collider();

        // hardcoded map data.
        this.columns = 40;
        this.rows = 25;
        this.tileSize = 32;
        this.map = [9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,11,
        18,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,19,0,0,19,19,0,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,19,0,0,19,19,0,0,0,0,0,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,19,0,0,19,19,19,19,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,19,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,0,20,
        18,0,0,19,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,0,20,
        18,0,0,19,19,0,19,0,19,19,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,0,0,0,0,0,0,20,
        18,0,0,19,0,0,19,0,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,19,19,19,20,
        18,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,20,
        18,0,0,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,0,0,0,20,
        18,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,20,
        18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,0,19,19,0,0,20,
        18,0,0,0,0,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,0,20,
        18,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,19,19,19,0,0,20,
        18,0,0,19,19,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,0,20,
        18,0,0,19,19,0,0,0,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,19,19,19,0,19,20,
        18,0,0,19,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,20,
        18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,0,0,0,0,0,19,19,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,20,
        18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,19,0,20,
        18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,
        27,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,29];


        //collision map done in binary using the chart below:
        // 0000 = 0  tile 0:    0    tile 1:   1     tile 2:    0    tile 15:    1
        // 0001 = 1           0   0          0   0            0   1            1   1
        // 0010 = 2             0              0                0                1
        // 1111 = 15        No walls     Wall on top      Wall on Right      four walls

        this.cMap = [15,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,15,
        2,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,15,0,0,15,15,0,0,0,0,0,0,0,0,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,15,0,0,15,15,0,0,0,0,0,0,0,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,15,0,0,15,15,15,15,0,0,0,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,15,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,0,0,0,8,
        2,0,0,15,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,0,0,8,
        2,0,0,15,15,0,15,0,15,15,0,0,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,0,0,0,0,0,0,8,
        2,0,0,15,0,0,15,0,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,15,15,15,8,
        2,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,8,
        2,0,0,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,0,0,0,0,0,8,
        2,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,0,0,0,0,0,0,8,
        2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,0,15,15,0,0,8,
        2,0,0,0,0,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,0,0,8,
        2,0,0,0,0,0,0,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,15,15,15,0,0,8,
        2,0,0,15,15,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,0,0,8,
        2,0,0,15,15,0,0,0,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,15,15,15,0,15,8,
        2,0,0,15,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,8,
        2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,0,0,0,0,0,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,0,0,0,0,0,15,15,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,0,8,
        2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,15,15,0,8,
        2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,
        15,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,15];

        this.height = this.tileSize * this.rows;
        this.width = this.tileSize * this.columns;

        //  // old game size
        // this.height = 800;
        // this.width = 1280;
      }
      collision(touch) {
        //This bunch of code meant for world boundaries.
        if (touch.getLeft() < 0) {
          touch.setLeft(0);
          touch.vX = 0;
        } else if (touch.getRight() > this.width) {
          touch.setright(this.width);
          touch.vX = 0;
        }
        if (touch.getTop() < 0) {
          touch.setTop(0);
          touch.vY = 0;
        } else if (touch.getBot() > this.height) {
          touch.setBot(this.height);
          touch.vY = 0;
        }

        //all else is for other physical boundaries.
        let bottom, left, right, top, value;
        top    = Math.floor(touch.getTop()    / this.tileSize);
        left   = Math.floor(touch.getLeft()   / this.tileSize);
        value  = this.cMap[top * this.columns + left];
        this.hadron.collide(value, touch, left * this.tileSize, top * this.tileSize, this.tileSize);

        top    = Math.floor(touch.getTop()    / this.tileSize);
        right  = Math.floor(touch.getRight()  / this.tileSize);
        value  = this.cMap[top * this.columns + right];
        this.hadron.collide(value, touch, right * this.tileSize, top * this.tileSize, this.tileSize);

        bottom = Math.floor(touch.getBot() / this.tileSize);
        left   = Math.floor(touch.getLeft()   / this.tileSize);
        value  = this.cMap[bottom * this.columns + left];
        this.hadron.collide(value, touch, left * this.tileSize, bottom * this.tileSize, this.tileSize);


        bottom = Math.floor(touch.getBot() / this.tileSize);
        right  = Math.floor(touch.getRight()  / this.tileSize);
        value  = this.cMap[bottom * this.columns + right];
        this.hadron.collide(value, touch, right * this.tileSize, bottom * this.tileSize, this.tileSize);

      }
      ////old collision method in case I screw up again.
      // collision(touch) {
      //   if (touch.posX < 0) {
      //     touch.posX = 0;
      //     touch.vX = 0;
      //   } else if (touch.posX + touch.width > this.width) {
      //     touch.posX = this.width - touch.width;
      //     touch.vX = 0;
      //   }
      //   if (touch.posY < 0) {
      //     touch.posY = 0;
      //     touch.vY = 0;
      //   } else if (touch.posY + touch.height > this.height) {
      //     touch.jumpState = false;
      //     touch.posY = this.height - touch.height;
      //     touch.vY = 0;
      //   }
      // }
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
