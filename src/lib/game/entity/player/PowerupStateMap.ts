/**
 * Component used by the Player class to track the player's powerups.
 * @author omgimanerd
 */

import type { Optional, Ref } from 'lib/types'

import POWERUPS from 'lib/enums/Powerups'

import { Exclude, Type } from 'class-transformer'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Player from 'lib/game/entity/player/Player'
import {
  PowerupState,
  PowerupTypeMap,
} from 'lib/game/entity/player/PowerupState'
import Powerup from 'lib/game/entity/Powerup'
import { GameServices } from 'server/GameServices'

export default class PowerupStateMap {
  // This field MUST be excluded from serialization since it is a circular
  // reference.
  @Exclude() player: Ref<Player>

  @Type(() => PowerupState) map: Map<POWERUPS, PowerupState> = new Map()

  constructor(player: Player) {
    this.player = player
  }

  get keys() {
    return this.map.keys()
  }

  get values() {
    return this.map.values()
  }

  get<T extends POWERUPS>(type: T): Optional<PowerupTypeMap[T]> {
    return <PowerupTypeMap[T]>this.map.get(type)
  }

  apply(powerup: Powerup): POWERUPS {
    const state = powerup.powerupState
    this.map.set(powerup.type, state)
    state.apply(this.player)
    return powerup.type
  }

  update(updateFrame: UpdateFrame, _services: GameServices) {
    for (const state of this.values) {
      state.update(updateFrame)
      if (state.expired) {
        state.remove(this.player)
        this.map.delete(state.type)
      }
    }
  }
}
