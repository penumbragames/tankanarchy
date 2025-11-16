/**
 * Stores the state of the player. This class is shared between the server and
 * the client, though the client will be missing the @Exclude fields after
 * deserialization to reduce the data sent over socket.
 *
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import { Exclude, Type } from 'class-transformer'

import POWERUPS from 'lib/enums/Powerups'
import SOUNDS from 'lib/enums/Sounds'
import PLAYER_CONSTANTS from 'lib/game/entity/PlayerConstants'

import * as Constants from 'lib/Constants'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Cooldown from 'lib/game/Cooldown'
import Bullet from 'lib/game/entity/Bullet'
import Entity from 'lib/game/entity/Entity'
import Powerup from 'lib/game/entity/Powerup'
import { PowerupState, PowerupTypeMap } from 'lib/game/entity/PowerupState'
import Util from 'lib/math/Util'
import Vector from 'lib/math/Vector'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import GameServices from 'server/GameServices'

export default class Player extends Entity {
  name: string
  socketID: string // Also serves as the player UID.

  tankAngle: number = 0
  turretAngle: number = 0
  turnRate: number = 0

  speed: number = PLAYER_CONSTANTS.SPEED
  health: number = PLAYER_CONSTANTS.MAX_HEALTH

  @Exclude() bulletShooting: Cooldown
  @Exclude() bulletsPerShot: number = PLAYER_CONSTANTS.BULLETS_PER_SHOT

  @Exclude() rocketShooting: Cooldown

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

    this.bulletShooting = new Cooldown(PLAYER_CONSTANTS.BULLET_COOLDOWN)
    this.rocketShooting = new Cooldown(PLAYER_CONSTANTS.ROCKET_COOLDOWN)
  }

  /**
   * Factory method for a new Player object.
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   */
  static create(name: string, socketID: string): Player {
    return new Player(name, socketID).spawn()
  }

  override update(updateFrame: UpdateFrame, _services: GameServices): void {
    this.physics.position.add(
      Vector.scale(this.physics.velocity, updateFrame.deltaTime),
    )
    this.boundToWorld()
    this.tankAngle = Util.normalizeAngle(
      // prettier-ignore
      this.tankAngle + (this.turnRate * updateFrame.deltaTime),
    )

    for (const state of this.powerupStates.values()) {
      state.update(updateFrame)
      if (state.expired) {
        state.remove(this)
        this.powerupStates.delete(state.type)
      }
    }
  }

  /**
   * Update this player using a client input packet.
   * @param {PlayerInputs} data The client input packet.
   * @param {UpdateFrame} updateFrame The frame information from the game loop,
   *   which contains the update time and delta time.
   * @param {GameServices} services Service locator for the game to access
   *   game logic.
   */
  updateOnInput(
    data: PlayerInputs,
    updateFrame: UpdateFrame,
    services: GameServices,
  ): void {
    if ((data.up && data.down) || (!data.up && !data.down)) {
      this.physics.velocity = Vector.zero()
    } else if (data.up) {
      this.physics.velocity = Vector.fromPolar(this.speed, this.tankAngle)
    } else if (data.down) {
      this.physics.velocity = Vector.fromPolar(-this.speed, this.tankAngle)
    }

    if ((data.left && data.right) || (!data.left && !data.right)) {
      this.turnRate = 0
    } else if (data.right) {
      this.turnRate = PLAYER_CONSTANTS.TURN_RATE
    } else if (data.left) {
      this.turnRate = -PLAYER_CONSTANTS.TURN_RATE
    }

    this.turretAngle = data.turretAngle

    if (data.shootBullet && this.bulletShooting.ready(updateFrame)) {
      services.addProjectile(...this.getBulletsFromShot())
      services.playSound(SOUNDS.TANK_SHOT, this.physics.position)
      this.bulletShooting.trigger(updateFrame)
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

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state.
   * @return {Bullet[]}
   */
  getBulletsFromShot(): Bullet[] {
    const bullets = [Bullet.createFromPlayer(this, 0)]
    if (this.bulletsPerShot > 1) {
      for (let i = 1; i <= this.bulletsPerShot; ++i) {
        const angleDeviation = (i * Math.PI) / 25
        bullets.push(Bullet.createFromPlayer(this, -angleDeviation))
        bullets.push(Bullet.createFromPlayer(this, angleDeviation))
      }
    }
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
    this.physics.position = new Vector(
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
