/**
 * Helper class to trigger events on leading and rising edge triggers.
 * @author omgimanerd
 */

import { Nullable } from 'lib/types'

type TriggerFn = () => void

export default class BinarySignal {
  previous: boolean = false

  onRise: Nullable<TriggerFn>
  onFall: Nullable<TriggerFn>

  constructor(startingState: boolean, onRise?: TriggerFn, onFall?: TriggerFn) {
    this.previous = startingState
    this.onRise = onRise ?? null
    this.onFall = onFall ?? null
  }

  update(state: boolean) {
    if (this.previous && !state && this.onFall) {
      this.onFall()
    } else if (!this.previous && state && this.onRise) {
      this.onRise()
    }
    this.previous = state
  }
}
