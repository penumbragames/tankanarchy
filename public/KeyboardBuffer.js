/**
 * A bunch of static variables to track the state of the keyboard.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function KeyboardBuffer() {}

KeyboardBuffer.LEFT = false;
KeyboardBuffer.UP = false;
KeyboardBuffer.RIGHT = false;
KeyboardBuffer.DOWN = false;

KeyboardBuffer.onKeyDown = function(e) {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 65:
      KeyboardBuffer.LEFT = true;
      break;
    case 87:
      KeyboardBuffer.UP = true;
      break;
    case 68:
      KeyboardBuffer.RIGHT = true;
      break;
    case 83:
      KeyboardBuffer.DOWN = true;
      break;
  };
}

KeyboardBuffer.onKeyUp = function(e) {
  switch (e.keyCode) {
    case 65:
      KeyboardBuffer.LEFT = false;
      break;
    case 87:
      KeyboardBuffer.UP = false;
      break;
    case 68:
      KeyboardBuffer.RIGHT = false;
      break;
    case 83:
      KeyboardBuffer.DOWN = false;
      break;
  };
}

KeyboardBuffer.applyEventHandlers = function() {
  window.addEventListener('keyup', KeyboardBuffer.onKeyUp);
  window.addEventListener('keydown', KeyboardBuffer.onKeyDown);
}
