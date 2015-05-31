/**
 * Manages the player viewport when they move around.
 * Author: Kenneth Li (kennethli.3470@gmail.com)
 */

/**
 * This class manages the viewport of the client. It is mostly
 * an abstract class that handles the math of converting absolute
 * coordinates to appropriate canvas coordinates.
 * @constructor
 */
function ViewPort() {
  this.selfCoords = [];
  this.selfId = null;
};

/**
 * Stores the ID of this client's socket after it is returned by the
 * server.
 */
ViewPort.prototype.setID = function(id) {
  this.selfId = id;
};

/**
 * Updates the viewport with this client's player instance's coordinates.
 */
ViewPort.prototype.update = function(x, y) {
  this.selfCoords = [x, y];
};

/**
 * Given an array of objects, returns only the objects that are visible
 * within this player's viewport.
 * @param {Array.<Object>} objects A list of the objects to check.
 * @return {Array.<Object>}
 */
ViewPort.prototype.getVisibleObjects = function(objects) {
  var onScreen = [];
  for (var i = 0; i < objects.length; i++) {
    var object = objects[i];
    if (Math.abs(object.x - this.selfCoords[0]) < 450 &&
        Math.abs(object.y - this.selfCoords[1]) < 350) {
      onScreen.push(object);
    }
  }
  return onScreen;
};

/**
 * Given an object, returns an array containing the object's converted
 * coordinates.
 * @param {Object}
 * @return {[number, number]}
 */
ViewPort.prototype.toCanvasCoords = function(object) {
  if (object.id == this.selfId) {
    return [Game.WIDTH / 2, Game.HEIGHT / 2];
  } else {
    var translateX = this.selfCoords[0] - Game.WIDTH / 2;
    var translateY = this.selfCoords[1] - Game.HEIGHT / 2;
    return [object.x - translateX,
            object.y - translateY];
  }
};
