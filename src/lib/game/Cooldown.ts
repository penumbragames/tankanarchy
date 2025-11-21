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

  reset(updateFrame: UpdateFrame): void {
    this.lastUsage = updateFrame.currentTime
  }

  /**
   * Combines ready() and reset(), can be called in a conditional which returns
   * true when the cooldown is up and whatever tracked ability can be used.
   */
  trigger(updateFrame: UpdateFrame): boolean {
    const ready = this.ready(updateFrame)
    if (ready) this.reset(updateFrame)
    return ready
  }
}
