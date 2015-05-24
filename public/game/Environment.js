/**
 * Keeps track of the environment.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Environment(viewPort, drawing) {
  this.viewPort_ = viewPort;
  this.drawing_ = drawing;
};

Environment.prototype.draw = function() {
  var center = this.viewPort_.selfCoords_;
  var drawStart = [Math.floor((center[0] - Game.WIDTH / 2) / 100) * 100,
                   Math.floor((center[1] - Game.HEIGHT / 2) / 100) * 100];
  for (var x = drawStart[0]; x < center[0] + Game.WIDTH / 2; x += 100) {
    for (var y = drawStart[1]; y < center[1] + Game.HEIGHT / 2; y += 100) {
      this.drawing_.drawTile(this.viewPort_.toCanvasCoords([x, y]));
    }
  }
};
