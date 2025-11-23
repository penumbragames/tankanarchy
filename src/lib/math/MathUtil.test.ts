/**
 * Testing for MathUtil.
 * @author omgimanerd
 */

import { expect, test } from 'bun:test'

import MathUtil from 'lib/math/MathUtil'

test('clamp()', () => {
  expect(MathUtil.clamp(-1, 0, 10)).toBe(0)
  expect(MathUtil.clamp(4, 0, 10)).toBe(4)
  expect(MathUtil.clamp(11, 0, 10)).toBe(10)

  expect(MathUtil.clamp(12, 10, 0)).toBe(10)
  expect(MathUtil.clamp(-2, 0, 10)).toBe(0)
})

test('inBound()', () => {
  expect(MathUtil.inBound(-1, 0, 10)).toBe(false)
  expect(MathUtil.inBound(0, 0, 10)).toBe(true)
  expect(MathUtil.inBound(4, 0, 10)).toBe(true)
  expect(MathUtil.inBound(10, 0, 10)).toBe(true)
  expect(MathUtil.inBound(11, 0, 10)).toBe(false)

  expect(MathUtil.inBound(-1, 10, 0)).toBe(false)
  expect(MathUtil.inBound(0, 10, 0)).toBe(true)
  expect(MathUtil.inBound(4, 10, 0)).toBe(true)
  expect(MathUtil.inBound(10, 10, 0)).toBe(true)
  expect(MathUtil.inBound(11, 10, 0)).toBe(false)
})

test('lerp()', () => {
  expect(MathUtil.lerp(-2, 0, 10, 0, 100)).toBe(-20)
  expect(MathUtil.lerp(4, 0, 10, 0, 100)).toBe(40)
  expect(MathUtil.lerp(14, 0, 10, 0, 100)).toBe(140)

  expect(MathUtil.lerp(4, 10, 0, 0, 100)).toBe(60)
})

test('normalizeAngle()', () => {
  expect(MathUtil.normalizeAngle(-MathUtil.TAU)).toBe(0)
  expect(MathUtil.normalizeAngle(-Math.PI / 4)).toBe((7 * Math.PI) / 4)
  expect(MathUtil.normalizeAngle(Math.PI / 4)).toBe(Math.PI / 4)
  expect(MathUtil.normalizeAngle(Math.PI)).toBe(Math.PI)
  expect(MathUtil.normalizeAngle(MathUtil.TAU)).toBe(0)
})

test('roundTo()', () => {
  expect(() => MathUtil.roundTo(3, -1)).toThrow()

  expect(MathUtil.roundTo(3.14159)).toBe(3)
  expect(MathUtil.roundTo(3.14159, 1)).toBe(3.1)
  expect(MathUtil.roundTo(3.14159, 2)).toBe(3.14)
  expect(MathUtil.roundTo(3.14159, 3)).toBe(3.142)
  expect(MathUtil.roundTo(3.14159, 4)).toBe(3.1416)
  expect(MathUtil.roundTo(3.14159, 5)).toBe(3.14159)
  expect(MathUtil.roundTo(3.14159, 6)).toBe(3.14159)
})
