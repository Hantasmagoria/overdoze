//game logic go here.

// console.log("app.js linked.");

class Game {
  constructor() {
    // this.
  }
  start(){}
}

class Gear {
  constructor(timeStep, update, display) {
    this.elapsedTime = 0;
    this.time = 0;
  }
  static rev(){
    setTimeout(()=>{document.querySelector('h1').style.display = 'none';let game = new Game()}, 1000);
    View.createCanvas();
    let play = new Labyrinth();
    play.controller.openEars();
    play.view.openEyes();
    play.view.resize();
    play.game.start();
  }
}
//Players
//Objectives
//Procedures
//Rules
//Resources
