/**
 * Component for entities or objects with movement physics. Entities with
 * position, velocity, and acceleration should implement IPhysics.
 * @author omgimanerd
 */

import { Type } from 'class-transformer'

import Vector from 'lib/math/Vector'

export class Physics {
  @Type(() => Vector) position: Vector
  @Type(() => Vector) velocity: Vector
  @Type(() => Vector) acceleration: Vector

  constructor(position: Vector, velocity: Vector, acceleration: Vector) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
  }

  static create(): Physics {
    return new Physics(Vector.zero(), Vector.zero(), Vector.zero())
  }

  updatePosition(deltaTime: number): Vector {
    const displacement = Vector.scale(this.velocity, deltaTime)
    this.position.add(displacement)
    return displacement
  }

  updateVelocity(deltaTime: number): Vector {
    const velocityUpdate = Vector.scale(this.acceleration, deltaTime)
    this.velocity.add(velocityUpdate)
    return velocityUpdate
  }
}

export interface IPhysics {
  physics: Physics
}
