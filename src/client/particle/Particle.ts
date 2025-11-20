/**
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'

import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import { Animation, IAnimation, TYPE } from 'lib/game/component/Animation'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'
import Vector from 'lib/math/Vector'

export default class Particle implements IPhysics, IUpdateable, IAnimation {
  physics: Physics

  type: PARTICLES
  animation: Animation

  destroyed: boolean = false

  constructor(type: PARTICLES, position: Vector) {
    this.physics = new Physics(position, Vector.zero(), Vector.zero())
    this.type = type
    this.animation = new Animation(
      TYPE.SINGLE,
      PARTICLE_SPRITES[this.type].frames,
    )
  }

  update(updateFrame: UpdateFrame): void {
    this.animation.update(updateFrame)
    this.destroyed = this.animation.finished
  }
}
