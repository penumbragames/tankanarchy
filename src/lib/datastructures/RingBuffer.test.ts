/**
 * Testing for RingBuffer
 * @author omgimanerd
 */

import { expect, test } from 'bun:test'
import RingBuffer from 'lib/datastructures/RingBuffer'

test('RingBuffer', () => {
  const r = new RingBuffer(5)

  expect(() => r.pop()).toThrow()
  expect(r.head).toBeUndefined()
  expect(r.tail).toBeUndefined()
  expect(r.capacity).toBe(5)

  expect(r.data).toEqual([])
  expect(r.size).toBe(0)

  r.push(1)
  expect(r.head).toBe(1)
  expect(r.tail).toBe(1)

  r.push(2)
  r.push(3)
  expect(r.data).toEqual([1, 2, 3])
  expect(r.size).toBe(3)
  expect(r.head).toBe(1)
  expect(r.tail).toBe(3)

  r.push(4)
  r.push(5)
  expect(r.data).toEqual([1, 2, 3, 4, 5])
  expect(r.size).toBe(5)
  expect(r.head).toBe(1)
  expect(r.tail).toBe(5)

  r.push(6)
  expect(r.data).toEqual([2, 3, 4, 5, 6])
  expect(r.size).toBe(5)
  expect(r.head).toBe(2)
  expect(r.tail).toBe(6)

  r.push(7)
  r.push(8)
  r.push(9)
  expect(r.data).toEqual([5, 6, 7, 8, 9])
  expect(r.size).toBe(5)
  expect(r.head).toBe(5)
  expect(r.tail).toBe(9)

  expect(r.pop()).toBe(5)
  expect(r.head).toBe(6)
  expect(r.tail).toBe(9)

  expect(r.pop()).toBe(6)
  expect(r.pop()).toBe(7)
  expect(r.pop()).toBe(8)
  expect(r.size).toBe(1)
  expect(r.data).toEqual([9])
  expect(r.head).toBe(9)
  expect(r.tail).toBe(9)

  expect(r.pop()).toBe(9)
  expect(r.size).toBe(0)
  expect(r.data).toEqual([])
  expect(r.head).toBeUndefined()
  expect(r.tail).toBeUndefined()

  expect(() => r.pop()).toThrow()
})
