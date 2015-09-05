/**
 * Allows for a smooth client side game loop, running optimally at 60 FPS.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
           window.setTimeout(callback, 1000 / 60);
         };
})();
