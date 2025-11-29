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
        "(0.06,0.00)",
        "(0.20,0.00)",
        "(0.42,0.02)",
        "(0.67,0.04)",
        "(0.96,0.08)",
        "(1.25,0.13)",
        "(1.54,0.21)",
        "(1.82,0.31)",
        "(2.08,0.45)",
        "(2.31,0.61)",
        "(2.53,0.82)",
        "(2.72,1.06)",
        "(2.90,1.35)",
        "(3.08,1.69)",
        "(3.27,2.09)",
        "(3.48,2.54)",
        "(3.74,3.05)",
        "(4.06,3.63)",
        "(4.47,4.28)",
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
        "(0.14,0.07)",
        "(0.49,0.26)",
        "(0.98,0.55)",
        "(1.55,0.91)",
        "(2.15,1.33)",
        "(2.73,1.78)",
        "(3.26,2.26)",
        "(3.71,2.75)",
        "(4.09,3.25)",
        "(4.37,3.75)",
        "(4.59,4.25)",
        "(4.75,4.75)",
        "(4.89,5.26)",
        "(5.05,5.78)",
        "(5.27,6.33)",
        "(5.63,6.91)",
        "(6.20,7.55)",
        "(7.05,8.26)",
        "(8.28,9.07)",
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
        "(0.14,0.07)",
        "(0.49,0.28)",
        "(0.98,0.60)",
        "(1.54,1.02)",
        "(2.13,1.52)",
        "(2.69,2.08)",
        "(3.18,2.67)",
        "(3.58,3.26)",
        "(3.88,3.84)",
        "(4.06,4.37)",
        "(4.13,4.83)",
        "(4.10,5.18)",
        "(4.00,5.40)",
        "(3.85,5.44)",
        "(3.69,5.27)",
        "(3.58,4.86)",
        "(3.59,4.17)",
        "(3.77,3.16)",
        "(4.21,1.78)",
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
