/**
 * IUpdateable is an interface for any object that can be updated by a game
 * loop.
 * @author omgimanerd
 */

import GameServices from 'server/GameServices'

export type UpdateFrame = {
  lastUpdateTime: number
  currentTime: number
  deltaTime: number
}

export interface IUpdateable {
  update(updateFrame: UpdateFrame, services: GameServices): void
}
