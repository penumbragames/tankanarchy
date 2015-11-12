/**
 * This is a utility class containing utility methods used on the server and
 * client.
 * @author Alvin Lin (alvin.lin.dev@gmail.com)
 */

try {
  var Constants = require('./Constants');
} catch (err) {}

/**
 * Empty constructor for the Util class, all functions will be static.
 * @constructor
 */
function Util() {
  throw new Error('Util should not be instantiated!');
};

/**
 * Returns the Manhattan Distance between two points given their x and y
 * coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getManhattanDistance = function(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

/**
 * Returns the squared Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance2 = function(x1, y1, x2, y2) {
  return ((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2));
};

/**
 * Returns the true Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
Util.getEuclideanDistance = function(x1, y1, x2, y2) {
  return Math.sqrt(Util.getEuclideanDistance2(x1, y1, x2, y2));
};

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
Util.inBound = function(val, min, max) {
  if (min > max) {
    return val >= max && val <= min;
  }
  return val >= min && val <= max;
};

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
Util.bound = function(val, min, max) {
  if (min > max) {
    return Math.min(Math.max(val, max), min);
  }
  return Math.min(Math.max(val, min), max);
};

/**
 * Returns true if the given point is in the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y The y-coordinate of the given point.
 * @return {boolean}
 */
Util.inWorld = function(x, y) {
  return Util.inBound(x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(y, Constants.WORLD_MIN, Constants.WORLD_MAX);
};

/**
 * Bounds a coordinate if it is outside of the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number} y The y-coordinate of the given point.
 * @return {[number, number]}
 */
Util.boundWorld = function(x, y) {
  return [Util.bound(x, Constants.WORLD_MIN, Constants.WORLD_MAX),
          Util.bound(y, Constants.WORLD_MIN, Constants.WORLD_MAX)];
};

/**
 * Returns a random point inside the game environment world.
 * @param {number=} padding Optional argument specifying how much
 *   padding from the edge of the world this function should apply.
 *   Defaults to 30;
 * @return {[number, number]}
 */
Util.getRandomWorldPoint = function(padding) {
  if (!padding) {
    padding = Constants.WORLD_PADDING;
  }
  return [Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding),
          Util.randRange(Constants.WORLD_MIN + padding,
                         Constants.WORLD_MAX - padding)];
};

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 */
Util.randRange = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return (Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 */
Util.randRangeInt = function(min, max) {
  if (min >= max) {
    var swap = min;
    min = max;
    max = swap;
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random element in a given array.
 * @param {Array.<Object>} array The array from which to select a random
 *   element from.
 * @return {Object}
 */
Util.choiceArray = function(array) {
  return array[Util.randRangeInt(0, array.length)];
};

try {
  module.exports = Util;
} catch (err) {}
