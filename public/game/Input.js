/**
 * This class keeps track of the user input in global variables.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Input() {}

Input.LEFT_CLICK = false;
Input.RIGHT_CLICK = false;
Input.MOUSE = [];
Input.LEFT = false;
Input.UP = false;
Input.RIGHT = false;
Input.DOWN = false;

Input.onMouseDown = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = true;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = true;
  }
};

Input.onMouseUp = function(e) {
  if (e.which == 1) {
    Input.LEFT_CLICK = false;
  } else if (e.which == 3) {
    Input.RIGHT_CLICK = false;
  }
};

Input.onMouseMove = function(e) {
  var canvas = document.getElementById('canvas');
  var rect = canvas.getBoundingClientRect();
  Input.MOUSE = [e.pageX - rect.left,
                 e.pageY - rect.top];
};

Input.onKeyDown = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = true;
      break;
    case 38:
    case 87:
      Input.UP = true;
      break;
    case 39:
    case 68:
      Input.RIGHT = true;
      break;
    case 40:
    case 83:
      Input.DOWN = true;
      break;
  };
};

Input.onKeyUp = function(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      Input.LEFT = false;
      break;
    case 38:
    case 87:
      Input.UP = false;
      break;
    case 39:
    case 68:
      Input.RIGHT = false;
      break;
    case 40:
    case 83:
      Input.DOWN = false;
      break;
  };
};

/**
 * This is the only function that needs to be called in the client-side
 * script. This should be called during initialization to allow the Input
 * class to track user input.
 */
Input.applyEventHandlers = function() {
  window.addEventListener('mousedown', Input.onMouseDown);
  window.addEventListener('mouseup', Input.onMouseUp);
  window.addEventListener('mousemove', Input.onMouseMove);
  window.addEventListener('keyup', Input.onKeyUp);
  window.addEventListener('keydown', Input.onKeyDown);
};
