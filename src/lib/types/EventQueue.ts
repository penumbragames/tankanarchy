/**
 * @author omgimanerd
 */

import type { Optional } from 'lib/types/types'

export class EventQueue<T> {
  queue: T[] = []

  options: Optional<EventQueue.Options>

  constructor(options?: Optional<EventQueue.Options>) {
    this.options = options ?? {}
  }

  add(event: T): boolean {
    if (this.options?.maxSize && this.queue.length >= this.options.maxSize) {
      return false
    }
    this.queue.push(event)
    return true
  }

  consume(): Optional<T> {
    // TODO: optimize later with a linked list or some shit
    return this.queue.shift()
  }
}

export namespace EventQueue {
  export type Options = Partial<{
    maxSize: number
  }>
}
