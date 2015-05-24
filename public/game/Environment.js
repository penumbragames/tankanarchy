/**
 * Keeps track of the environment.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Environment(viewPort, drawing) {
  this.viewPort_ = viewPort;
  this.drawing_ = drawing;

  this.topLeft_ = Environment.TOP_LEFT;
  this.bottomRight_ = Environment.BOTTOM_RIGHT;
};

Environment.TOP_LEFT = [0, 0];
Environment.BOTTOM_RIGHT = [10000, 10000];

Environment.prototype.draw = function() {
  var drawStart = [Math.floor((player.x_ - Game.WIDTH / 2) / 100) * 100,
                   Math.floor((player.y_ - Game.HEIGHT / 2) / 100) * 100)];
  for (var x = drawStart[0]; x < player.x_ + Game.WIDTH / 2; x += 100) {
    for (var y = drawstart[1]; y < player.y_ + Game.HEIGHT / 2; y += 100) {
      this.drawing_.drawTile();
    }
  }
};
