/**
 * Helper class for tracking abilities that can be used with a cooldown.
 * @author
 */

import { UpdateFrame } from 'lib/game/component/Updateable'

export default class Cooldown {
  lastUsage: number = 0
  cooldown: number

  constructor(cooldown: number) {
    this.cooldown = cooldown
  }

  ready(updateFrame: UpdateFrame): boolean {
    return updateFrame.currentTime > this.lastUsage + this.cooldown
  }

  trigger(updateFrame: UpdateFrame): void {
    this.lastUsage = updateFrame.currentTime
  }
}
