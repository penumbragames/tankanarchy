/**
 * @author omgimanerd
 */

export type UpdateFrame = {
  lastUpdateTime: number
  currentTime: number
  deltaTime: number
}

export interface IUpdateable {
  update(updateFrame: UpdateFrame): void
}
