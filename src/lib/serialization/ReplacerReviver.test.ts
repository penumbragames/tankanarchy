// Testing for object serialization to and from JSON

import { beforeEach, describe, expect, setSystemTime, test } from 'bun:test'

import { POWERUP_TYPES } from 'lib/Constants'
import { GAME_STATE } from 'lib/Interfaces'
import { getReplacerReviver } from 'lib/serialization/ReplacerReviver'
import Vector from 'lib/Vector'
import Bullet from 'server/Bullet'
import Player from 'server/Player'
import Powerup from 'server/Powerup'

const UNIXTIME_1 = new Date('1970-01-01T00:00:00.001Z')

const { replacer, reviver } = getReplacerReviver({
  Bullet,
  Player,
  Powerup,
  Vector,
})

const stringify = (v: any) => JSON.stringify(v, replacer)
const parse = (v: string) => JSON.parse(v, reviver)

/**
 * Helper method to get a Player instance with some stubbed in values.
 */
const createFakePlayer = (): Player => {
  const p = Player.create('test_player', 'socket_id')
  p.position = new Vector(3, 4)
  p.tankAngle = 2
  return p
}

describe('Test serializing/deserializing basic class instances', () => {
  beforeEach(() => {
    setSystemTime(UNIXTIME_1)
  })

  test('Vector', () => {
    const v = new Vector(1, 2)
    const serialized = stringify(v)
    // Use bun test -u to update.
    expect(serialized).toMatchInlineSnapshot(
      `"{"x":1,"y":2,"__type__":"Vector"}"`,
    )

    const deserialized: Vector = parse(serialized)
    expect(deserialized).toBeInstanceOf(Vector)
    expect(deserialized.x).toBe(1)
    expect(deserialized.y).toBe(2)
    // Deserialized object should not have the intermediate __typename__ field.
    expect(deserialized).toMatchInlineSnapshot(`
      Vector {
        "x": 1,
        "y": 2,
      }
    `)
  })

  test('Powerup', () => {
    let p = new Powerup(Vector.one(), POWERUP_TYPES.HEALTH_PACK, 1, 2)
    p.expirationTime = 5001
    const serialized = stringify(p)

    // Use bun test -u to update.
    expect(serialized).toMatchInlineSnapshot(
      `"{"hitboxSize":5,"destroyed":false,"position":{"x":1,"y":1},"velocity":{"x":0,"y":0},"acceleration":{"x":0,"y":0},"type":"HEALTH_PACK","data":1,"duration":2,"expirationTime":5001,"__type__":"Powerup"}"`,
    )

    const deserialized: Powerup = parse(serialized)
    expect(deserialized).toBeInstanceOf(Powerup)
    expect(deserialized.remainingMs).toBe(5000)
    expect(deserialized.remainingSeconds).toBe(5)
    expect(deserialized).toMatchInlineSnapshot(`
      Powerup {
        "acceleration": Vector {
          "x": 0,
          "y": 0,
        },
        "data": 1,
        "destroyed": false,
        "duration": 2,
        "expirationTime": 5001,
        "hitboxSize": 5,
        "position": Vector {
          "x": 1,
          "y": 1,
        },
        "type": "HEALTH_PACK",
        "velocity": Vector {
          "x": 0,
          "y": 0,
        },
      }
    `)
  })

  test('Player', () => {
    const p = createFakePlayer()
    // Add a random powerup to the player to serialize.
    const powerup = new Powerup(Vector.one(), POWERUP_TYPES.HEALTH_PACK, 1, 2)
    p.applyPowerup(powerup)

    const serialized = stringify(p)

    // Use bun test -u to update.
    expect(serialized).toMatchInlineSnapshot(
      `"{"hitboxSize":20,"destroyed":false,"position":{"x":3,"y":4},"velocity":{"x":0,"y":0},"acceleration":{"x":0,"y":0},"name":"test_player","tankAngle":2,"turretAngle":0,"turnRate":0,"speed":0.4,"health":10,"kills":0,"deaths":0,"powerups":{"HEALTH_PACK":{"hitboxSize":5,"destroyed":false,"position":{"x":1,"y":1},"velocity":{"x":0,"y":0},"acceleration":{"x":0,"y":0},"type":"HEALTH_PACK","data":1,"duration":2,"expirationTime":2}},"__type__":"Player"}"`,
    )

    const deserialized: Player = parse(serialized)
    expect(deserialized).toBeInstanceOf(Player)
    // Use bun test -u to update.
    expect(deserialized).toMatchSnapshot()
    expect(deserialized.isDead()).toBe(false)
    // Check that the nested objects deserialize properly.
    expect(deserialized.position).toBeInstanceOf(Vector)
    expect(deserialized.position.mag).toBe(5)
    expect(deserialized.powerups).toBeInstanceOf(Map)
    const deserializedPowerup: Powerup = deserialized.powerups.get(
      POWERUP_TYPES.HEALTH_PACK,
    )!
    expect(deserializedPowerup).toBeInstanceOf(Powerup)
    expect(deserializedPowerup.remainingMs).toBe(1)
    expect(deserializedPowerup.remainingSeconds).toBe(0.001)
  })
})

describe('Test serializing/deserializing complex objects', () => {
  test('Fake GameState object with one Player and one Bullet', () => {
    const p = createFakePlayer()
    const b = Bullet.createFromPlayer(p, Math.PI)
    const powerup = new Powerup(Vector.one(), POWERUP_TYPES.HEALTH_PACK, 1, 2)
    const obj: GAME_STATE = {
      self: p,
      players: [],
      projectiles: [b],
      powerups: [powerup],
    }
    const serialized = stringify(obj)

    // Use bun test -u to update.
    expect(serialized).toMatchSnapshot()

    const deserialized: GAME_STATE = parse(serialized)
    expect(deserialized).toMatchSnapshot()
    expect(deserialized.self).toBeInstanceOf(Player)
    expect(deserialized.self.isDead()).toBe(false)
    expect(deserialized.self.position).toBeInstanceOf(Vector)
    expect(deserialized.self.position.mag).toBe(5)

    expect(deserialized.projectiles).toBeArrayOfSize(1)
    const deserializedBullet = deserialized.projectiles[0]
    expect(deserializedBullet).toBeInstanceOf(Bullet)
    expect(deserializedBullet.source).toBeInstanceOf(Player)

    expect(deserialized.powerups).toBeArrayOfSize(1)
    const deserializedPowerup = deserialized.powerups[0]
    expect(deserializedPowerup).toBeInstanceOf(Powerup)
  })
})
