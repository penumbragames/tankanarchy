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
  this.drawing_.drawTiles(
    this.viewPort_.toCanvasCoords({
      x_: Math.max(Math.floor((center[0] - Game.WIDTH / 2) / 100) * 100, 0),
      y_: Math.max(Math.floor((center[1] - Game.HEIGHT / 2) / 100) * 100, 0)
    }),
    this.viewPort_.toCanvasCoords({x_: 2500, y_: 2500})
  );
};
