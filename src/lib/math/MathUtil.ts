/**
 * Math utility functions.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const TAU = 2 * Math.PI
const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

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
 * Given a value, a minimum, and a maximum, returns true if value is
 * between the minimum and maximum, inclusive of both bounds. This
 * function will still work if min and max are switched.
 */
const inBound = (val: number, min: number, max: number): boolean => {
  if (min > max) {
    return val >= max && val <= min
  }
  return val >= min && val <= max
}

/**
 * @param v value to linearly interpolate
 * @param min1 min of the range to interpolate from
 * @param max1 max of the range to interpolate from
 * @param min2 min of the range to interpolate to
 * @param max2 max of the range to interpolate to
 */
const lerp = (
  v: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number,
): number => {
  return ((v - min1) / (max1 - min1)) * (max2 - min2) + min2
}

/**
 * Given an angle in radians, this function normalizes the angle to the range
 * 0 to TAU (exclusive) and returns the normalized angle.
 */
const normalizeAngle = (angle: number): number => {
  return angle < 0 ? angle + Math.ceil(-angle / TAU) * TAU : angle % TAU
}

/**
 * @param v The number to round
 * @param digits The number of digits after the decimal points to keep
 * @returns The rounded number
 */
const roundTo = (v: number, digits: number = 0) => {
  if (digits < 0) throw new Error(`Invalid digits argument ${digits}`)
  if (digits === 0) return Math.round(v)
  const factor = Math.pow(10, digits)
  return Math.round(v * factor) / factor
}

export default {
  TAU,
  DEG_TO_RAD,
  RAD_TO_DEG,
  clamp,
  inBound,
  lerp,
  normalizeAngle,
  roundTo,
}
