/**
 * This is a utility class containing utility methods used on the server and
 * client.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

/**
 * This method truncates a number to an integer.
 * @param {number} x The number to truncate.
 * @return {number}
 */
const truncate = x => {
  return x | 0
}

/**
 * This method returns the sign of a number.
 * @param {number} x The number to check.
 * @return {number}
 */
const getSign = x => {
  if (x > 0) {
    return 1
  } else if (x < 0) {
    return -1
  }
  return 0
}

/**
 * Returns the Manhattan Distance between two points given their x and y
 * coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
const getManhattanDistance = (x1, y1, x2, y2) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

/**
 * Returns the squared Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
const getEuclideanDistance2 = (x1, y1, x2, y2) => {
  return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
}

/**
 * Returns the true Euclidean distance between two points given their
 * x and y coordinates.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @return {number}
 */
const getEuclideanDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(getEuclideanDistance2(x1, y1, x2, y2))
}

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum bound.
 * @param {number} max The maximum bound.
 * @return {boolean}
 */
const inBound = (val, min, max) => {
  if (min > max) {
    return val >= max && val <= min
  }
  return val >= min && val <= max
}

/**
 * Bounds a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 * @param {number} val The value to check.
 * @param {number} min The minimum number to bound to.
 * @param {number} max The maximum number to bound to.
 * @return {number}
 */
const bound = (val, min, max) => {
  if (min > max) {
    return Math.min(Math.max(val, max), min)
  }
  return Math.min(Math.max(val, min), max)
}

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
const randRange = (min, max) => {
  if (min >= max) {
    return Math.random() * (min - max) + max
  }
  return Math.random() * (max - min) + min
}

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 * @param {number} min The minimum number to generate.
 * @param {number} max The maximum number to generate.
 * @return {number}
 */
const randRangeInt = (min, max) => {
  if (min > max) {
    return Math.floor(Math.random() * (min - max)) + max
  }
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Returns a random element in a given array.
 * @param {Array.<Object>} array The array from which to select a random
 *   element from.
 * @return {Object}
 */
const choiceArray = array => {
  return array[randRangeInt(0, array.length)]
}

module.exports = {
  truncate,
  getSign,
  getManhattanDistance,
  getEuclideanDistance2,
  getEuclideanDistance,
  inBound,
  bound,
  randRange,
  randRangeInt,
  choiceArray
}
