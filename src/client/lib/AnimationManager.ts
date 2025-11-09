/**
 * AnimationManager is a class to track which frame of animation to render for
 * instances of entities or particles that have animated sprites.
 * @author omgimanerd
 */

import AnimatedSprite from 'client/graphics/AnimatedSprite'

export enum TYPE {
  SINGLE = 'SINGLE',
  LOOP = 'LOOP',
}

export class AnimationManager {
  static readonly TIME_PER_ANIMATION_FRAME = 50

  type: TYPE
  frame: number = 0
  frames: number

  accumulator: number = 0

  finished: boolean = false

  constructor(type: TYPE, sprite: AnimatedSprite) {
    this.type = type
    this.frames = sprite.frames
  }

  update(_lastUpdateTime: number, deltaTime: number) {
    if (!this.finished) {
      this.accumulator += deltaTime
      this.frame = Math.min(
        Math.floor(
          this.accumulator / AnimationManager.TIME_PER_ANIMATION_FRAME,
        ),
      )
    }

    switch (this.type) {
      case TYPE.SINGLE:
        if (this.frame >= this.frames) {
          this.finished = true
        }
      case TYPE.LOOP:
        this.frame %= this.frames
    }
  }
}
