/**
 * Unit tests for Vector class.
 * @author omgimanerd
 */

import { expect, test } from 'bun:test'

import 'bun-custom-matchers'
import Vector from 'lib/math/Vector'

test('Vector dot product', () => {
  expect(new Vector(1, 2).dot(new Vector(3, 4))).toBe(11)
  expect(Vector.zero().dot(Vector.one())).toBe(0)
})

test('Vector projection', () => {
  const a = new Vector(0, 5)
  const b = new Vector(3, 4)
  const c = new Vector(5, 0)

  expect(a.proj(c)).vectorEquals(Vector.zero())
  expect(b.proj(a)).vectorEquals(new Vector(0, 4))
  expect(b.proj(c)).vectorEquals(new Vector(3, 0))

  expect(a.proj(b)).vectorEquals(new Vector(2.4, 3.2))
})
