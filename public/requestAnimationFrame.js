/**
 * Allows smooth game animation.
 */

var FPS = 60;
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element) {
            window.setTimeout(callback, 1000 / FPS);
          };
})();
