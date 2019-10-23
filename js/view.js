//display stuff go here.


//contains screen resize events
//also manages the canvas graphical rendering and buffering.
class View {
  constructor(gameArea) {
    this.buffer  = document.createElement("canvas").getContext("2d"),
    this.context = gameArea.getContext("2d");

  }


  //NOTE: Draws the world graphics from bottom-right to top-left.
  //watch out for map visual bugs here.
  drawMap(tSimage, columns, map, tScolumns, tileSize) {
    for (let i = map.length; i >=0 ; i--) {
      let val = map[i];
      let srcX = (val % columns) * tileSize;
      let srcY = Math.floor(val / columns) * tileSize;
      let destX = (i % tScolumns) * tileSize;
      let destY = Math.floor(i / tScolumns) * tileSize;

      this.buffer.drawImage(tSimage, srcX, srcY, tileSize, tileSize, destX, destY, tileSize, tileSize)
    }
  }


  //draws in images in logical boxes into the buffer.
  hitBox(image, srcX, srcY, destX, destY, width, height) {
    //old/defunct method. reference: external "drawPlayer"
    // this.buffer.fillStyle = fill;
    // this.buffer.fillRect(Math.round(x),Math.round(y),width,height);
    this.buffer.drawImage(image, srcX, srcY, width, height, Math.round(destX), Math.round(destY), width, height)
  }

  //draws background. might want to use background image instead later on.
  backgroundColor(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,0,this.buffer.canvas.width,this.buffer.canvas.height);
  }

  //this pushes the drawn image from the buffer to the live display. reference: "render"
  display() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height)
  }

  //the resize method.
  resize(aspect) {
    // console.log(`${this.context.canvas.width}x${this.context.canvas.height}`,);
    // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
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
    window.addEventListener('resize',(e)=>{ Labyrinth.resize(e,game.world.height/ game.world.width)});
  }
}
