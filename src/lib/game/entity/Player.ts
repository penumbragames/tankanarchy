/**
 * Stores the state of the player. This class is shared between the server and
 * the client, though the client will be missing the @Exclude fields after
 * deserialization to reduce the data sent over socket.
 *
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { Exclude, Type } from 'class-transformer'

import POWERUPS from 'lib/enums/Powerups'
import PLAYER_CONSTANTS from 'lib/game/entity/PlayerConstants'

import * as Constants from 'lib/Constants'
import Entity from 'lib/game/Entity'
import Bullet from 'lib/game/entity/Bullet'
import Powerup from 'lib/game/entity/Powerup'
import { PowerupState, PowerupTypeMap } from 'lib/game/entity/PowerupState'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'

export default class Player extends Entity {
  name: string
  socketID: string // Also serves as the player UID.

  @Exclude() lastUpdateTime: number = 0

  tankAngle: number = 0
  turretAngle: number = 0
  turnRate: number = 0

  speed: number = PLAYER_CONSTANTS.SPEED
  @Exclude() shotCooldown: number = PLAYER_CONSTANTS.SHOT_COOLDOWN
  @Exclude() bulletsPerShot: number = PLAYER_CONSTANTS.BULLETS_PER_SHOT
  @Exclude() lastShotTime: number = 0
  health: number = PLAYER_CONSTANTS.MAX_HEALTH

  @Type(() => PowerupState)
  powerupStates: Map<POWERUPS, PowerupState> = new Map()

  kills: number = 0
  deaths: number = 0

  constructor(name: string, socketID: string) {
    super(
      Vector.zero(),
      Vector.zero(),
      Vector.zero(),
      PLAYER_CONSTANTS.DEFAULT_HITBOX_SIZE,
    )
    this.name = name
    this.socketID = socketID
  }

  /**
   * Creates a new Player object.
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   */
  static create(name: string, socketID: string): Player {
    return new Player(name, socketID).spawn()
  }

  /**
   * Update this player given the client's input
   * @param {PlayerInputs} data
   */
  updateOnInput(data: PlayerInputs): void {
    if ((data.up && data.down) || (!data.up && !data.down)) {
      this.velocity = Vector.zero()
    } else if (data.up) {
      this.velocity = Vector.fromPolar(this.speed, this.tankAngle)
    } else if (data.down) {
      this.velocity = Vector.fromPolar(-this.speed, this.tankAngle)
    }

    if ((data.left && data.right) || (!data.left && !data.right)) {
      this.turnRate = 0
    } else if (data.right) {
      this.turnRate = PLAYER_CONSTANTS.TURN_RATE
    } else if (data.left) {
      this.turnRate = -PLAYER_CONSTANTS.TURN_RATE
    }

    this.turretAngle = data.turretAngle
  }

  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  override update(lastUpdateTime: number, deltaTime: number): void {
    this.lastUpdateTime = lastUpdateTime
    this.position.add(Vector.scale(this.velocity, deltaTime))
    this.boundToWorld()
    this.tankAngle = Util.normalizeAngle(
      this.tankAngle + (this.turnRate * deltaTime), // prettier-ignore
    )

    for (const state of this.powerupStates.values()) {
      state.update(lastUpdateTime, deltaTime)
      if (state.expired) {
        state.remove(this)
        this.powerupStates.delete(state.type)
      }
    }
  }

  getPowerupState<T extends POWERUPS>(type: T): PowerupTypeMap[T] | undefined {
    return <PowerupTypeMap[T]>this.powerupStates.get(type)
  }

  /**
   * Applies a Powerup to this player, returning the powerup type for sound.
   * @param {Powerup} powerup The Powerup object.
   * @returns {POWERUPS}
   */
  applyPowerup(powerup: Powerup): POWERUPS {
    const state = powerup.powerupState
    this.powerupStates.set(powerup.type, state)
    state.apply(this)
    return powerup.type
  }

  canShoot(): boolean {
    return this.lastUpdateTime > this.lastShotTime + this.shotCooldown
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state. This function does not
   * perform a shot cooldown check and resets the shot cooldown.
   * @return {Bullet[]}
   */
  getProjectilesFromShot(): Bullet[] {
    const bullets = [Bullet.createFromPlayer(this, 0)]
    if (this.bulletsPerShot > 1) {
      for (let i = 1; i <= this.bulletsPerShot; ++i) {
        const angleDeviation = (i * Math.PI) / 25
        bullets.push(Bullet.createFromPlayer(this, -angleDeviation))
        bullets.push(Bullet.createFromPlayer(this, angleDeviation))
      }
    }
    this.lastShotTime = this.lastUpdateTime
    return bullets
  }

  isDead(): boolean {
    return this.health <= 0
  }

  damage(amount: number): void {
    const shield = this.getPowerupState(POWERUPS.SHIELD)
    if (shield) {
      shield.damage(amount)
    } else {
      this.health -= amount
    }
  }

  heal(amount: number): void {
    this.health = Math.min(PLAYER_CONSTANTS.MAX_HEALTH, this.health + amount)
  }

  /**
   * Handles the spawning (and respawning) of the player.
   */
  spawn(): Player {
    this.position = new Vector(
      Util.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
      Util.randRange(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
    )
    this.health = PLAYER_CONSTANTS.MAX_HEALTH
    return this
  }
}
