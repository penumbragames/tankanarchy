/**
 * @author omgimanerd
 */

// Any object that can by updated by the game loop should implement Updateable
export default interface Updateable {
  update(lastUpdateTime: number, deltaTime: number): void
}
