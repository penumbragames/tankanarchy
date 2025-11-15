/**
 * IUpdateable is an interface for any object that can be updated by a game
 * loop.
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
