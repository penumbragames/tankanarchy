/**
 * IUpdateable is an interface for any object that can be updated by a game
 * loop.
 * @author omgimanerd
 */

import { GameServices } from 'server/GameServices'

export type UpdateFrame = {
  lastUpdateTime: number
  currentTime: number
  deltaTime: number
}

export interface IUpdateableServer {
  update(updateFrame: UpdateFrame, services: GameServices): void
}

export interface IUpdateableClient {
  update(updateFrame: UpdateFrame): void
}
