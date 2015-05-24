/**
 * Keeps track of the environment.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Environment() {
  this.topLeft_ = Environment.TOP_LEFT;
  this.bottomRight_ = Environment.BOTTOM_RIGHT;
};

Environment.TOP_LEFT = [0, 0];
Environment.BOTTOM_RIGHT = [10000, 10000];

Environment.prototype.draw = function(player) {

};
