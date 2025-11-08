/**
 * @author omgimanerd
 */

import type Player from 'lib/game/Player'

import POWERUPS from 'lib/enums/Powerups'
import PLAYER_CONSTANTS from 'lib/game/PlayerConstants'
import Util from 'lib/math/Util'

export abstract class PowerupState {
  static readonly MIN_DURATION = 5000
  static readonly MAX_DURATION = 15000

  type: POWERUPS
  duration: number = 0
  expirationTime: number = 0
  expired: boolean = false

  constructor(type: POWERUPS) {
    this.type = type
  }

  abstract init(): PowerupState

  get remainingMs() {
    return this.expirationTime - Date.now()
  }

  get remainingSeconds() {
    return this.remainingMs / 1000
  }

  update(lastUpdateTime: number, deltaTime: number) {
    this.expired = lastUpdateTime > this.expirationTime
  }

  apply(p: Player) {}
  remove(p: Player) {}
}

export class HealthPowerup extends PowerupState {
  static readonly MIN_HEAL = 1
  static readonly MAX_HEAL = 4

  healAmount: number = 0

  constructor() {
    super(POWERUPS.HEALTH_PACK)
  }

  init(): HealthPowerup {
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

export class ShieldPowerup extends PowerupState {
  static readonly MIN_SHIELD = 1
  static readonly MAX_SHIELD = 4

  shield: number = 0

  constructor() {
    super(POWERUPS.SHIELD)
  }

  init(): ShieldPowerup {
    return this
  }

  damage(amount: number) {
    this.shield -= amount
    if (this.shield <= 0) this.expired = true
  }
}

export class ShotgunPowerup extends PowerupState {
  static readonly MIN_MODIFIER = 1
  static readonly MAX_MODIFIER = 3

  modifier: number = 0

  constructor() {
    super(POWERUPS.SHOTGUN)
  }

  init(): ShotgunPowerup {
    this.modifier = Util.randRangeInt(
      ShotgunPowerup.MIN_DURATION,
      ShotgunPowerup.MAX_MODIFIER,
    )
    return this
  }

  apply(p: Player) {
    p.numBulletsShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT + this.modifier
  }

  remove(p: Player) {
    p.numBulletsShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT
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

type PowerupConstructors_ = { [key in POWERUPS]: any }
export const PowerupConstructors: PowerupConstructors_ = {
  [POWERUPS.HEALTH_PACK]: HealthPowerup,
  [POWERUPS.RAPIDFIRE]: RapidfirePowerup,
  [POWERUPS.SHIELD]: ShieldPowerup,
  [POWERUPS.SHOTGUN]: ShotgunPowerup,
  [POWERUPS.SPEEDBOOST]: SpeedboostPowerup,
}

export type PowerupMap = {
  [key in POWERUPS]: PowerupState
}
