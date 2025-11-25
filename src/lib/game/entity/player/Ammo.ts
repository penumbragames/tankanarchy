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

import type { Ref } from 'lib/types/types'

import { Exclude, Type } from 'class-transformer'

import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import { BinarySignal } from 'lib/datastructures/BinarySignal'
import { IUpdateableServer, UpdateFrame } from 'lib/game/component/Updateable'
import Cooldown from 'lib/game/Cooldown'
import Bullet from 'lib/game/entity/Bullet'
import Player from 'lib/game/entity/player/Player'
import Rocket from 'lib/game/entity/Rocket'
import Vector from 'lib/math/Vector'
import { PlayerInputs, SoundEvent } from 'lib/socket/SocketInterfaces'
import { GameServices } from 'server/GameServices'

/**
 * Base classes for the state machine that the left click input can be in.
 * Without any powerups, we just fire regular bullets. With the laser powerup,
 * we charge the laser with the left click.
 */
export abstract class State implements IUpdateableServer {
  @Exclude() ammo: Ref<Ammo> // Parent object reference

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
export class CannonState extends State {
  cooldown: Cooldown = new Cooldown(this.ammo.bulletCooldown)

  override updateFromInput(
    inputs: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ): State {
    if (inputs.mouseLeft && this.cooldown.trigger(updateFrame)) {
      services.addEntity(...this.ammo.getBullets())
      services.playSound({
        type: SOUNDS.BULLET_SHOT,
        source: this.ammo.player.physics.position,
      })
    }
    return this
  }

  override update(_updateFrame: UpdateFrame, _services: GameServices): State {
    if (this.ammo.player.powerups.get(POWERUPS.LASER)) {
      return new LaserState(this.ammo)
    }
    return this
  }
}

export class LaserState extends State {
  static readonly SOUND_ID = 'LASER_CHARGING'
  static readonly WIDTH = 12 // px
  static readonly DAMAGE = 8 // px
  static readonly MAX_RANGE = 500 // px
  static readonly MIN_CHARGE_TIME = 1000 // ms

  charging: BinarySignal = new BinarySignal(false)

  // Since updateFromInput() is called less frequently than the actual game
  // loop, we cannot use the deltaTime from the game loop's UpdateFrame.
  // Therefore, we accumulate the updateTime between each updateFromInput() call
  // and consume it when we call updateFromInput().
  inputDeltaTime: number = 0

  chargeTime: number = 0
  chargeState: LaserState.State = LaserState.State.NONE

  get charged() {
    return this.chargeTime >= LaserState.MIN_CHARGE_TIME
  }

  override updateFromInput(
    inputs: PlayerInputs,
    _updateFrame: UpdateFrame,
    services: GameServices,
  ): State {
    // Consume the stored input delta time
    const deltaTime = this.inputDeltaTime
    this.inputDeltaTime = 0

    // Update the BinarySignal state to see if we released the mouse button
    this.charging.update(inputs.mouseLeft)
    switch (this.charging.consume()) {
      case BinarySignal.Event.RISE:
        services.playSound({
          type: SOUNDS.LASER_CHARGE,
          action: SoundEvent.ACTION.LOOP,
          id: this.ammo.player.getUid(LaserState.SOUND_ID),
          source: this.ammo.player.physics.position,
        })
        break
      case BinarySignal.Event.FALL:
        services.playSound({
          type: SOUNDS.LASER_CHARGE,
          action: SoundEvent.ACTION.STOP,
          id: this.ammo.player.getUid(LaserState.SOUND_ID),
          source: this.ammo.player.physics.position,
        })
        if (this.charged) {
          this.fire(services)
          services.playSound({
            type: SOUNDS.LASER_SHOT,
            source: this.ammo.player.physics.position,
          })
          this.chargeTime = 0
        }
        break
      // this.charging.consume() returns undefined when the event queue is
      // empty, which falls through
    }

    if (inputs.mouseLeft) {
      this.chargeTime += deltaTime
      if (this.charged) {
        this.chargeState = LaserState.State.CHARGED
      } else {
        this.chargeState = LaserState.State.CHARGING
      }
    } else {
      this.chargeTime = 0
      this.chargeState = LaserState.State.NONE
    }
    return this
  }

  override update(updateFrame: UpdateFrame, _services: GameServices): State {
    // Accumulate the delta time between updateFromInput() calls.
    this.inputDeltaTime += updateFrame.deltaTime
    // Stay in the powerup state while charging, exiting after firing.
    if (
      !this.ammo.player.powerups.get(POWERUPS.LASER) &&
      this.chargeTime == 0
    ) {
      return new CannonState(this.ammo)
    }
    return this
  }

  fire(services: GameServices) {
    // TODO spawn a laser particle
    const position = this.ammo.player.physics.position
    const turretVector = Vector.fromPolar(1000, this.ammo.player.turretAngle)
    for (const entity of services.game.entities) {
      if (entity === this.ammo.player) continue
      const entityVector = Vector.sub(entity.physics.position, position)
      // Project the entity vector onto the turret angle vector to find the
      // how far entity is along the turret angle vector.
      const proj = entityVector.proj(turretVector)
      // Filter out entities outside of the laser's range
      if (proj.mag > LaserState.MAX_RANGE) {
        continue
      }
      // Filter out entities on the opposite side of the turret.
      if (turretVector.dot(entityVector) < 1) {
        continue
      }
      // Subtract the entity vector from the projection to find the entity's
      // perpendicular distance to the turret vector. The entity is considered
      // hit if half the laser width intersects its radial hitbox.
      const perpVector = Vector.sub(entityVector, proj)
      if (perpVector.mag < entity.hitbox.size + LaserState.WIDTH / 2) {
        if (entity instanceof Player) {
          entity.damage(LaserState.DAMAGE, this.ammo.player)
        } else {
          entity.destroy(services)
        }
      }
    }
  }
}

export namespace LaserState {
  /**
   * Represents the state of the LaserState, which can be not charging,
   * charging, or charged and ready to fire.
   */
  export enum State {
    NONE = 'NONE',
    CHARGING = 'CHARGING',
    CHARGED = 'CHARGED',
  }
}

/**
 * Ammo is a component of the Player used to manage the player's shooting
 * cooldowns and state information.
 */
export class Ammo implements IUpdateableServer {
  // This field MUST be excluded from serialization since it is a circular
  // reference.
  @Exclude() player: Ref<Player>

  // Shared state modified by powerups, fetched by the left click state if we
  // are in regular bullet shooting mode.
  bulletCooldown: number = PLAYER_CONSTANTS.BULLET_COOLDOWN
  bulletsPerShot: number = PLAYER_CONSTANTS.BULLETS_PER_SHOT

  // Must be initialized after bulletCooldown, state machine representing
  // whether the player is shooting regular bullets or a chargeable laser.
  @Type(() => State) leftClickState: State = new CannonState(this)

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
      services.playSound({
        type: SOUNDS.ROCKET_SHOT,
        source: this.player.physics.position,
      })
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
