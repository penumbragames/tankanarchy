/**
 * Helper classes and interfaces for game loops and updateable objects.
 * @author omgimanerd
 */

import { UpdateFrame } from 'lib/game/component/Updateable'

type GameLoopFunction = (updateFrame: UpdateFrame) => void

/**
 * GameLoop is a loose wrapper for any function that needs to run in a game
 * loop. The function must match the GameLoopFunction type and accept the update
 * timings as parameters, and this class will handle the looping functionality
 * with either requestAnimationFrame or setTimeout. It will attempt to run the
 * loop function at the target UPS.
 */
export default class GameLoop {
  targetUps: number
  targetUpdateInterval: number

  running: boolean = false
  fn: GameLoopFunction
  useAnimationFrame: boolean

  lastUpdateTime: number = 0
  currentTime: number = 0
  deltaTime: number = 0

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
    return this.targetUpdateInterval === 0
      ? 0
      : Math.max(this.targetUpdateInterval - this.deltaTime, 0)
  }

  get updateFrame(): UpdateFrame {
    return {
      lastUpdateTime: this.lastUpdateTime,
      currentTime: this.currentTime,
      deltaTime: this.deltaTime,
    }
  }

  start() {
    this.running = true
    this.lastUpdateTime = Date.now()
    this.run()
  }

  run(): void {
    if (!this.running) return
    this.currentTime = Date.now()
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
