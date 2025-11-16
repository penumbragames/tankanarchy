/**
 * Utilities for random number generation and element selection.
 * @author omgimanerd
 */

/**
 * Returns a random floating-point number between the given min and max
 * values, exclusive of the max value.
 */
const randRange = (min: number, max: number): number => {
  if (min >= max) {
    // prettier-ignore
    return (Math.random() * (min - max)) + max;
  }
  // prettier-ignore
  return (Math.random() * (max - min)) + min;
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
const choiceArray = <T>(array: T[]): T => array[randRangeInt(0, array.length)]

export default {
  randRange,
  randRangeInt,
  choiceArray,
}
