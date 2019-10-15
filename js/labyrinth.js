//Game local redirections go here.

// console.log("Entered the labyrinth.");

class Labyrinth {
  constructor() {
    this.controller = new Controller();
    this.view       = new View(document.getElementById('gameArea'));
    this.game       = new Game();
    this.gear       = new Gear();
  }
  static link(){
    Gear.rev();
    // Controller.openEars();
  }
}
