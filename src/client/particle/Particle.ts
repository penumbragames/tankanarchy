/**
 * Subclasses for particles to render from sprites or from programmatic drawing.
 * @author omgimanerd
 */

import type { ParticleDrawingOptions } from 'lib/types/Particle'

import PARTICLES from 'lib/enums/Particles'

import AnimatedSprite from 'client/graphics/AnimatedSprite'
import { PARTICLE_SPRITES } from 'client/graphics/Sprites'
import StaticSprite from 'client/graphics/StaticSprite'
import Viewport from 'client/graphics/Viewport'
import { Animation, IAnimation, TYPE } from 'lib/game/component/Animation'
import { IDrawable } from 'lib/game/component/Drawable'
import { IPhysics, Physics } from 'lib/game/component/Physics'
import { IUpdateableClient, UpdateFrame } from 'lib/game/component/Updateable'
import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'

/**
 * Abstract base class to maintain the particle's physics, type, and rendering
 * options.
 */
export abstract class Particle
  implements IPhysics, IUpdateableClient, IDrawable
{
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
  abstract render(context: CanvasRenderingContext2D, viewport: Viewport): void
}

/**
 * Static particle with some fade-out functionality derived from a static asset.
 */
export class StaticParticle extends Particle {
  sprite: StaticSprite

  creationTime: number
  expirationTime: number

  opacity: number = 1

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    super(type, position, options)
    this.sprite = <StaticSprite>PARTICLE_SPRITES[type]
    if (!(this.sprite instanceof StaticSprite)) {
      throw new Error(`Failed to create static particle from type ${type}`)
    }
    this.creationTime = options.creationTime ?? 0
    this.expirationTime = options.expirationTime ?? 0
  }

  override update(updateFrame: UpdateFrame): void {
    this.opacity = MathUtil.clamp(
      MathUtil.lerp(
        updateFrame.currentTime,
        this.creationTime,
        this.expirationTime,
        1,
        0,
      ),
      0,
      1,
    )
    this.destroyed = updateFrame.currentTime > this.expirationTime
  }

  override render(context: CanvasRenderingContext2D, viewport: Viewport): void {
    this.sprite.draw(context, {
      position: viewport.toCanvas(this.physics.position),
      size: this.options.size,
      centered: true,
      angle: this.options.angle,
      opacity: this.opacity,
    })
  }
}

/**
 * Animated particle derived from an animated sprite asset.
 */
export class AnimatedParticle extends Particle implements IAnimation {
  sprite: AnimatedSprite
  animation: Animation

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    super(type, position, options)
    this.sprite = <AnimatedSprite>PARTICLE_SPRITES[type]
    if (!(this.sprite instanceof AnimatedSprite)) {
      throw new Error(
        `Failed to create animated particle with from type ${type}`,
      )
    }
    this.animation = new Animation(
      TYPE.SINGLE,
      PARTICLE_SPRITES[this.type]!.frames,
    )
  }

  override update(updateFrame: UpdateFrame): void {
    this.animation.update(updateFrame)
    this.destroyed = this.animation.finished
  }

  override render(context: CanvasRenderingContext2D, viewport: Viewport): void {
    this.sprite.draw(context, {
      position: viewport.toCanvas(this.physics.position),
      size: this.options.size,
      centered: true,
      angle: this.options.angle,
      frame: this.animation.frame,
    })
  }
}

export class LaserBeamParticle extends Particle {
  creationTime: number
  expirationTime: number

  constructor(
    type: PARTICLES,
    position: Vector,
    options: ParticleDrawingOptions,
  ) {
    super(type, position, options)
    this.creationTime = options.creationTime ?? 0
    this.expirationTime = options.expirationTime ?? 0
  }

  override update(updateFrame: UpdateFrame): void {
    this.destroyed = updateFrame.currentTime > this.expirationTime
  }

  override render(
    context: CanvasRenderingContext2D,
    viewport: Viewport,
  ): void {}
}

export type ParticleConstructor = new (
  type: PARTICLES,
  position: Vector,
  options: ParticleDrawingOptions,
) => Particle

export const ParticleConstructors: {
  [key in PARTICLES]: ParticleConstructor
} = {
  [PARTICLES.EXPLOSION]: AnimatedParticle,
  [PARTICLES.TANK_TRAIL]: StaticParticle,
  [PARTICLES.LASER_BEAM]: LaserBeamParticle,
}
