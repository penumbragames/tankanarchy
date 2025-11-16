/**
 * The Rocket encapsulates a rocket fired by a player.
 * @author omgimanerd
 */

import { Exclude } from 'class-transformer'
import IProjectile from 'lib/game/component/Projectile'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'
import Player from 'lib/game/entity/Player'
import Vector from 'lib/math/Vector'
import GameServices from 'server/GameServices'

export default class Rocket extends Entity implements IProjectile {
  static readonly DEFAULT_DAMAGE = 3
  static readonly SPEED = 2
  static readonly MAX_TRAVEL_DISTANCE = 1000
  static readonly HITBOX_SIZE = 10

  angle: number
  @Exclude() source: Player

  damage: number = Rocket.DEFAULT_DAMAGE
  distanceTraveled: number = 0 // accumulated square of the distance travelled

  constructor(
    position: Vector,
    velocity: Vector,
    angle: number,
    source: Player,
  ) {
    super(position, velocity, Vector.zero(), Rocket.HITBOX_SIZE)
    this.angle = angle
    this.source = source
  }

  static createFromPlayer(player: Player): Rocket {
    const angle = player.turretAngle
    return new Rocket(
      player.physics.position.copy(),
      Vector.fromPolar(Rocket.SPEED, angle),
      angle,
      player,
    )
  }

  override update(updateFrame: UpdateFrame, services: GameServices): void {
    const displacement = this.physics.updatePosition(updateFrame.deltaTime)
    this.distanceTraveled += displacement.mag2
    if (
      !this.inWorld() ||
      this.distanceTraveled > Rocket.MAX_TRAVEL_DISTANCE ** 2
    ) {
      this.destroy(services)
    }
  }
}
