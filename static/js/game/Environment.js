/**
 * Keeps track of the environment.
 * @author Alvin Lin (alvin.lin@stuypulse.com)
 */

/**
 * This class merely helps render the game's background.
 * All the math to convert absolute coordinates to canvas
 * coordinates is done within this class's methods.
 * @param {ViewPort} viewPort The Game's ViewPort object.
 * @param {Drawing} drawing The Game's Drawing object.
 * @constructor
 */
function Environment(viewPort, drawing) {
  this.viewPort = viewPort;
  this.drawing = drawing;
};

Environment.MIN = 0;
Environment.MAX = 2500;

/**
 * Draws the environment tiles on the canvas.
 */
Environment.prototype.draw = function() {
  var center = this.viewPort.selfCoords;
  this.drawing.drawTiles(
    this.viewPort.toCanvasCoords({
      x: Math.max(Math.floor(
                  (center[0] - Game.WIDTH / 2) / Drawing.TILE_SIZE) *
                  Drawing.TILE_SIZE, Environment.MIN),
      y: Math.max(Math.floor(
                  (center[1] - Game.HEIGHT / 2) / Drawing.TILE_SIZE) *
                  Drawing.TILE_SIZE, Environment.MIN)
    }),
    this.viewPort.toCanvasCoords({
      x: Math.min((Math.ceil(
                  (center[0] + Game.WIDTH / 2) / Drawing.TILE_SIZE) + 1) *
                  Drawing.TILE_SIZE, Environment.MAX),
      y: Math.min((Math.ceil(
                  (center[1] + Game.HEIGHT / 2) / Drawing.TILE_SIZE) + 1) *
                  Drawing.TILE_SIZE, Environment.MAX)
    })
  );
};
