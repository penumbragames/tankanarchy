/**
 * A bunch of static variables to track the state of the keyboard.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Input() {}

Input.CLICK = false;
Input.MOUSE = [];
Input.LEFT = false;
Input.UP = false;
Input.RIGHT = false;
Input.DOWN = false;

Input.onMouseDown = function(e) {
  Input.CLICK = true;
};

Input.onMouseUp = function(e) {
  Input.CLICK = false;
};

Input.onMouseMove = function(e) {
  var canvas = document.getElementById('canvas');
  var rect = canvas.getBoundingClientRect();
  Input.MOUSE = [e.pageX - rect.left,
                 e.pageY - rect.top];
};

Input.onKeyDown = function(e) {
  switch (e.keyCode) {
    case 65:
      Input.LEFT = true;
      break;
    case 87:
      Input.UP = true;
      break;
    case 68:
      Input.RIGHT = true;
      break;
    case 83:
      Input.DOWN = true;
      break;
  };
};

Input.onKeyUp = function(e) {
  switch (e.keyCode) {
    case 65:
      Input.LEFT = false;
      break;
    case 87:
      Input.UP = false;
      break;
    case 68:
      Input.RIGHT = false;
      break;
    case 83:
      Input.DOWN = false;
      break;
  };
};

Input.applyEventHandlers = function() {
  window.addEventListener('mousedown', Input.onMouseDown);
  window.addEventListener('mouseup', Input.onMouseUp);
  window.addEventListener('mousemove', Input.onMouseMove);
  window.addEventListener('keyup', Input.onKeyUp);
  window.addEventListener('keydown', Input.onKeyDown);
};
