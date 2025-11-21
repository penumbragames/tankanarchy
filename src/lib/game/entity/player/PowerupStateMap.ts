/**
 * Component used by the Player class to track the player's powerups.
 * @author omgimanerd
 */

import type { Optional } from 'lib/types'

import POWERUPS from 'lib/enums/Powerups'

import { Type } from 'class-transformer'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Player from 'lib/game/entity/player/Player'
import {
  PowerupState,
  PowerupTypeMap,
} from 'lib/game/entity/player/PowerupState'
import Powerup from 'lib/game/entity/Powerup'
import { GameServices } from 'server/GameServices'

export default class PowerupStateMap {
  @Type(() => PowerupState) map: Map<POWERUPS, PowerupState> = new Map()

  get keys() {
    return this.map.keys()
  }

  get values() {
    return this.map.values()
  }

  get<T extends POWERUPS>(type: T): Optional<PowerupTypeMap[T]> {
    return <PowerupTypeMap[T]>this.map.get(type)
  }

  /**
   * The player that this component is a part of must be passed as the first
   * argument instead of being stored as a reference because objects with
   * circular references cannot be passed into socket.io's custom encoder and
   * decoder, even if the circular reference is not serialized.
   */
  apply(player: Player, powerup: Powerup): POWERUPS {
    const state = powerup.powerupState
    this.map.set(powerup.type, state)
    state.apply(player)
    return powerup.type
  }

  update(player: Player, updateFrame: UpdateFrame, _services: GameServices) {
    for (const state of this.values) {
      state.update(updateFrame)
      if (state.expired) {
        state.remove(player)
        this.map.delete(state.type)
      }
    }
  }
}
