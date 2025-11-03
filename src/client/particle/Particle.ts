import { SpriteLoader } from 'client/graphics/SpriteLoader'
import PARTICLES from 'lib/enums/Particles'
import Entity from 'lib/game/Entity'
import Vector from 'lib/math/Vector'

export default class Particle extends Entity {
  static readonly TIME_PER_ANIMATION_FRAME = 50 // ms units

  type: PARTICLES
  frame: number = 0
  frames: number

  accumulator: number = 0

  constructor(type: PARTICLES, position: Vector) {
    super(position, Vector.zero(), Vector.zero(), 0)
    this.type = type
    this.frames = SpriteLoader.particleSprites[this.type].frames
  }

  update(lastUpdateTime: number, deltaTime: number): void {
    if (!this.destroyed) {
      this.accumulator += deltaTime
      this.frame = Math.floor(
        this.accumulator / Particle.TIME_PER_ANIMATION_FRAME,
      )
      if (this.frame >= this.frames) {
        this.destroyed = true
      }
    }
  }
}
