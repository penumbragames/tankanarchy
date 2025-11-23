/**
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'

import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import { Animation, IAnimation, TYPE } from 'lib/game/component/Animation'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateableClient, UpdateFrame } from 'lib/game/component/Updateable'
import Vector from 'lib/math/Vector'
import { ParticleDrawingOptions } from 'server/GameServices'

export default class Particle
  implements IPhysics, IUpdateableClient, IAnimation
{
  physics: Physics

  type: PARTICLES
  options: Partial<ParticleDrawingOptions>
  animation: Animation

  destroyed: boolean = false

  constructor(
    type: PARTICLES,
    position: Vector,
    options?: Partial<ParticleDrawingOptions>,
  ) {
    this.physics = new Physics(position, Vector.zero(), Vector.zero())
    this.type = type
    this.options = options ?? {}
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
