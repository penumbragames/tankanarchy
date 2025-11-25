/**
 * Helper classes and interfaces for game loops and updateable objects.
 * @author omgimanerd
 */

import RingBuffer from 'lib/datastructures/RingBuffer'
import { UpdateFrame } from 'lib/game/component/Updateable'
import MathUtil from 'lib/math/MathUtil'

type GameLoopFunction = (updateFrame: UpdateFrame) => void

/**
 * GameLoop is a loose wrapper for any function that needs to run in a game
 * loop. The function must match the GameLoopFunction type and accept the update
 * timings as parameters, and this class will handle the looping functionality
 * with either requestAnimationFrame or setTimeout. It will attempt to run the
 * loop function at the target UPS.
 */
export default class GameLoop {
  static readonly UPS_RINGBUFFER_SIZE = 120

  targetUps: number
  targetUpdateInterval: number

  running: boolean = false
  fn: GameLoopFunction
  useAnimationFrame: boolean

  updateTimes: RingBuffer = new RingBuffer(GameLoop.UPS_RINGBUFFER_SIZE)
  lastUpdateTime: number = 0 // ms unixtime
  currentTime: number = 0 // ms unixtime
  deltaTime: number = 0 // ms

  constructor(
    targetUps: number,
    loop: GameLoopFunction,
    useAnimationFrame: boolean = false,
  ) {
    this.targetUps = targetUps
    this.targetUpdateInterval = Number.isFinite(this.targetUps)
      ? 1000 / targetUps
      : 0
    this.fn = loop
    this.useAnimationFrame = useAnimationFrame
  }

  get delayToNextUpdate(): number {
    if (this.targetUpdateInterval === 0) return 0
    // Look at how far ahead or behind we are using the previous deltatime and
    // time the next update interval using it.
    return Math.max(2 * this.targetUpdateInterval - this.deltaTime, 0)
  }

  get updateFrame(): UpdateFrame {
    return {
      lastUpdateTime: this.lastUpdateTime,
      currentTime: this.currentTime,
      deltaTime: this.deltaTime,
    }
  }

  get ups(): number {
    return MathUtil.roundTo(
      (GameLoop.UPS_RINGBUFFER_SIZE /
        (this.updateTimes.tail - this.updateTimes.head)) *
        1000,
      2,
    )
  }

  start() {
    this.running = true
    this.lastUpdateTime = Date.now()
    this.run()
  }

  run(): void {
    if (!this.running) return
    this.currentTime = Date.now()
    this.updateTimes.push(this.currentTime)
    this.deltaTime = this.currentTime - this.lastUpdateTime
    this.lastUpdateTime = this.currentTime
    this.fn(this.updateFrame)
    if (this.useAnimationFrame) {
      window.requestAnimationFrame(this.run.bind(this))
    } else {
      setTimeout(this.run.bind(this), this.delayToNextUpdate)
    }
  }

  stop() {
    this.running = false
  }
}
