/**
 * Ring buffer data structure.
 * @author omgimanerd
 */

export default class RingBuffer {
  static readonly DEFAULT_SIZE = 100

  private buffer: any[]
  private _head: number = 0
  private _tail: number = 0
  size: number = 0

  constructor(size: number = RingBuffer.DEFAULT_SIZE) {
    this.buffer = new Array(size)
  }

  get head() {
    return this.size === 0 ? undefined : this.buffer[this._head]
  }

  get tail() {
    return this.size === 0
      ? undefined
      : this.buffer[(this._tail - 1 + this.capacity) % this.capacity]
  }

  get capacity() {
    return this.buffer.length
  }

  get raw() {
    return this.buffer
  }

  get data() {
    if (this.size === 0) return []
    return this._tail > this._head
      ? this.buffer.slice(this._head, this._tail)
      : this.buffer.slice(this._tail).concat(this.buffer.slice(0, this._head))
  }

  push(v: any) {
    if (this.size === this.capacity) {
      this.pop()
    }
    this.buffer[this._tail++] = v
    this._tail %= this.capacity
    this.size = Math.min(this.size + 1, this.capacity)
  }

  pop(): any {
    if (this.size === 0) {
      throw new Error('RingBuffer is empty, cannot pop()')
    }
    const v = this.head
    this._head = (this._head + 1) % this.capacity
    this.size--
    return v
  }

  forEach(cb: (arg: any) => void) {
    for (let i = 0; i < this.size; ++i) {
      cb(this.buffer[i % this.capacity])
    }
  }
}
