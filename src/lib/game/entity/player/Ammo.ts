/**
 * Stores the state of the Player's current ammunition and shooting
 * capabilities, uses an FSM to track what should be done on left click based on
 * the Player's powerup state.
 *
 * Left clicks can shoot their regular gun or a charged laser if the player has
 * the powerup.
 *
 * Right clicks shoot rockets if the player has any.
 *
 * @author omgimanerd
 */

import type { Ref } from 'lib/types'

import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import { UpdateFrame } from 'lib/game/component/Updateable'
import Cooldown from 'lib/game/Cooldown'
import Bullet from 'lib/game/entity/Bullet'
import Player from 'lib/game/entity/player/Player'
import Rocket from 'lib/game/entity/Rocket'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { GameServices } from 'server/GameServices'

export default class Ammo {
  player: Ref<Player>

  bulletCooldown: Cooldown = new Cooldown(PLAYER_CONSTANTS.BULLET_COOLDOWN)
  bulletsPerShot: number = PLAYER_CONSTANTS.BULLETS_PER_SHOT
  rocketCooldown: Cooldown = new Cooldown(PLAYER_CONSTANTS.ROCKET_COOLDOWN)

  constructor(player: Player) {
    this.player = player
  }

  updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ) {
    let turnlocked = false
    if (inputs.mouseLeft) {
      // Left clicking is either laser or regular bullets.
      if (this.player.getPowerupState(POWERUPS.LASER)) {
        // Charging the laser locks the rotation of the tank.
        turnlocked = true
      } else {
        if (this.bulletCooldown.trigger(updateFrame)) {
          services.addEntity(...this.getBullets(this.player))
          services.playSound(SOUNDS.BULLET_SHOT, this.player.physics.position)
        }
      }
    }
    // Right clicking is rocket firing.
    const rocketPowerup = this.player.getPowerupState(POWERUPS.ROCKET)
    if (
      inputs.mouseRight &&
      rocketPowerup &&
      rocketPowerup.rockets > 0 &&
      this.rocketCooldown.trigger(updateFrame)
    ) {
      services.addEntity(
        Rocket.createFromPlayer(this.player, inputs.worldMouseCoords),
      )
      rocketPowerup.consume()
    }

    if (!turnlocked) {
      this.player.turretAngle = inputs.turretAngle
    }
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state.
   * @return {Bullet[]}
   */
  getBullets(player: Player): Bullet[] {
    const bullets = [Bullet.createFromPlayer(player, 0)]
    if (this.bulletsPerShot > 1) {
      for (let i = 1; i <= this.bulletsPerShot; ++i) {
        const angleDeviation = (i * Math.PI) / 25
        bullets.push(Bullet.createFromPlayer(player, -angleDeviation))
        bullets.push(Bullet.createFromPlayer(player, angleDeviation))
      }
    }
    return bullets
  }
}
