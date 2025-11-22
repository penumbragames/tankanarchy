/**
 * @fileoverview Ammo stores the state of the Player's current ammunition and
 * shooting capabilities, uses an FSM to track what should be done on left click
 * based on the Player's powerup state.
 *
 * Left clicks shoot the regular tank cannon or a charged laser if the player
 * has the laser powerup.
 *
 * Right clicks shoot rockets if the player has any.
 *
 * @author omgimanerd
 */

import type { Ref } from 'lib/types'

import { Exclude } from 'class-transformer'

import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'
import Cooldown from 'lib/game/Cooldown'
import Bullet from 'lib/game/entity/Bullet'
import Player from 'lib/game/entity/player/Player'
import Rocket from 'lib/game/entity/Rocket'
import { BinarySignal } from 'lib/math/BinarySignal'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { GameServices } from 'server/GameServices'

/**
 * Base classes for the state machine that the left click input can be in.
 * Without any powerups, we just fire regular bullets. With the laser powerup,
 * we charge the laser with the left click.
 */
abstract class State implements IUpdateable {
  ammo: Ammo // Parent object reference

  constructor(ammo: Ammo) {
    this.ammo = ammo
  }

  abstract updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ): State

  abstract update(updateFrame: UpdateFrame, services: GameServices): State
}

/**
 * Player's default shooting state.
 */
class CannonState extends State {
  cooldown: Cooldown = new Cooldown(this.ammo.bulletCooldown)

  override updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ): State {
    if (inputs.mouseLeft && this.cooldown.trigger(updateFrame)) {
      services.addEntity(...this.ammo.getBullets())
      services.playSound(SOUNDS.BULLET_SHOT, this.ammo.player.physics.position)
    }
    this.ammo.player.turretAngle = inputs.turretAngle
    return this
  }

  override update(_updateFrame: UpdateFrame, _services: GameServices): State {
    if (this.ammo.player.powerups.get(POWERUPS.LASER)) {
      return new LaserState(this.ammo)
    }
    return this
  }
}

class LaserState extends State {
  static readonly MIN_CHARGE_TIME = 2000 // ms

  charging: BinarySignal = new BinarySignal(false)
  chargeTime: number = 0

  override updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ): State {
    // Update the BinarySignal state to see if we released the mouse button
    this.charging.update(inputs.mouseLeft)
    switch (this.charging.consume()) {
      case BinarySignal.Event.RISE:
        break
      case BinarySignal.Event.FALL:
        if (this.chargeTime >= LaserState.MIN_CHARGE_TIME) {
          // Fire the laser
          this.chargeTime = 0
        }
        break
      // this.charging.consume() returns undefined when the event queue is
      // empty, which falls through
    }

    // While we are charging the laser, the player's turret angle is locked.
    if (inputs.mouseLeft) {
      this.chargeTime += updateFrame.deltaTime
    } else {
      this.chargeTime = 0
      this.ammo.player.turretAngle = inputs.turretAngle
    }
    return this
  }

  override update(_updateFrame: UpdateFrame, _services: GameServices): State {
    // Stay in the powerup state until we stop firing.
    if (
      !this.ammo.player.powerups.get(POWERUPS.LASER) &&
      this.charging.previousState
    ) {
      return new CannonState(this.ammo)
    }
    return this
  }

  fire(services: GameServices) {}
}

/**
 * Ammo is a component of the Player used to manage the player's shooting
 * cooldowns and state information.
 */
export default class Ammo implements IUpdateable {
  // This field MUST be excluded from serialization since it is a circular
  // reference.
  @Exclude() player: Ref<Player>

  // Shared state modified by powerups, fetched by the left click state if we
  // are in regular bullet shooting mode.
  bulletCooldown: number = PLAYER_CONSTANTS.BULLET_COOLDOWN
  bulletsPerShot: number = PLAYER_CONSTANTS.BULLETS_PER_SHOT

  // Must be initialized after bulletCooldown
  leftClickState: State = new CannonState(this)

  rocketCooldown: Cooldown = new Cooldown(PLAYER_CONSTANTS.ROCKET_COOLDOWN)

  constructor(player: Player) {
    this.player = player
  }

  update(updateFrame: UpdateFrame, services: GameServices) {
    this.leftClickState = this.leftClickState.update(updateFrame, services)
  }

  /**
   * The player that this component is a part of must be passed as the first
   * argument instead of being stored as a reference because objects with
   * circular references cannot be passed into socket.io's custom encoder and
   * decoder, even if the circular reference is not serialized.
   *
   * @param player The player that this component is part of,
   * @param inputs The inputs sent over socket
   * @param updateFrame The game loop update frame
   * @param services The game service locator
   */
  updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ) {
    // Update the left click state machine.
    this.leftClickState = this.leftClickState.updateFromInput(
      inputs,
      updateFrame,
      services,
    )

    // Right clicking is rocket firing.
    const rocketPowerup = this.player.powerups.get(POWERUPS.ROCKET)
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
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state.
   * @return {Bullet[]}
   */
  getBullets(): Bullet[] {
    const bullets = [Bullet.createFromPlayer(this.player, 0)]
    if (this.bulletsPerShot > 1) {
      for (let i = 1; i <= this.bulletsPerShot; ++i) {
        const angleDeviation = (i * Math.PI) / 25
        bullets.push(Bullet.createFromPlayer(this.player, -angleDeviation))
        bullets.push(Bullet.createFromPlayer(this.player, angleDeviation))
      }
    }
    return bullets
  }
}
