//display stuff go here.

// console.log("view.js linked.");



class View {
  constructor(gameArea) {
    this.buffer  = document.createElement("canvas").getContext("2d"),
    this.context = gameArea.getContext("2d");
  }
  display() {
    this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height)
  }
  resize() {
    console.log(`${this.context.canvas.width}x${this.context.canvas.height}`);
    // console.log(document.documentElement.clientHeight,document.documentElement.clientWidth);
    this.context.canvas.width = document.documentElement.clientWidth - 32;
    this.context.canvas.height = document.documentElement.clientHeight - 32;
    this.display();
  }
  static createCanvas(){
    document.getElementsByTagName('main')[0].innerHTML = `<canvas id="gameArea"></canvas>`;
    // console.log("created canvas.");
  }
  openEyes(){
    window.addEventListener('resize',(e)=>{this.resize(e)});
  }
}
