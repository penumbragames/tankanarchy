/**
 * Manages the player viewport when they move around.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

/**
 * This class manages the viewport of the client. It is mostly
 * an abstract class that handles the math of converting absolute
 * coordinates to appropriate canvas coordinates.
 * @constructor
 */
function ViewPort() {
  this.selfCoords = [];
}

/**
 * Factory method for a ViewPort class.
 * @return {ViewPort}
 */
ViewPort.create = function() {
  return new ViewPort();
};

/**
 * Updates the viewport with this client's player instance's coordinates.
 * @param {number} x The absolute x coordinate of the player.
 * @param {number} y The absolute y coordinate of the player.
 */
ViewPort.prototype.update = function(x, y) {
  this.selfCoords = [x, y];
};

/**
 * Given an absolute world x coordinate, this function returns the canvas
 * x coordinate that it converts to.
 * @param {number} x The absolute world x coordinate to convert.
 * @return {number}
 */
ViewPort.prototype.toCanvasX = function(x) {
  return x - (this.selfCoords[0] - Constants.CANVAS_WIDTH / 2);
};

/**
 * Given an absolute world y coordinate, this function returns the canvas
 * y coordinate that it converts to.
 * @param {number} y The absolute world y coordinate to convert.
 * @return {number}
 */
ViewPort.prototype.toCanvasY = function(y) {
  return y - (this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2);
};

/**
 * Given an object, returns an array containing the object's converted
 * coordinates. The object must be a valid data structure sent by the
 * server with an x and y attribute.
 * @param {Object} object The object whose converted coords should be
 *   returned.
 * @return {Array.<number>}
 */
ViewPort.prototype.toCanvasCoords = function(object) {
  var translateX = this.selfCoords[0] - Constants.CANVAS_WIDTH / 2;
  var translateY = this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2;
  return [object.x - translateX,
          object.y - translateY];
};
