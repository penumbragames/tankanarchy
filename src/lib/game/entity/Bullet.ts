/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { Type } from 'class-transformer'
import Entity from 'lib/game/Entity'

import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'

// Workaround to reference the Player type without depending on load order.
// TODO: Implement a kill attribution interface for the player to implement to
// prevent this class from needing a reference to Player.
// https://stackoverflow.com/a/77248059
type Ref<T> = T

export default class Bullet extends Entity {
  static readonly DEFAULT_DAMAGE = 1
  static readonly SPEED = 1.2
  static readonly MAX_TRAVEL_DISTANCE = 1000
  static readonly HITBOX_SIZE = 10

  angle: number

  @Type(() => Player) source: Ref<Player>

  damage: number
  distanceTraveled: number

  constructor(
    position: Vector,
    velocity: Vector,
    angle: number,
    source: Player,
  ) {
    super(position, velocity, Vector.zero(), Bullet.HITBOX_SIZE)

    this.angle = angle
    this.source = source

    this.damage = Bullet.DEFAULT_DAMAGE
    this.distanceTraveled = 0
    this.destroyed = false
  }

  /**
   * Creates a new Bullet object from a Player object firing it.
   * @param {Player} player The Player object firing the bullet
   * @param {number} [angleDeviation=0] The angle deviation if the bullet is
   *   not traveling in the direction of the turret
   */
  static createFromPlayer(player: Player, angleDeviation: number): Bullet {
    const angle = player.turretAngle + angleDeviation
    return new Bullet(
      player.position.copy(),
      Vector.fromPolar(Bullet.SPEED, angle),
      angle,
      player,
    )
  }

  /**
   * Performs a physics update.
   * @param {number} _lastUpdateTime The last timestamp an update occurred,
   * unused
   * @param {number} deltaTime The timestep to compute the update with
   */
  override update(_lastUpdateTime: number, deltaTime: number): void {
    const distanceStep = Vector.scale(this.velocity, deltaTime)
    this.position.add(distanceStep)
    if (!this.inWorld()) {
      this.destroyed = true
      return
    }
    this.distanceTraveled += distanceStep.mag2
    if (this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE ** 2) {
      this.destroyed = true
    }
  }
}
