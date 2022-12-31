/**
 * Stores the state of the player on the server. This class will also store
 * other important information such as socket ID, packet number, and latency.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

import * as Constants from '../lib/Constants'
import Bullet from './Bullet'
import Entity from '../lib/Entity'
import Powerup from './Powerup'
import Util from '../lib/Util'
import Vector from '../lib/Vector'

class Player extends Entity {
  name: string
  socketID: string

  lastUpdateTime: number
  tankAngle: number
  turretAngle: number
  turnRate: number
  speed: number
  shotCooldown: number
  lastShotTime: number
  health: number
  powerups: Map<Constants.POWERUP_TYPES, Powerup>

  kills: number
  deaths: number

  constructor(name: string, socketID: string) {
    super(
      Vector.zero(),
      Vector.zero(),
      Vector.zero(),
      Constants.PLAYER_DEFAULT_HITBOX_SIZE,
    )

    this.name = name
    this.socketID = socketID

    this.lastUpdateTime = 0
    this.tankAngle = 0
    this.turretAngle = 0
    this.turnRate = 0
    this.speed = Constants.PLAYER_DEFAULT_SPEED
    this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN
    this.lastShotTime = 0
    this.health = Constants.PLAYER_MAX_HEALTH

    this.powerups = new Map()

    this.kills = 0
    this.deaths = 0
  }

  /**
   * Creates a new Player object.
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   */
  static create(name: string, socketID: string): Player {
    const player = new Player(name, socketID)
    player.spawn()
    return player
  }

  /**
   * Update this player given the client's input data from Input
   * @param {Object} data A JSON Object storing the input state
   */
  updateOnInput(data: Constants.PLAYER_INPUTS): void {
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
      this.turnRate = Constants.PLAYER_TURN_RATE
    } else if (data.left) {
      this.turnRate = -Constants.PLAYER_TURN_RATE
    }

    this.turretAngle = data.turretAngle
  }

  /**
   * Performs a physics update.
   * @param {number} lastUpdateTime The last timestamp an update occurred
   * @param {number} deltaTime The timestep to compute the update with
   */
  update(lastUpdateTime: number, deltaTime: number): void {
    this.lastUpdateTime = lastUpdateTime
    this.position.add(Vector.scale(this.velocity, deltaTime))
    this.boundToWorld()
    this.tankAngle = Util.normalizeAngle(
      // prettier-ignore
      this.tankAngle + (this.turnRate * deltaTime),
    )

    this.updatePowerups()
  }

  updatePowerups(): void {
    for (const [type, powerup] of this.powerups) {
      const expired = this.lastUpdateTime > powerup.expirationTime
      switch (type) {
        case Constants.POWERUP_TYPES.HEALTH_PACK:
          this.health = Math.min(
            this.health + powerup.data,
            Constants.PLAYER_MAX_HEALTH,
          )
          this.powerups.delete(type)
          break
        case Constants.POWERUP_TYPES.SHOTGUN:
          if (expired) {
            this.powerups.delete(type)
          }
          break
        case Constants.POWERUP_TYPES.RAPIDFIRE:
          if (!expired) {
            this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN / powerup.data
          } else {
            this.shotCooldown = Constants.PLAYER_SHOT_COOLDOWN
            this.powerups.delete(type)
          }
          break
        case Constants.POWERUP_TYPES.SPEEDBOOST:
          if (!expired) {
            this.speed = Constants.PLAYER_DEFAULT_SPEED * powerup.data
          } else {
            this.speed = Constants.PLAYER_DEFAULT_SPEED
            this.powerups.delete(type)
          }
          break
        case Constants.POWERUP_TYPES.SHIELD:
          this.hitboxSize = Constants.PLAYER_SHIELD_HITBOX_SIZE
          if (expired || powerup.data <= 0) {
            this.hitboxSize = Constants.PLAYER_DEFAULT_HITBOX_SIZE
            this.powerups.delete(type)
          }
          break
      }
    }
  }

  /**
   * Applies a Powerup to this player.
   * @param {Powerup} powerup The Powerup object.
   */
  applyPowerup(powerup: Powerup): void {
    powerup.expirationTime = this.lastUpdateTime + powerup.duration
    this.powerups.set(powerup.type, powerup)
  }

  /**
   * Returns a boolean indicating if the player can shoot.
   * @return {boolean}
   */
  canShoot(): boolean {
    return this.lastUpdateTime > this.lastShotTime + this.shotCooldown
  }

  /**
   * Returns an array containing new projectile objects as if the player has
   * fired a shot given their current powerup state. This function does not
   * perform a shot cooldown check and resets the shot cooldown.
   * @return {Array<Bullet>}
   */
  getProjectilesFromShot(): Bullet[] {
    const bullets = [Bullet.createFromPlayer(this, 0)]
    const shotgunPowerup = this.powerups.get(Constants.POWERUP_TYPES.SHOTGUN)
    if (shotgunPowerup) {
      for (let i = 1; i <= shotgunPowerup.data; ++i) {
        const angleDeviation = (i * Math.PI) / 9
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

  /**
   * Damages the player by the given amount, factoring in shields.
   * @param {number} amount The amount to damage the player by
   */
  damage(amount: number): void {
    const shield = this.powerups.get(Constants.POWERUP_TYPES.SHIELD)
    if (shield) {
      shield.data -= 1
    } else {
      this.health -= amount
    }
  }

  /**
   * Handles the spawning (and respawning) of the player.
   */
  spawn(): void {
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
    this.tankAngle = Util.randRange(0, 2 * Math.PI)
    this.health = Constants.PLAYER_MAX_HEALTH
  }
}

export default Player
