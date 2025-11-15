/**
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import { AnimationManager, TYPE } from 'client/lib/AnimationManager'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'
import Vector from 'lib/math/Vector'

export default class Particle implements IPhysics, IUpdateable {
  physics: Physics

  type: PARTICLES
  animationManager: AnimationManager

  destroyed: boolean = false

  constructor(type: PARTICLES, position: Vector) {
    this.physics = new Physics(position, Vector.zero(), Vector.zero())
    this.type = type
    this.animationManager = new AnimationManager(
      TYPE.SINGLE,
      <AnimatedSprite>PARTICLE_SPRITES[this.type],
    )
  }

  update(updateFrame: UpdateFrame): void {
    this.animationManager.update(updateFrame)
    this.destroyed = this.animationManager.finished
  }
}
