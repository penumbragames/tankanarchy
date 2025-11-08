// Testing for object serialization to and from JSON

import { beforeEach, describe, expect, setSystemTime, test } from 'bun:test'

import POWERUPS from 'lib/enums/Powerups'
import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import { Powerup } from 'lib/game/Powerup'
import { HealthPowerup, PowerupState } from 'lib/game/PowerupState'
import Vector from 'lib/math/Vector'
import { getReplacerReviver } from 'lib/serialization/ReplacerReviver'
import { GameState } from 'lib/socket/SocketInterfaces'

const UNIXTIME_1 = new Date('1970-01-01T00:00:00.001Z')

const { replacer, reviver } = getReplacerReviver({
  Bullet,
  Player,
  Powerup,
  PowerupState,
  HealthPowerup,
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
    let p = new Powerup(Vector.one(), POWERUPS.HEALTH_PACK)
    const serialized = stringify(p)

    // Use bun test -u to update.
    expect(serialized).toMatchInlineSnapshot(
      `"{"hitboxSize":5,"destroyed":false,"position":{"x":1,"y":1},"velocity":{"x":0,"y":0},"acceleration":{"x":0,"y":0},"type":"HEALTH_PACK","__type__":"Powerup"}"`,
    )

    const deserialized: Powerup = parse(serialized)
    expect(deserialized).toBeInstanceOf(Powerup)
    expect(deserialized).toMatchInlineSnapshot(`
      Powerup {
        "acceleration": Vector {
          "x": 0,
          "y": 0,
        },
        "destroyed": false,
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
    // Add a powerup to the player to serialize.
    const powerup = new HealthPowerup()
    powerup.duration = 1
    powerup.expirationTime = 2
    p.powerups.set(POWERUPS.HEALTH_PACK, powerup)

    const serialized = stringify(p)

    // Use bun test -u to update.
    expect(serialized).toMatchInlineSnapshot(
      `"{"hitboxSize":20,"destroyed":false,"position":{"x":3,"y":4},"velocity":{"x":0,"y":0},"acceleration":{"x":0,"y":0},"name":"test_player","tankAngle":2,"turretAngle":0,"turnRate":0,"speed":0.4,"health":10,"kills":0,"deaths":0,"powerups":{"HEALTH_PACK":{"type":"HEALTH_PACK","duration":1,"expirationTime":2,"expired":false,"healAmount":0}},"__type__":"Player"}"`,
    )

    const deserialized: Player = parse(serialized)
    expect(deserialized).toBeInstanceOf(Player)
    // Use bun test -u to update.
    expect(deserialized).toMatchSnapshot()
    expect(deserialized.isDead()).toBe(false)
    // Check that the nested objects deserialize properly.
    expect(deserialized.position).toBeInstanceOf(Vector)
    expect(deserialized.position.mag).toBe(5)
    const deserializedPowerup: PowerupState = deserialized.powerups.get(
      POWERUPS.HEALTH_PACK,
    )!
    expect(deserializedPowerup).toBeInstanceOf(PowerupState)
    expect(deserializedPowerup.remainingMs).toBe(1)
    expect(deserializedPowerup.remainingSeconds).toBe(0.001)
  })
})

describe('Test serializing/deserializing complex objects', () => {
  test('Fake GameState object with one Player and one Bullet', () => {
    const p = createFakePlayer()
    const b = Bullet.createFromPlayer(p, Math.PI)
    const powerup = new Powerup(Vector.one(), POWERUPS.HEALTH_PACK)
    const obj: GameState = {
      self: p,
      players: [],
      projectiles: [b],
      powerups: [powerup],
    }
    const serialized = stringify(obj)

    // Use bun test -u to update.
    expect(serialized).toMatchSnapshot()

    const deserialized: GameState = parse(serialized)
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
