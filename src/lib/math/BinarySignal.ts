/**
 * Helper class to trigger events on leading and rising edge triggers.
 * @author omgimanerd
 */

import type { Nullable, Optional } from 'lib/types'

type TriggerFn = () => void

/**
 * BinarySignal tracks the leading and falling edge of a boolean signal. The
 * class can be used in one of two ways:
 *   - The leading and falling edges can be each assigned respective callbacks.
 *   - The leading and falling edges will add a corresponding event to the
 *     internal event that can be consumed.
 * If callbacks are set, it is an error to attempt to consume events.
 */
export class BinarySignal {
  previous: boolean = false

  // Populated if no callbacks are set
  eventQueue: BinarySignal.Event[] = []

  // Rising and falling edge callbacks
  onRise: Nullable<TriggerFn>
  onFall: Nullable<TriggerFn>

  constructor(startingState: boolean, onRise?: TriggerFn, onFall?: TriggerFn) {
    this.previous = startingState
    this.onRise = onRise ?? null
    this.onFall = onFall ?? null
  }

  update(state: boolean) {
    if (this.previous && !state) {
      if (this.onFall) {
        this.onFall()
      } else {
        this.eventQueue.push(BinarySignal.Event.FALL)
      }
    } else if (!this.previous && state) {
      if (this.onRise) {
        this.onRise()
      } else {
        this.eventQueue.push(BinarySignal.Event.RISE)
      }
    }
    this.previous = state
  }

  consume(): Optional<BinarySignal.Event> {
    if (this.onRise || this.onFall) {
      throw new Error('Cannot consume if callbacks are set!')
    }
    return this.eventQueue.shift()
  }
}

export namespace BinarySignal {
  export enum Event {
    RISE = 'RISE',
    FALL = 'FALL',
  }
}
