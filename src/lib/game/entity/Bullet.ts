/**
 * This class stores the state of a bullet on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import type { Ref } from 'lib/types'

import { Exclude } from 'class-transformer'
import { IProjectile } from 'lib/game/component/Projectile'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'

import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'
import GameServices from 'server/GameServices'

export default class Bullet extends Entity implements IProjectile {
  static readonly DEFAULT_DAMAGE = 1
  static readonly SPEED = 1.2
  static readonly MAX_TRAVEL_DISTANCE = 1000
  static readonly HITBOX_SIZE = 10

  angle: number
  // Workaround to reference the Player type without depending on load order.
  // TODO: Implement a kill attribution interface for the player to implement to
  // prevent this class from needing a reference to Player.
  // https://stackoverflow.com/a/77248059
  @Exclude() source: Ref<Player>

  damage: number = Bullet.DEFAULT_DAMAGE
  distanceTraveled: number = 0 // accumulated square of the distance travelled

  constructor(
    position: Vector,
    velocity: Vector,
    angle: number,
    source: Player,
  ) {
    super(position, velocity, Vector.zero(), Bullet.HITBOX_SIZE)
    this.angle = angle
    this.source = source
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
      player.physics.position.copy(),
      Vector.fromPolar(Bullet.SPEED, angle),
      angle,
      player,
    )
  }

  override update(updateFrame: UpdateFrame, services: GameServices): void {
    const displacement = this.physics.updatePosition(updateFrame.deltaTime)
    this.distanceTraveled += displacement.mag2
    if (
      !this.inWorld() ||
      this.distanceTraveled > Bullet.MAX_TRAVEL_DISTANCE ** 2
    ) {
      this.destroy(services)
    }
  }
}
