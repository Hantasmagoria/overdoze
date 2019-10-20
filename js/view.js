//display stuff go here.


//contains screen resize events
//also manages the canvas graphical rendering and buffering.
class View {
  constructor(gameArea) {
    class Tilesheet {
      constructor(tileSize, columns) {
        this.image = new Image();
        this.tileSize = tileSize;
        this.columns = columns;
      }
    }
    this.buffer  = document.createElement("canvas").getContext("2d"),
    this.context = gameArea.getContext("2d");

    this.tileSheet = new Tilesheet(32,9);
  }

  drawMap(map, columns) {
    for (let i = map.length; i >=0 ; i--) {
      let val = map[i];
      let srcX = (val % this.tileSheet.columns) * this.tileSheet.tileSize;
      let srcY = Math.floor(val / this.tileSheet.columns) * this.tileSheet.tileSize;
      let destX = (i % columns) * this.tileSheet.tileSize;
      let destY = Math.floor(i / columns) * this.tileSheet.tileSize;

      this.buffer.drawImage(this.tileSheet.image, srcX, srcY, this.tileSheet.tileSize, this.tileSheet.tileSize, destX, destY, this.tileSheet.tileSize, this.tileSheet.tileSize)
    }
  }

  //draws boxes. generally for player box model for now.
  //commented out is a new function meant to replace the current function with coordinate mappings more adaptable for when sprite sheet is done.
  hitBox(x,y,width,height,fill) {
    this.buffer.fillStyle = fill;
    this.buffer.fillRect(Math.round(x),Math.round(y),width,height);
    // this.buffer.fillStyle = color1;
    // this.buffer.fillRect(Math.floor(rectangle.x), Math.floor(rectangle.y), rectangle.width, rectangle.height);
    // this.buffer.fillStyle = color2;
    // this.buffer.fillRect(Math.floor(rectangle.x + 2), Math.floor(rectangle.y + 2), rectangle.width - 4, rectangle.height - 4);
  }

  //draws background. might want to use background image instead later on.
  backgroundColor(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,0,this.buffer.canvas.width,this.buffer.canvas.height);
  }

  //culmination of above two methods. then renders it to canvas live.
  visualize() {
    this.backgroundColor( game.world.bgColor);
    this.drawMap(game.world.map, game.world.columns);
    this.hitBox( game.world.player.posX, game.world.player.posY, game.world.player.width, game.world.player.height, game.world.player.color);
    this.display();
  }

  //this pushes the drawn image from the buffer to the live display.
  display() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height)
  }

  //the resize method.
  resize(aspect) {
    // console.log(`${this.context.canvas.width}x${this.context.canvas.height}`,);
    console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
    if (((document.documentElement.clientHeight-32)/(document.documentElement.clientWidth-32) > aspect)?true:false) {
      this.context.canvas.width = (document.documentElement.clientWidth-32);
      this.context.canvas.height = (document.documentElement.clientWidth-32)*(aspect);
    }else {
      this.context.canvas.width = (document.documentElement.clientHeight-32)/(aspect);
      this.context.canvas.height = (document.documentElement.clientHeight-32);
    }
    this.display();

    this.context.imageSmoothingEnabled = false;
  }
  //// OLD resize method(defunct)
// resize() {
//     console.log(`${this.context.canvas.width}x${this.context.canvas.height}`);
//     // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
//     this.context.canvas.width = document.documentElement.clientWidth - 32;
//     this.context.canvas.height = document.documentElement.clientHeight - 32;
//     this.display();
//   }

  //because we need to actually have a canvas.
  static createCanvas(){
    document.getElementsByTagName('main')[0].innerHTML = `<canvas id="gameArea"></canvas>`;
    // console.log("created canvas.");
  }

  //event listener for resizing.
  openEyes(){
    // console.log("eyes Open!");
    window.addEventListener('resize',(e)=>{ Labyrinth.resize(e)});
  }
}
