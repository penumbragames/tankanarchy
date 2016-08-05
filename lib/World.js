/**
 * This class is purely used to store static helper methods pertaining to the
 * world space. It is needed because these methods don't exactly belong in
 * Util and Closure compiler will complain anyway if we put them there.lib
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var Constants = require('../shared/Constants');
var Util = require('../shared/Util');

/**
 * Empty constructor for the World class, all functions will be static.
 * @constructor
 */
function World() {
  throw new Error('World should not be instantiated');
}


/**
 * Returns true if the given point is in the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y The y-coordinate of the given point.
 * @return {boolean}
 */
World.isInside = function(x, y) {
  return Util.inBound(x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(y, Constants.WORLD_MIN, Constants.WORLD_MAX);
};

/**
 * Bounds a coordinate if it is outside of the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y Thishe y-coordinate of the given point.
 * @return {Array.<number>}
 */
World.bound = function(x, y) {
  return [Util.bound(x, Constants.WORLD_MIN, Constants.WORLD_MAX),
          Util.bound(y, Constants.WORLD_MIN, Constants.WORLD_MAX)];
};

/**
 * Returns a random point inside the game environment world.
 * @param {number=} padding Optional argument specifying how much
 *   padding from the edge of the world this function should apply.
 *   Defaults to 30;
 * @return {Array.<number>}
 */
World.getRandomPoint = function(padding) {
  if (!padding) {
    padding = Constants.WORLD_PADDING;
  }
  return [Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding),
          Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding)];
};

/**
 * This line is needed on the server side since this is loaded as a module
 * into the node server.
 */
module.exports = World;
