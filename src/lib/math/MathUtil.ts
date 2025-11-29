/**
 * Math utility functions.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import Vector from 'lib/math/Vector'

const TAU = 2 * Math.PI
const DEG_TO_RAD = Math.PI / 180
const RAD_TO_DEG = 180 / Math.PI

/**
 * Returns a function that can be called with argument t to compute the point
 * along a bezier curve composed of the given control points.
 *
 * https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm
 *
 * @param points List of bezier control points
 * @returns a function that takes argument t in [0, 1] to compute any point
 * along the bezier curve.
 */
const bezier = (points: Vector[]): ((t: number) => Vector) => {
  // Bernstein basis polynomial.
  const bernstein = (i: number, n: number, t: number) => {
    return nCr(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i)
  }
  return (t: number): Vector => {
    return points
      .map((point: Vector, index: number) => {
        return Vector.scale(point, bernstein(index, points.length - 1, t))
      })
      .reduce((prev: Vector, current: Vector) => {
        return prev.add(current)
      }, Vector.zero())
  }
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
 * nCr(n, r) = n!/(n - r)!r!
 *           = nCr(n - 1, r) + nCr(n - 1, r - 1)
 */
const nCr = (n: number, r: number): number => {
  if (n < 0 || r < 0) {
    throw new Error(`Invalid call: nCr(${n}, ${r})`)
  }
  if (n === r || r === 0) return 1
  if (n > 0 && r === 0) return 0
  if (r === 1) return n
  return nCr(n - 1, r) + nCr(n - 1, r - 1)
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
  bezier,
  clamp,
  inBound,
  lerp,
  normalizeAngle,
  nCr,
  roundTo,
}
