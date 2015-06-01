/**
 * This is a utility class containing utility methods used on the server.
 * Author: Alvin Lin (alvin.lin@stuypulse.com)
 */

var Constants = require('./Constants');

/**
 * Empty constructor for the Util class, all functions will be static.
 */
function Util() {}

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
  return Math.sqrt(Util.getEuclideanDistance2(x1, x2, y1, y2));
};

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
Util.inBound = function(val, min, max) {
  if (min > max) {
    throw new Error('You fucked up');
  }
  return val >= min && val <= max;
};

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
Util.bound = function(val, min, max) {
  if (min > max) {
    throw new Error('You fucked up');
  }
  return Math.min(Math.max(val, min), max);
};

/**
 * Returns true if the given point is in the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number] y The y-coordinate of the given point.
 * @return {boolean}
 */
Util.inWorld = function(x, y) {
  return Util.inBound(x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(y, Constants.WORLD_MIN, Constants.WORLD_MAX);
};

/**
 * Bounds a coordinate if it is outside of the game environment world.
 * @param {number} x The x-coordinate of the given point.
 * @param {number] y The y-coordinate of the given point.
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
  if (padding == null || padding == undefined) {
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
 * @param {number}
 */
Util.randRange = function(min, max) {
  if (min >= max) {
    throw new Error('You fucked up');
  }
  return (Math.random() * (max - min)) + min;
};

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @param {number}
 */
Util.randRangeInt = function(min, max) {
  if (min >= max) {
    throw new Error('You fucked up');
  }
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random element in a given array.
 * @param {Array.<Object>}
 * @return {Object}
 */
Util.choiceArray = function(array) {
  return array[Util.randRangeInt(0, array.length)];
};

module.exports = Util;
