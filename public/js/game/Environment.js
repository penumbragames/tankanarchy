/**
 * Keeps track of the environment.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
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
}

/**
 * Draws the environment tiles on the canvas.
 */
Environment.prototype.draw = function() {
  var center = this.viewPort.selfCoords;
  var leftX = center[0] - Constants.CANVAS_WIDTH / 2;
  var topY = center[1] - Constants.CANVAS_HEIGHT / 2;
  var rightX = center[0] + Constants.CANVAS_WIDTH / 2;
  var bottomY = center[1] + Constants.CANVAS_HEIGHT / 2;
  this.drawing.drawTiles(
      this.viewPort.toCanvasCoords({
        x: Math.max(Math.floor(leftX / Drawing.TILE_SIZE) *
                    Drawing.TILE_SIZE, Constants.WORLD_MIN),
        y: Math.max(Math.floor(topY / Drawing.TILE_SIZE) *
                    Drawing.TILE_SIZE, Constants.WORLD_MIN)
      }),
      this.viewPort.toCanvasCoords({
        x: Math.min((Math.ceil(rightX / Drawing.TILE_SIZE) + 1) *
                    Drawing.TILE_SIZE, Constants.WORLD_MAX),
        y: Math.min((Math.ceil(bottomY / Drawing.TILE_SIZE) + 1) *
                    Drawing.TILE_SIZE, Constants.WORLD_MAX)
      })
  );
};
