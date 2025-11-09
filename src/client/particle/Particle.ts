/**
 * @author omgimanerd
 */

import PARTICLES from 'lib/enums/Particles'

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import { AnimationManager, TYPE } from 'client/lib/AnimationManager'
import Entity from 'lib/game/Entity'
import Vector from 'lib/math/Vector'

export default class Particle extends Entity {
  type: PARTICLES
  animationManager: AnimationManager

  constructor(type: PARTICLES, position: Vector) {
    super(position, Vector.zero(), Vector.zero(), 0)
    this.type = type
    this.animationManager = new AnimationManager(
      TYPE.SINGLE,
      <AnimatedSprite>PARTICLE_SPRITES[this.type],
    )
  }

  update(lastUpdateTime: number, deltaTime: number): void {
    this.animationManager.update(lastUpdateTime, deltaTime)
    this.destroyed = this.animationManager.finished
  }
}
