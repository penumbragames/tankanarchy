/**
 * Manages the player viewport when they move around.
 * @author Kenneth Li (kennethli.3470@gmail.com)
 */

/**
 * This class manages the viewport of the client. It is mostly
 * an abstract class that handles the math of converting absolute
 * coordinates to appropriate canvas coordinates.
 * @constructor
 */
function ViewPort() {
  this.selfCoords = [];
};

/**
 * Updates the viewport with this client's player instance's coordinates.
 */
ViewPort.prototype.update = function(x, y) {
  this.selfCoords = [x, y];
};

/**
 * Given an object, returns an array containing the object's converted
 * coordinates. The object must be a valid data structure sent by the
 * server with an x and y value.
 * @param {Object} object The object whose converted coords should be
 *   returned.
 * @return {[number, number]}
 */
ViewPort.prototype.toCanvasCoords = function(object) {
  var translateX = this.selfCoords[0] - Constants.CANVAS_WIDTH / 2;
  var translateY = this.selfCoords[1] - Constants.CANVAS_HEIGHT / 2;
  return [object.x - translateX,
          object.y - translateY];
};
