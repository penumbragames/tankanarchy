/**
 * An entity is an object in the game with physics and a hitbox.
 * @author omgimanerd
 */

import { Type } from 'class-transformer'
import * as Constants from 'lib/Constants'
import { Hitbox, IHitbox } from 'lib/game/component/Hitbox'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'
import GameServices from 'server/GameServices'

export default abstract class Entity implements IPhysics, IHitbox, IUpdateable {
  @Type(() => Physics) physics: Physics
  @Type(() => Hitbox) hitbox: Hitbox

  destroyed: boolean = false

  constructor(
    position: Vector,
    velocity: Vector,
    acceleration: Vector,
    hitboxSize: number,
  ) {
    this.physics = new Physics(position, velocity, acceleration)
    this.hitbox = new Hitbox(this.physics, hitboxSize)
  }

  /**
   * Updates this entity's state.
   * @param {UpdateFrame} _updateFrame An object containing the last update
   *   time, current time, and delta time.
   * @param {GameServices} _services A helper object to access and modify the
   *   game state.
   */
  update(_updateFrame: UpdateFrame, _services: GameServices) {}

  destroy(_services: GameServices) {
    this.destroyed = true
  }

  collided(other: IHitbox): boolean {
    return this.hitbox.collided(other.hitbox)
  }

  /**
   * Returns true if this entity is inside the bounds of the game world.
   */
  inWorld(): boolean {
    return (
      Util.inBound(
        this.physics.position.x,
        Constants.WORLD_MIN,
        Constants.WORLD_MAX,
      ) &&
      Util.inBound(
        this.physics.position.y,
        Constants.WORLD_MIN,
        Constants.WORLD_MAX,
      )
    )
  }

  /**
   * Clamps this entity's position within the game world.
   */
  boundToWorld(): void {
    this.physics.position.x = Util.clamp(
      this.physics.position.x,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
    this.physics.position.y = Util.clamp(
      this.physics.position.y,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
  }
}
