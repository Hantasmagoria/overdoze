//display stuff go here.

// console.log("view.js linked.");



class View {
  constructor(gameArea) {
    this.buffer  = document.createElement("canvas").getContext("2d"),
    this.context = gameArea.getContext("2d");
  }
  hitBox(x,y,width,height,fill) {
    this.buffer.fillStyle = fill;
    this.buffer.fillRect(Math.floor(x),Math.floor(y),width,height);
  }
  backgroundColor(color) {
    this.buffer.fillStyle = color;
    this.buffer.fillRect(0,0,this.buffer.canvas.width,this.buffer.canvas.height);
  }
  visualize() {
    this.backgroundColor( game.world.bgColor);
    this.hitBox( game.world.player.posX, game.world.player.posY, game.world.player.width, game.world.player.height, game.world.player.color);
    this.display();
  }
  display() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height)
  }
  resize(aspect) {
    console.log(`${this.context.canvas.width}x${this.context.canvas.height}`,);
    // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
    if (((document.documentElement.clientHeight-32)/(document.documentElement.clientWidth-32) > aspect)?true:false) {
      this.context.canvas.width = (document.documentElement.clientWidth-32);
      this.context.canvas.height = (document.documentElement.clientWidth-32)*(aspect);
    }else {
      this.context.canvas.width = (document.documentElement.clientHeight-32)/(aspect);
      this.context.canvas.height = (document.documentElement.clientHeight-32);
    }
    this.display();
  }
  //// OLD resize method
  // resize() {
  //   console.log(`${this.context.canvas.width}x${this.context.canvas.height}`);
  //   // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
  //   this.context.canvas.width = document.documentElement.clientWidth - 32;
  //   this.context.canvas.height = document.documentElement.clientHeight - 32;
  //   this.display();
  // }
  static createCanvas(){
    document.getElementsByTagName('main')[0].innerHTML = `<canvas id="gameArea"></canvas>`;
    // console.log("created canvas.");
  }
  openEyes(){
    window.addEventListener('resize',(e)=>{ Labyrinth.resize(e)});
  }
}
