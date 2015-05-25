/**
 * Keeps track of the environment.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

function Environment(viewPort, drawing) {
  this.viewPort = viewPort;
  this.drawing = drawing;
};

Environment.MIN = 0;
Environment.MAX = 2500;

Environment.prototype.draw = function() {
  var center = this.viewPort.selfCoords;
  this.drawing.drawTiles(
    this.viewPort.toCanvasCoords({
      x: Math.max(Math.floor((center[0] - Game.WIDTH / 2) / 100) * 100, 0),
      y: Math.max(Math.floor((center[1] - Game.HEIGHT / 2) / 100) * 100, 0)
    }),
    this.viewPort.toCanvasCoords(
      {x: Environment.MAX, y: Environment.MAX}
    )
  );
};
