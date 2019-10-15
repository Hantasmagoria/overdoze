//eventhandles go here.

// console.log("control.js linked.");

class Controller {
  constructor() {
    class ButtonInput {
      constructor() {
        this.active   =
        this.pressed  =
        false;
      }
      getInput(state){
        if (this.pressed != state) {
          this.active   =
          this.pressed  =
          state;
        }
      }
    }
    this.up     = new ButtonInput();
    this.down   = new ButtonInput();
    this.left   = new ButtonInput();
    this.right  = new ButtonInput();
  }
  keyPress(e) {
    // console.log("key pressed, running keyPress now");
    let pressed = (e.type=='keydown')?true:false;

    switch (e.keyCode) {
      case 37: this.left.getInput(pressed); break;
      case 38: this.up.getInput(pressed); break;
      case 39: this.right.getInput(pressed); break;
      case 40: this.down.getInput(pressed);
    }
    // console.log(`key pressed: ${e.keyCode}`);
  }
  openEars() {
    window.addEventListener('keydown',(e)=>{this.keyPress(e)});
    window.addEventListener('keyup',(e)=>{this.keyPress(e)});
  }
}
