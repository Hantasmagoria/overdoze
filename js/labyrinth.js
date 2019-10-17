//Game local redirections go here.

// console.log("Entered the labyrinth.");

class Labyrinth {
  static link(){
    setTimeout(()=>{document.querySelector('h1').style.display = 'none';rev();}, 1000);
  }
  static resize(e){
    view.resize(game.world.height/game.world.width)
  }
  static update(){
    game.mov();
  }
  static render(){
    view.visualize();
  }
}

const rev = ()=>{
  View.createCanvas();
    controller = new Controller();
    view       = new View(document.getElementById('gameArea'));
    game       = new Game();
    gear       = new Gear(60);
   view.buffer.canvas.width =  game.world.width;
   view.buffer.canvas.height =  game.world.height;
   controller.openEars();
   view.openEyes();
   view.resize( game.world.height/ game.world.width);
   Labyrinth.render();
   gear.start();
}
