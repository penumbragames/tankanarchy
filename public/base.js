/**
 * A set of base functions necessary for the client.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

// Sets smooth animation frames.
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

function verifyNickname(nickname) {
  return nickname != '' && nickname != null;
};

function getSign(n) {
  if (n < 0) {
    return -1;
  } else if (n > 0) {
    return 1;
  } else {
    return 0;
  }
};
