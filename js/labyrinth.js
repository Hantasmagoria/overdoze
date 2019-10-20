//Game local redirections go here.


//meant to serve as the one thing keeping everything(all the js files) together.
//the analogy behind naming it "Labyrinth" was that in an adventure where the main character of a fictional story ventures into a dungeon for exploration, after conquering the dungeon(sometimes in the form of a maze) and its puzzles and death traps, the whole dungeon usually comes crumbling down after the completion requirement(the artifact - usually the source of power holding the dungeon together because magic or quantum physics - has been taken away from its original position) is met
//essentially just a Utility class.
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
    view.drawMap(game.world.map, game.world.columns);
    view.hitBox(game.world.player.posX, game.world.player.posY, game.world.player.width, game.world.player.height, game.world.player.color)
    view.visualize();
  }
}

//had issues maintaining the encapsulation on this method. pulled it out and let it be a global function and everything works. i dunno, didn't want to spend another 58 hours on solving this.
const rev = ()=>{
  View.createCanvas();
    controller = new Controller();
    view       = new View(document.getElementById('gameArea'));
    game       = new Game();
    gear       = new Gear(60);
   view.buffer.canvas.width =  game.world.width;
   view.buffer.canvas.height =  game.world.height;
   view.tileSheet.image.addEventListener('load', function(e){
     // console.log("tilesheet image loaded");
     view.resize( game.world.height/ game.world.width);
     gear.start();
   }, {once:true})
   view.tileSheet.image.src = "assets/tiles.png";
   controller.openEars();
   view.openEyes();
   Labyrinth.render();
}
