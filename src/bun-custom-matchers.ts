// Custom matchers for bun

import { expect } from 'bun:test'
import Vector from 'lib/math/Vector'

const EPSILON = 1e-10

expect.extend({
  /**
   * Custom matcher for Vectors.
   * @param actual Vector input
   * @param other Vector to compare to
   */
  vectorEquals: (actual, other) => {
    if (actual instanceof Vector && other instanceof Vector) {
      return {
        pass:
          Math.abs(actual.x - other.x) < EPSILON &&
          Math.abs(actual.y - other.y) < EPSILON,
        message: () => `${actual.toString()} != ${other.toString()}`,
      }
    }
    return {
      pass: false,
      message: () => `${actual} and ${other} must be Vectors`,
    }
  },
})

declare module 'bun:test' {
  interface CustomMatchers<R = unknown> {
    vectorEquals(other: Vector): R
  }

  interface Matchers<T> extends CustomMatchers<T> {}
  interface AssymetricMatchers extends CustomMatchers {}
}
