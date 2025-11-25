/**
 * The Rocket encapsulates a rocket fired by a player.
 * @author omgimanerd
 */

import type { Ref } from 'lib/types/types'

import { Exclude } from 'class-transformer'
import SOUNDS from 'lib/enums/Sounds'
import { IProjectile } from 'lib/game/component/Projectile'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Entity from 'lib/game/entity/Entity'
import Explosion from 'lib/game/entity/Explosion'
import Player from 'lib/game/entity/player/Player'
import Vector from 'lib/math/Vector'
import { GameServices } from 'server/GameServices'

export default class Rocket extends Entity implements IProjectile {
  static readonly DEFAULT_DAMAGE = 3
  static readonly SPEED = 0.85
  static readonly MAX_TRAVEL_DISTANCE = 800
  // If the explosion threshold distance is too small, it is possible a single
  // update tick may take the rocket entity past the target.
  static readonly EXPLOSION_DISTANCE_THRESHOLD = 5
  static readonly HITBOX_SIZE = 10

  angle: number
  @Exclude() source: Ref<Player>
  damage: number = Rocket.DEFAULT_DAMAGE
  distanceTraveled: number = 0
  maxDistance: number // Computed from the target position

  constructor(
    position: Vector,
    velocity: Vector,
    angle: number,
    source: Player,
    maxDistance: number,
  ) {
    super(position, velocity, Vector.zero(), Rocket.HITBOX_SIZE)
    this.angle = angle
    this.source = source
    this.maxDistance = maxDistance
  }

  static createFromPlayer(player: Player, target: Vector): Rocket {
    const angle = player.turretAngle
    return new Rocket(
      player.physics.position.copy(),
      Vector.fromPolar(Rocket.SPEED, angle),
      angle,
      player,
      Math.min(
        Vector.sub(target, player.physics.position).mag,
        Rocket.MAX_TRAVEL_DISTANCE,
      ),
    )
  }

  override update(updateFrame: UpdateFrame, services: GameServices): void {
    const displacement = this.physics.updatePosition(updateFrame.deltaTime)
    this.distanceTraveled += displacement.mag
    if (!this.inWorld() || this.distanceTraveled > this.maxDistance) {
      this.destroy(services)
    }
  }

  override destroy(services: GameServices): void {
    super.destroy(services)
    services.addEntity(
      Explosion.create(
        this.physics.position,
        this.source,
        services.updateFrame.currentTime,
      ),
    )
    services.playSound({
      type: SOUNDS.EXPLOSION,
      source: this.physics.position,
    })
    services.addMultiExplosionParticles(this.physics.position, {
      size: 100,
      spread: 25,
      density: 7,
      delay: 0,
    })
  }
}
