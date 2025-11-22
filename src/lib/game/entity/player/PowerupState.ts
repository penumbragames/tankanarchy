/**
 * @author omgimanerd
 */

import type Player from 'lib/game/entity/player/Player'

import random from 'random'

import POWERUPS from 'lib/enums/Powerups'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import { IUpdateable, UpdateFrame } from 'lib/game/component/Updateable'

/**
 * Base class for powerup states which modify the Player.
 */
export abstract class PowerupState implements IUpdateable {
  static readonly MIN_DURATION = 5000
  static readonly MAX_DURATION = 15000

  type: POWERUPS
  duration: number = 0 // set to Infinity to make this state non-expiring
  expirationTime: number = 0 // set to Infinity to make this state non-expiring

  expired: boolean = false

  constructor(type: POWERUPS) {
    this.type = type
  }

  static getRandomDuration(): number {
    return random.int(PowerupState.MIN_DURATION, PowerupState.MAX_DURATION)
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

  update(updateFrame: UpdateFrame) {
    if (this.duration != Infinity) {
      this.expired = updateFrame.lastUpdateTime > this.expirationTime
    }
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

  override init(): HealthPowerup {
    super.init()
    this.healAmount = random.int(HealthPowerup.MIN_HEAL, HealthPowerup.MAX_HEAL)
    return this
  }

  override apply(p: Player) {
    p.heal(this.healAmount)
    this.expired = true
  }
}

export class LaserPowerup extends PowerupState {
  constructor() {
    super(POWERUPS.LASER)
  }

  override init(): LaserPowerup {
    super.init()
    return this
  }
}

export class RapidfirePowerup extends PowerupState {
  static readonly MIN_MODIFIER = 2
  static readonly MAX_MODIFIER = 4

  modifier: number = 0

  constructor() {
    super(POWERUPS.RAPIDFIRE)
  }

  override init(): RapidfirePowerup {
    super.init()
    this.modifier = random.int(
      RapidfirePowerup.MIN_MODIFIER,
      RapidfirePowerup.MAX_MODIFIER,
    )
    return this
  }

  override apply(p: Player) {
    p.ammo.bulletCooldown = PLAYER_CONSTANTS.BULLET_COOLDOWN / this.modifier
  }

  override remove(p: Player) {
    p.ammo.bulletCooldown = PLAYER_CONSTANTS.BULLET_COOLDOWN
  }
}

export class RocketPowerup extends PowerupState {
  static readonly NUM_ROCKETS = 5

  rockets: number = RocketPowerup.NUM_ROCKETS

  constructor() {
    super(POWERUPS.ROCKET)
  }

  override init(): RocketPowerup {
    this.duration = Infinity
    this.expirationTime = Infinity
    return this
  }

  consume(): void {
    if (--this.rockets === 0) {
      this.expired = true
    }
  }
}

export class ShieldPowerup extends PowerupState {
  static readonly MIN_SHIELD = 1
  static readonly MAX_SHIELD = 4

  shield: number = 0

  constructor() {
    super(POWERUPS.SHIELD)
  }

  override init(): ShieldPowerup {
    super.init()
    this.shield = random.int(ShieldPowerup.MIN_SHIELD, ShieldPowerup.MAX_SHIELD)
    return this
  }

  override apply(p: Player) {
    p.hitbox.size = PLAYER_CONSTANTS.SHIELD_HITBOX_SIZE
  }

  override remove(p: Player) {
    p.hitbox.size = PLAYER_CONSTANTS.DEFAULT_HITBOX_SIZE
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

  override init(): ShotgunPowerup {
    super.init()
    this.modifier = random.int(
      ShotgunPowerup.MIN_MODIFIER,
      ShotgunPowerup.MAX_MODIFIER,
    )
    return this
  }

  override apply(p: Player) {
    p.ammo.bulletsPerShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT + this.modifier
  }

  override remove(p: Player) {
    p.ammo.bulletsPerShot = PLAYER_CONSTANTS.BULLETS_PER_SHOT
  }
}

export class SpeedboostPowerup extends PowerupState {
  static readonly MIN_MODIFIER = 1.3
  static readonly MAX_MODIFIER = 2

  modifier: number = 0

  constructor() {
    super(POWERUPS.SPEEDBOOST)
  }

  override init(): SpeedboostPowerup {
    super.init()
    this.modifier = random.float(
      SpeedboostPowerup.MIN_MODIFIER,
      SpeedboostPowerup.MAX_MODIFIER,
    )
    return this
  }

  override apply(p: Player) {
    p.turnRate = PLAYER_CONSTANTS.TURN_RATE * this.modifier
    p.speed = PLAYER_CONSTANTS.SPEED * this.modifier
  }

  override remove(p: Player) {
    p.turnRate = PLAYER_CONSTANTS.TURN_RATE
    p.speed = PLAYER_CONSTANTS.SPEED
  }
}

type PowerupConstructors_ = { [key in POWERUPS]: { new (): any } }
export const PowerupConstructors: PowerupConstructors_ = {
  [POWERUPS.HEALTH_PACK]: HealthPowerup,
  [POWERUPS.LASER]: LaserPowerup,
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
  [POWERUPS.LASER]: LaserPowerup
  [POWERUPS.RAPIDFIRE]: RapidfirePowerup
  [POWERUPS.ROCKET]: RocketPowerup
  [POWERUPS.SHIELD]: ShieldPowerup
  [POWERUPS.SHOTGUN]: ShotgunPowerup
  [POWERUPS.SPEEDBOOST]: SpeedboostPowerup
}
