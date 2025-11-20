/**
 * Component for entities that have a corresponding animated sprite.
 * @author omgimanerd
 */

import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'

export enum TYPE {
  SINGLE = 'SINGLE',
  LOOP = 'LOOP',
}

export class Animation implements IUpdateable {
  static readonly TIME_PER_FRAME = 50 // ms

  type: TYPE
  frame: number = 0
  frames: number

  timeElapsed: number = 0

  finished: boolean = false

  constructor(type: TYPE, frames: number) {
    this.type = type
    this.frames = frames
  }

  update(updateFrame: UpdateFrame) {
    if (!this.finished) {
      this.timeElapsed += updateFrame.deltaTime
      this.frame = Math.min(
        Math.floor(this.timeElapsed / Animation.TIME_PER_FRAME),
      )
    }

    switch (this.type) {
      case TYPE.SINGLE:
        if (this.frame >= this.frames) {
          this.finished = true
        }
        break
      case TYPE.LOOP:
        this.frame %= this.frames
    }
  }
}

export interface IAnimation {
  animation: Animation
}
