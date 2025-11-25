/**
 * @author omgimanerd
 */

import type { Nullable } from 'lib/types/types'

import PARTICLES from 'lib/enums/Particles'

import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import { Animation, IAnimation, TYPE } from 'lib/game/component/Animation'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateableClient, UpdateFrame } from 'lib/game/component/Updateable'
import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'
import { ParticleDrawingOptions } from 'lib/types/Particle'

export abstract class Particle_ implements IPhysics, IUpdateableClient {
  physics: Physics

  type: PARTICLES
  options: ParticleDrawingOptions

  destroyed: boolean = false

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    this.physics = new Physics(position, Vector.zero(), Vector.zero())
    this.type = type
    this.options = options
  }

  abstract update(updateFrame: UpdateFrame): void
  abstract render(context: CanvasRenderingContext2D): void
}

export class StaticParticle extends Particle_ {
  creationTime: number
  expirationTime: number

  opacity: number = 1

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    super(type, position, options)

    this.creationTime = options.startTime ?? 0
    this.expirationTime = options.expirationTime ?? 0
  }

  override update(updateFrame: UpdateFrame): void {
    this.opacity = MathUtil.lerp(
      updateFrame.currentTime,
      this.creationTime,
      this.expirationTime,
      1,
      0,
    )
    this.destroyed = updateFrame.currentTime > this.expirationTime
  }

  override render(context: CanvasRenderingContext2D): void {
    // TODO
  }
}

export class AnimatedParticle extends Particle_ implements IAnimation {
  animation: Animation

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    super(type, position, options)

    this.animation = new Animation(
      TYPE.SINGLE,
      PARTICLE_SPRITES[this.type].frames,
    )
  }

  override update(updateFrame: UpdateFrame): void {
    this.animation.update(updateFrame)
    this.destroyed = this.animation.finished
  }

  override render(context: CanvasRenderingContext2D): void {
    // TODO
  }
}

export class Particle implements IPhysics, IUpdateableClient, IAnimation {
  physics: Physics

  type: PARTICLES
  options: ParticleDrawingOptions
  animation: Nullable<Animation> = null

  opacity: number = 1

  destroyed: boolean = false

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    this.physics = new Physics(position, Vector.zero(), Vector.zero())
    this.type = type
    this.options = options

    if (options.animated) {
      this.animation = new Animation(
        TYPE.SINGLE,
        PARTICLE_SPRITES[this.type].frames,
      )
    }
  }

  update(updateFrame: UpdateFrame): void {
    if (this.animation) {
      this.animation.update(updateFrame)
      this.destroyed = this.animation.finished
    }
    if (
      this.options.fadeOut &&
      this.options.startTime &&
      this.options.expirationTime
    ) {
      this.opacity = MathUtil.lerp(
        updateFrame.currentTime,
        this.options.startTime,
        this.options.expirationTime,
        1,
        0,
      )
      this.destroyed = updateFrame.currentTime > this.options.expirationTime
    }
  }
}
