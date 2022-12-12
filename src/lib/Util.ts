/**
 * This is a utility class containing utility methods used on the server and
 * client.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

/**
 * Given an angle in radians, this function normalizes the angle to the range
 * 0 to 2 PI and returns the normalized angle.
 */
const normalizeAngle = (angle: number): number => {
  while (angle < 0) {
    // eslint-disable-next-line no-param-reassign
    angle += Math.PI * 2
  }
  return angle % (Math.PI * 2)
}

/**
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * functio will still work if min and max are switched.
 */
const inBound = (val: number, min: number, max: number): boolean => {
  if (min > max) {
    return val >= max && val <= min
  }
  return val >= min && val <= max
}

/**
 * Clamps a number to the given minimum and maximum, inclusive of both
 * bounds. This function will still work if min and max are switched.
 */
const clamp = (val: number, min: number, max: number): number => {
  if (min > max) {
    return Math.min(Math.max(val, max), min)
  }
  return Math.min(Math.max(val, min), max)
}

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 */
const randRange = (min: number, max: number): number => {
  if (min >= max) {
    // prettier-ignore
    return (Math.random() * (min - max)) + max
  }
  // prettier-ignore
  return (Math.random() * (max - min)) + min
}

/**
 * Returns a random integer between the given min and max values, exclusive
 * of the max value.
 */
const randRangeInt = (min: number, max: number): number => {
  if (min > max) {
    return Math.floor(Math.random() * (min - max)) + max
  }
  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Returns a random element in a given array.
 */
const choiceArray = <Type>(array: Type[]): Type =>
  array[randRangeInt(0, array.length)]

export default {
  normalizeAngle,
  inBound,
  clamp,
  randRange,
  randRangeInt,
  choiceArray,
}
