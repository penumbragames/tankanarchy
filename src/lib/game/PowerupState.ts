/**
 * @author omgimanerd
 */

import type Player from 'lib/game/Player'

import POWERUPS from 'lib/enums/Powerups'
import PLAYER_CONSTANTS from 'lib/game/PlayerConstants'
import Updateable from 'lib/interfaces/Updateable'
import Util from 'lib/math/Util'

/**
 * Base class for powerup states which modify the Player.
 */
export abstract class PowerupState implements Updateable {
  static readonly MIN_DURATION = 5000
  static readonly MAX_DURATION = 15000

  type: POWERUPS
  duration: number = 0
  expirationTime: number = 0
  expired: boolean = false

  constructor(type: POWERUPS) {
    this.type = type
  }

  static getRandomDuration(): number {
    return Util.randRangeInt(
      PowerupState.MIN_DURATION,
      PowerupState.MAX_DURATION,
    )
  }

  init(): PowerupState {
    this.duration = PowerupState.getRandomDuration()
    this.expirationTime = Date.now() + this.duration
    return this
  }

  get remainingMs() {
    return this.expirationTime - Date.now()
  }

  get remainingSeconds() {
    return this.remainingMs / 1000
  }

  update(lastUpdateTime: number, _deltaTime: number) {
    this.expired = lastUpdateTime > this.expirationTime
  }

  apply(_p: Player) {}
  remove(_p: Player) {}
}

export class HealthPowerup extends PowerupState {
  static readonly MIN_HEAL = 1
  static readonly MAX_HEAL = 4

  healAmount: number = 0

  constructor() {
    super(POWERUPS.HEALTH_PACK)
  }

  init(): HealthPowerup {
    super.init()
    this.healAmount = Util.randRangeInt(
      HealthPowerup.MIN_HEAL,
      HealthPowerup.MAX_HEAL,
    )
    return this
  }

  apply(p: Player) {
    p.heal(this.healAmount)
    this.expired = true
  }
}

export class RapidfirePowerup extends PowerupState {
  static readonly MIN_MODIFIER = 2
  static readonly MAX_MODIFIER = 4

  modifier: number = 0

  constructor() {
    super(POWERUPS.RAPIDFIRE)
  }

  init(): RapidfirePowerup {
    super.init()
    this.modifier = Util.randRangeInt(
      RapidfirePowerup.MIN_MODIFIER,
      RapidfirePowerup.MAX_MODIFIER,
    )
    return this
  }

  apply(p: Player) {
    p.shotCooldown = PLAYER_CONSTANTS.SHOT_COOLDOWN / this.modifier
  }

  remove(p: Player) {
    p.shotCooldown = PLAYER_CONSTANTS.SHOT_COOLDOWN
  }
}

export class RocketPowerup extends PowerupState {
  rockets: number = 0

  constructor() {
    super(POWERUPS.ROCKET)
  }

  init(): RocketPowerup {
    super.init()
    return this
  }
}

export class ShieldPowerup extends PowerupState {
  static readonly MIN_SHIELD = 1
  static readonly MAX_SHIELD = 4

  shield: number = 0

  constructor() {
    super(POWERUPS.SHIELD)
  }

  init(): ShieldPowerup {
    super.init()
    this.shield = Util.randRangeInt(
      ShieldPowerup.MIN_SHIELD,
      ShieldPowerup.MAX_SHIELD,
    )
    return this
  }

  apply(p: Player) {
    p.hitboxSize = PLAYER_CONSTANTS.SHIELD_HITBOX_SIZE
  }

  remove(p: Player) {
    p.hitboxSize = PLAYER_CONSTANTS.DEFAULT_HITBOX_SIZE
  }

  damage(amount: number) {
    this.shield -= amount
    if (this.shield <= 0) this.expired = true
  }
}

export class ShotgunPowerup extends PowerupState {
  static readonly MIN_MODIFIER = 1
  static readonly MAX_MODIFIER = 2

  modifier: number = 0

  constructor() {
    super(POWERUPS.SHOTGUN)
  }

  init(): ShotgunPowerup {
    super.init()
    this.modifier = Util.randRangeInt(
      ShotgunPowerup.MIN_MODIFIER,
      ShotgunPowerup.MAX_MODIFIER,
    )
    return this
  }

  apply(p: Player) {
    p.bulletsPerShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT + this.modifier
  }

  remove(p: Player) {
    p.bulletsPerShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT
  }
}

export class SpeedboostPowerup extends PowerupState {
  static readonly MIN_MODIFIER = 1.2
  static readonly MAX_MODIFIER = 1.8

  modifier: number = 0

  constructor() {
    super(POWERUPS.SPEEDBOOST)
  }

  init(): SpeedboostPowerup {
    super.init()
    this.modifier = Util.randRangeInt(
      SpeedboostPowerup.MIN_MODIFIER,
      SpeedboostPowerup.MAX_MODIFIER,
    )
    return this
  }

  apply(p: Player) {
    p.turnRate = PLAYER_CONSTANTS.TURN_RATE * this.modifier
    p.speed = PLAYER_CONSTANTS.SPEED * this.modifier
  }

  remove(p: Player) {
    p.turnRate = PLAYER_CONSTANTS.TURN_RATE
    p.speed = PLAYER_CONSTANTS.SPEED
  }
}

type PowerupConstructors_ = { [key in POWERUPS]: { new (): any } }
export const PowerupConstructors: PowerupConstructors_ = {
  [POWERUPS.HEALTH_PACK]: HealthPowerup,
  [POWERUPS.RAPIDFIRE]: RapidfirePowerup,
  [POWERUPS.ROCKET]: RocketPowerup,
  [POWERUPS.SHIELD]: ShieldPowerup,
  [POWERUPS.SHOTGUN]: ShotgunPowerup,
  [POWERUPS.SPEEDBOOST]: SpeedboostPowerup,
}

export type PowerupTypeMap = {
  [P in keyof POWERUPS]: PowerupState
} & {
  [POWERUPS.HEALTH_PACK]: HealthPowerup
  [POWERUPS.RAPIDFIRE]: RapidfirePowerup
  [POWERUPS.ROCKET]: RocketPowerup
  [POWERUPS.SHIELD]: ShieldPowerup
  [POWERUPS.SHOTGUN]: ShotgunPowerup
  [POWERUPS.SPEEDBOOST]: SpeedboostPowerup
}
