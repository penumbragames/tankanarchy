/**
 * @author omgimanerd
 */

// Any object that can by updated by the game loop should implement Updateable
export default interface GameLoopUpdateable {
  update(lastUpdateTime: number, deltaTime: number): void
}
