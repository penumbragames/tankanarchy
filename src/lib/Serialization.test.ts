// Testing for object serialization to and from JSON

import 'reflect-metadata'

import { beforeEach, describe, expect, setSystemTime, test } from 'bun:test'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { POWERUP_TYPES } from 'lib/Constants'

import Vector from 'lib/Vector'
import Player from 'server/Player'
import Powerup from 'server/Powerup'

describe('Test serializing/deserializing class instances', () => {
  const UNIXTIME_1 = new Date('1970-01-01T00:00:00.001Z')

  beforeEach(() => {
    setSystemTime(UNIXTIME_1)
  })

  test('Vector', () => {
    const v = new Vector(1, 2)
    const serializedV = instanceToPlain(v)
    expect(serializedV).toMatchObject({
      x: 1,
      y: 2,
    })

    const dv = plainToInstance(Vector, serializedV)
    expect(dv.x).toBe(1)
    expect(dv.y).toBe(2)
  })

  test('Powerup', () => {
    let p = new Powerup(Vector.one(), POWERUP_TYPES.HEALTH_PACK, 1, 2)
    const serializedP = instanceToPlain(p)
    serializedP.expirationTime = 5001

    // Use bun test -u to update.
    expect(serializedP).toMatchInlineSnapshot(`
      {
        "acceleration": {
          "x": 0,
          "y": 0,
        },
        "data": 1,
        "destroyed": false,
        "duration": 2,
        "expirationTime": 5001,
        "hitboxSize": 5,
        "position": {
          "x": 1,
          "y": 1,
        },
        "type": "HEALTH_PACK",
        "velocity": {
          "x": 0,
          "y": 0,
        },
      }
    `)

    const deserializedP = plainToInstance(Powerup, serializedP)
    expect(serializedP.position).toMatchObject({
      x: 1,
      y: 1,
    })

    expect(deserializedP.remainingMs).toBe(5000)
    expect(deserializedP.remainingSeconds).toBe(5)
  })

  test('Player', () => {
    const name = 'test_player'
    const p = Player.create(name, 'stub_socket_id')
    p.position = Vector.zero()
    const powerup = new Powerup(Vector.one(), POWERUP_TYPES.HEALTH_PACK, 1, 2)
    p.applyPowerup(powerup)
    const serializedP = instanceToPlain(p)

    // Use bun test -u to update.
    expect(serializedP).toMatchInlineSnapshot(`
      {
        "acceleration": {
          "x": 0,
          "y": 0,
        },
        "deaths": 0,
        "destroyed": false,
        "health": 10,
        "hitboxSize": 20,
        "kills": 0,
        "name": "test_player",
        "position": {
          "x": 0,
          "y": 0,
        },
        "powerups": {
          "HEALTH_PACK": {
            "acceleration": {
              "x": 0,
              "y": 0,
            },
            "data": 1,
            "destroyed": false,
            "duration": 2,
            "expirationTime": 2,
            "hitboxSize": 5,
            "position": {
              "x": 1,
              "y": 1,
            },
            "type": "HEALTH_PACK",
            "velocity": {
              "x": 0,
              "y": 0,
            },
          },
        },
        "speed": 0.4,
        "tankAngle": 6.110729655359472,
        "turnRate": 0,
        "turretAngle": 0,
        "velocity": {
          "x": 0,
          "y": 0,
        },
      }
    `)

    const deserializedP = plainToInstance(Player, serializedP)
    // Test that the methods work.
    expect(deserializedP.isDead()).toBe(false)
    // Check that the nested objects deserialize properly.
    const powerups = deserializedP.powerups
    const healthpack = powerups.get(POWERUP_TYPES.HEALTH_PACK)

    expect(healthpack!.remainingMs).toBe(1)
    expect(healthpack!.remainingSeconds).toBe(0.001)
  })
})
