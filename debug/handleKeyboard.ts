import { Machine } from "../machine/machine";

export const handleKeyboardForDebugging = ( machine:Machine ) => {
  document.onkeydown = e => {
    if ( e.key === "ArrowDown") {
      machine.reels[1].scroll += .1;
      machine.reels[1].update();
    } 
    else
    if ( e.key === "ArrowUp") {
      machine.reels[1].scroll -= .1;
      machine.reels[1].update();
    } 
    else
    console.log( e.key)
  }
}