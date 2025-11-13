/**
 * Abstract class for all objects with basic physics, position, velocity, and
 * acceleration within the game world.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { Type } from 'class-transformer'

import * as Constants from 'lib/Constants'
import GameLoopUpdateable from 'lib/interfaces/GameLoopUpdateable'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'

export default abstract class PhysObject implements GameLoopUpdateable {
  @Type(() => Vector) position: Vector
  @Type(() => Vector) velocity: Vector
  @Type(() => Vector) acceleration: Vector
  destroyed: boolean = false

  constructor(position: Vector, velocity: Vector, acceleration: Vector) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
  }

  update(_lastUpdateTime: number, _deltaTime: number): void {}

  /**
   * Returns true if this PhysObject is inside the bounds of the game world.
   */
  inWorld(): boolean {
    return (
      Util.inBound(this.position.x, Constants.WORLD_MIN, Constants.WORLD_MAX) &&
      Util.inBound(this.position.y, Constants.WORLD_MIN, Constants.WORLD_MAX)
    )
  }

  /**
   * Clamps this PhysObject's position within the game world.
   */
  boundToWorld(): void {
    this.position.x = Util.clamp(
      this.position.x,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
    this.position.y = Util.clamp(
      this.position.y,
      Constants.WORLD_MIN,
      Constants.WORLD_MAX,
    )
  }
}
