//Game local redirections go here.


//meant to serve as the one thing keeping everything(all the js files) together.
//the analogy behind naming it "Labyrinth" was that in an adventure where the main character of a fictional story ventures into a dungeon for exploration, after conquering the dungeon(sometimes in the form of a maze) and its puzzles and death traps, the whole dungeon usually comes crumbling down after the completion requirement(the artifact - usually the source of power holding the dungeon together because magic or quantum physics - has been taken away from its original position) is met
//essentially just a Utility class.
class Labyrinth {
  static link(){
    setTimeout(()=>{document.querySelector('h1').style.display = 'none';rev();}, 1000);
  }
  static resize(e,aspect){
    view.resize(aspect)
  }
  static update(){
    game.mov();
  }

  //this static method handles the drawing.
  static render(){
    view.backgroundColor( game.world.bgColor);
    view.drawMap(clerk.tileSetImage,game.world.tileSheet.columns, game.world.map, game.world.columns, game.world.tileSheet.tileSize);
    // game.world.tileSheet.frames[game.world.player.frameValue];
    // console.log(game.world.player.frameValue);
    view.hitBox(clerk.tileSetImage,game.world.tileSheet.frames[game.world.player.frameValue].x,game.world.tileSheet.frames[game.world.player.frameValue].y,game.world.player.posX + Math.floor(game.world.player.width*0.5-game.world.tileSheet.frames[game.world.player.frameValue].width*0.5)+game.world.tileSheet.frames[game.world.player.frameValue].offX, game.world.player.posY+game.world.tileSheet.frames[game.world.player.frameValue].offY,game.world.tileSheet.frames[game.world.player.frameValue].width,game.world.tileSheet.frames[game.world.player.frameValue].height);
    //not sure why I had this line below...? Will keep in case things break like my life always does.
    // view.hitBox(game.world.player.posX, game.world.player.posY, game.world.player.width, game.world.player.height, game.world.player.color)
    view.display();
  }
}

//asset manager class, because managing assets can be pretty hard.
class AssetMan {
  loadTileSetImage(dir,o){
    this.tileSetImage = new Image();
    this.tileSetImage.addEventListener('load', function(e){o();},{once:true});
    this.tileSetImage.src = dir;
  }
}

//had issues maintaining the encapsulation on this static method. pulled it out and let it be a global function and everything works. i dunno, didn't want to spend another 58 hours on solving this.
const rev = ()=>{
  View.createCanvas();
    clerk      = new AssetMan();
    controller = new Controller();
    game       = new Game();
    view       = new View(document.getElementById('gameArea'));
    gear       = new Gear(60);
   view.buffer.canvas.width =  game.world.width;
   view.buffer.canvas.height =  game.world.height;
   clerk.loadTileSetImage('assets/tiles.png', (e)=>{
     //watch out for resize bugs here.
     Labyrinth.resize(e,game.world.height/ game.world.width);
     gear.start();
   }, {once:true})
   controller.openEars();
   view.openEyes();
   Labyrinth.render();
}
