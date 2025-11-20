/**
 * Testing for the BinarySignal class.
 * @author omgimanerd
 */

import { describe, expect, mock, test } from 'bun:test'
import BinarySignal from 'lib/math/BinarySignal'

describe('Test the BinarySignal edge detectors', () => {
  test('Low State Initialization', () => {
    const onRise = mock(() => {})
    const onFall = mock(() => {})

    const bs = new BinarySignal(false, onRise, onFall)

    bs.update(false)
    expect(onRise).toHaveBeenCalledTimes(0)
    expect(onFall).toHaveBeenCalledTimes(0)

    bs.update(true)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(0)

    bs.update(true)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(0)

    bs.update(false)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(1)

    bs.update(false)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(1)
  })

  test('High State Initialization', () => {
    const onRise = mock(() => {})
    const onFall = mock(() => {})

    const bs = new BinarySignal(true, onRise, onFall)

    bs.update(true)
    expect(onRise).toHaveBeenCalledTimes(0)
    expect(onFall).toHaveBeenCalledTimes(0)

    bs.update(false)
    expect(onRise).toHaveBeenCalledTimes(0)
    expect(onFall).toHaveBeenCalledTimes(1)

    bs.update(false)
    expect(onRise).toHaveBeenCalledTimes(0)
    expect(onFall).toHaveBeenCalledTimes(1)

    bs.update(true)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(1)

    bs.update(true)
    expect(onRise).toHaveBeenCalledTimes(1)
    expect(onFall).toHaveBeenCalledTimes(1)
  })
})
