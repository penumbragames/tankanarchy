/**
 * Math utility functions.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const TAU = 2 * Math.PI

/**
 * Given an angle in radians, this function normalizes the angle to the range
 * 0 to 2 PI and returns the normalized angle.
 */
const normalizeAngle = (angle: number): number => {
  return angle < 0 ? angle + Math.ceil(-angle / TAU) * TAU : angle % TAU
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

export default {
  TAU,
  normalizeAngle,
  inBound,
  clamp,
}
