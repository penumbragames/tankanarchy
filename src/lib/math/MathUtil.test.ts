/**
 * Testing for MathUtil.
 * @author omgimanerd
 */

import { describe, expect, test } from 'bun:test'

import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'

describe('bezier()', () => {
  const getPoints = (bezierFn: (t: number) => Vector): string[] => {
    const result = []
    for (let t = 0; t <= 1.01; t += 0.05) {
      result.push(bezierFn(t).toString().replace('<', '(').replace('>', ')'))
    }
    return result
  }

  test('Basic bezier curve', () => {
    const bezier = MathUtil.bezier([
      new Vector(0, 0),
      new Vector(4, 0),
      new Vector(2, 1.2),
      new Vector(5, 5),
    ])
    expect(getPoints(bezier)).toMatchInlineSnapshot(`
      [
        "(0.00,0.00)",
        "(0.56,0.01)",
        "(1.03,0.04)",
        "(1.43,0.09)",
        "(1.77,0.16)",
        "(2.05,0.25)",
        "(2.28,0.36)",
        "(2.47,0.50)",
        "(2.62,0.67)",
        "(2.76,0.86)",
        "(2.87,1.07)",
        "(2.99,1.32)",
        "(3.10,1.60)",
        "(3.22,1.91)",
        "(3.35,2.24)",
        "(3.52,2.62)",
        "(3.71,3.02)",
        "(3.95,3.46)",
        "(4.24,3.94)",
        "(4.59,4.45)",
        "(5.00,5.00)",
      ]
    `)
  })

  test('Zig-zag bezier curve', () => {
    const bezier = MathUtil.bezier([
      new Vector(0, 0),
      new Vector(10, 5),
      new Vector(0, 5),
      new Vector(10, 10),
    ])
    expect(getPoints(bezier)).toMatchInlineSnapshot(`
      [
        "(0.00,0.00)",
        "(1.35,0.71)",
        "(2.44,1.36)",
        "(3.28,1.95)",
        "(3.92,2.48)",
        "(4.38,2.97)",
        "(4.68,3.42)",
        "(4.87,3.84)",
        "(4.96,4.24)",
        "(5.00,4.62)",
        "(5.00,5.00)",
        "(5.00,5.38)",
        "(5.04,5.76)",
        "(5.14,6.16)",
        "(5.32,6.58)",
        "(5.63,7.03)",
        "(6.08,7.52)",
        "(6.72,8.05)",
        "(7.56,8.64)",
        "(8.65,9.29)",
        "(10.00,10.00)",
      ]
    `)
  })

  test('Looped bezier curve', () => {
    const bezier = MathUtil.bezier([
      new Vector(0, 0),
      new Vector(10, 5),
      new Vector(0, 10),
      new Vector(5, 0),
    ])
    expect(getPoints(bezier)).toMatchInlineSnapshot(`
      [
        "(0.00,0.00)",
        "(1.35,0.75)",
        "(2.44,1.49)",
        "(3.27,2.20)",
        "(3.88,2.88)",
        "(4.30,3.52)",
        "(4.54,4.09)",
        "(4.65,4.61)",
        "(4.64,5.04)",
        "(4.54,5.38)",
        "(4.37,5.62)",
        "(4.17,5.75)",
        "(3.96,5.76)",
        "(3.76,5.63)",
        "(3.60,5.35)",
        "(3.52,4.92)",
        "(3.52,4.32)",
        "(3.64,3.54)",
        "(3.92,2.56)",
        "(4.36,1.39)",
        "(5.00,-0.00)",
      ]
    `)
  })
})

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
