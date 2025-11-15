/**
 * @author omgimanerd
 */

export default interface IUpdateable {
  update(lastUpdateTime: number, currentTime: number, deltaTime: number): void
}
