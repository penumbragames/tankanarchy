/**
 * Keeps track of the environment.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * This object merely helps render the game's background.
 * All the math to convert absolute coordinates to canvas
 * coordinates is done within this class's methods.
 * @constructor
 */
function Environment(viewPort, drawing) {
  this.viewPort = viewPort;
  this.drawing = drawing;
};

Environment.MIN = 0;
Environment.MAX = 2500;

/**
 * Draws the environment tiles on the viewport.
 */
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
