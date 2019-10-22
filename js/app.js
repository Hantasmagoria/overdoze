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
              case  2: this.collidePlatformRight    (touch, tileX + tileSize ); break;
              case  3: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize ); break;
              case  4: this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case  5: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case  6: if (this.collidePlatformRight(touch, tileX + tileSize )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case  7: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformRight(touch, tileX + tileSize )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case  8: this.collidePlatformLeft     (touch, tileX            ); break;
              case  9: if (this.collidePlatformTop  (touch, tileY            )) return;
                       this.collidePlatformLeft     (touch, tileX            ); break;
              case 10: if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize ); break;
              case 11: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformRight    (touch, tileX + tileSize ); break;
              case 12: if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case 13: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize); break;
              case 14: if (this.collidePlatformLeft (touch, tileX            )) return;
                       if (this.collidePlatformRight(touch, tileX + tileSize )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
              case 15: if (this.collidePlatformTop  (touch, tileY            )) return;
                       if (this.collidePlatformLeft (touch, tileX            )) return;
                       if (this.collidePlatformRight(touch, tileX + tileSize )) return;
                       this.collidePlatformBottom   (touch, tileY + tileSize ); break;
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
            //old animator class, currently defunct due to inheritance issues. Will put it back here when Javascript finally has multiple inheritance.
            /*class Animator {
              constructor(frameSet, delay){
                this.count = 0;
                this.delay = (delay>0)?delay:1;
                this.frameSet = frameSet;
                this.frameIndex = 0;
                this.frameValue = frameSet[0];
                this.mode = 'pause';
              }
              animate(){
                if (this.mode == 'loop') {
                  this.loop()
                }
              }
              changeFrameSet(frameSet, mode, delay=10, frameIndex=0){
                if (this.frameSet ===frameSet) {return;}
                this.count = 0;
                this.delay = delay;
                this.frameSet = frameSet;
                this.frameIndex = frameIndex;
                this.frameValue = frameSet[frameIndex];
                this.mode = mode;
              }
              loop(){
                this.count++;
                while (this.count>this.delay) {
                  this.count-=this.delay;
                  this.frameIndex = (this.frameIndex<this.frameSet.length)?this.frameIndex+1:0;
                  this.frameValue = this.frameSet[this.frameIndex];
                }
              }
            }
            */

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
          constructor(x, y, frameSet, delay) {
            super((x != undefined) ? x : 64,(y != undefined) ? y : 64,20,30);
            // TODO: figure out how multiple inheritance works in js. animation should be a different class, but player needs it as well.
            this.vCoefficient = 1; //adjusts speed.
            // this.color = '#000000';
            this.jumpState = true;
            this.bHop = 1.75;
            this.dX = -1;
            this.vX = 0;
            this.vY = 0;


            this.frameSets = {
              "idleLeft": [0],
              "jumpLeft": [1],
              "moveLeft": [2,3,4,5],
              "idleRight": [6],
              "jumpRight": [7],
              "moveRight": [8,9,10,11],
            }
            //animator pseudoclass below, refer to comment @ line #127.
            this.count = 0;
            this.delay = (delay>0)?delay:1;
            this.frameSet = this.frameSets[frameSet];
            this.frameIndex = 0;
            this.frameValue = this.frameSet[0];
            this.mode = 'pause';
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
            this.dX = -1;
            this.vX -= 0.65 * this.vCoefficient
          }
          moveRight(frameSet) {
            this.dX = 1
            this.vX += 0.65 * this.vCoefficient
          }

          //this updates the animation according to movement. external reference: "player.updateAnimation"
          stepShow() {
            if (this.vY<0) {
              if (this.dX<0){
                this.changeFrameSet(this.frameSets.jumpLeft, 'pause')
              }else {
                this.changeFrameSet(this.frameSets.jumpRight, 'pause')
              }
            }else if (this.dX<0) {
              if (this.vX<-0.3) {
                this.changeFrameSet(this.frameSets.moveLeft, 'loop', 5)
              }else {
                this.changeFrameSet(this.frameSets.idleLeft, 'pause', 5)
              }
            }else if (this.dX>0) {
              if (this.vX>0.3) {
                this.changeFrameSet(this.frameSets.moveRight, 'loop', 5)
              }else {
                this.changeFrameSet(this.frameSets.idleRight, 'pause', 5)
              }
            }
            this.animate();
          }
          //this updates the position accoding to the speed. external reference: "player.updatePosition"
          stepThrough(gravity, resistance) {
            this.oldX = this.posX;
            this.oldY = this.posY;
            this.vY   += gravity;
            this.vX *= resistance;      //aerial resistance OR ground friction is decided before passing arg.
            this.posX += this.vX;
            this.posY += this.vY;
          }
          animate(){
            // console.log("animation called");
            if (this.mode == 'loop') {
              this.loop()
            }
          }
          changeFrameSet(frameSet, mode, delay=10, frameIndex=0){
            if (this.frameSet ===frameSet) {return;}
            this.count = 0;
            this.delay = delay;
            this.frameSet = frameSet;
            this.frameIndex = frameIndex;
            this.frameValue = frameSet[frameIndex];
            this.mode = mode;
          }
          loop(){
            this.count++;
            while (this.count>this.delay) {
              this.count-=this.delay;
              this.frameIndex = (this.frameIndex<this.frameSet.length-1)?this.frameIndex+1:0;
              this.frameValue = this.frameSet[this.frameIndex];
            }
          }
        }
        class Tilesheet {
          constructor(tileSize, columns) {
            class Frame {
              constructor(x,y,width,height,offX,offY) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
                this.offX = offX;
                this.offY = offY;
              }
            }
            this.tileSize = tileSize;
            this.columns = columns;

            //tile frame data:
            /*
            31 = idleRight
            32 = moveRight
            33 ''
            34 ''
            35 '', jumpRight

            36 = idleLeft
            37 = moveLeft
            38 ''
            39 ''
            40 '', jumpLeft
            */

            //calculation is done by pixel:
            //tile coordinates => (x-axis = (tile%9)*32), (y-axis = floor(tile/9)*32)

            this.frames = [new Frame(256,96,32,32,0,-1),
                          new Frame(96,128,32,32,0,-1),
                          new Frame(96,128,32,32,0,-1),new Frame(0,128,32,32,0,-1),new Frame(32,128,32,32,0,-1),new Frame(64,128,32,32,0,-1),
                          new Frame(96,96,32,32,0,-1),
                          new Frame(224,96,32,32,0,-1),
                          new Frame(224,96,32,32,0,-1),new Frame(128,96,32,32,0,-1),new Frame(160,96,32,32,0,-1),new Frame(192,96,32,32,0,-1)];
          }
        }

        this.tileSheet = new Tilesheet(32,9);//Tile Sheet has a tile size of 32 and has 9 rows currently.
        this.player = new Player(2*32,22*32,"idleLeft");

        this.bgColor = /*'rgba(40,48,56,0.25)'*/ "#9cd7f0";
        this.friction = 0.9; //ice = 1.001
        this.resistance = 0.96;
        this.gravity = 0.69;
        this.hadron = new Collider();

        // hardcoded map data for now.
        this.columns = 40;
        this.rows = 25;
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

        this.height = this.tileSheet.tileSize * this.rows;
        this.width = this.tileSheet.tileSize * this.columns;

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

        //all else is for other physical boundaries, like floor, ceiling, sides.
        let bottom, left, right, top, value;
        top    = Math.floor(touch.getTop()    / this.tileSheet.tileSize);
        left   = Math.floor(touch.getLeft()   / this.tileSheet.tileSize);
        value  = this.cMap[top * this.columns + left];
        this.hadron.collide(value, touch, left * this.tileSheet.tileSize, top * this.tileSheet.tileSize, this.tileSheet.tileSize);

        top    = Math.floor(touch.getTop()    / this.tileSheet.tileSize);
        right  = Math.floor(touch.getRight()  / this.tileSheet.tileSize);
        value  = this.cMap[top * this.columns + right];
        this.hadron.collide(value, touch, right * this.tileSheet.tileSize, top * this.tileSheet.tileSize, this.tileSheet.tileSize);

        bottom = Math.floor(touch.getBot() / this.tileSheet.tileSize);
        left   = Math.floor(touch.getLeft()   / this.tileSheet.tileSize);
        value  = this.cMap[bottom * this.columns + left];
        this.hadron.collide(value, touch, left * this.tileSheet.tileSize, bottom * this.tileSheet.tileSize, this.tileSheet.tileSize);


        bottom = Math.floor(touch.getBot() / this.tileSheet.tileSize);
        right  = Math.floor(touch.getRight()  / this.tileSheet.tileSize);
        value  = this.cMap[bottom * this.columns + right];
        this.hadron.collide(value, touch, right * this.tileSheet.tileSize, bottom * this.tileSheet.tileSize, this.tileSheet.tileSize);

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
        //defunct
        // this.player.vY += this.gravity;
        //this.player.vX *= (!this.player.jumpState) ? this.friction : this.resistance;
        this.player.stepThrough(this.gravity,(!this.player.jumpState) ? this.friction : this.resistance);

        //below commented out because vertical air resistance won't be introduced in this game.
        //but leaving this here just in case physics screw up again.
        // this.player.vY *= this.friction;

        this.collision(this.player);

        this.player.stepShow();
      }
    }
    //A WHOOOOOLE NEEEEW WOOOOORLD~
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









//below is just some game design stuff where I actually think about:
// -the storyline,
// -level design,
// -audio cues,
// -background music,
// -color themes,
// -user experience,
// -voiceovers,
//-etc.

/*
Players
Objectives
Procedures
Rules
Resources
*/
