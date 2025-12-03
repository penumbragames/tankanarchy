/**
 * Stores the state of the player. This class is shared between the server and
 * the client, though the client will be missing the @Exclude fields after
 * deserialization to reduce the data sent over socket.
 * @author omgimanerd
 */

import type { Ref } from 'lib/types/types'

import { Exclude, Type } from 'class-transformer'
import random from 'random'

import * as Constants from 'lib/Constants'
import POWERUPS from 'lib/enums/Powerups'
import PLAYER_CONSTANTS from 'lib/game/entity/player/PlayerConstants'

import PARTICLES from 'lib/enums/Particles'
import { UpdateFrame } from 'lib/game/component/Updateable'
import Cooldown from 'lib/game/Cooldown'
import Entity from 'lib/game/entity/Entity'
import { Ammo } from 'lib/game/entity/player/Ammo'
import PowerupStateMap from 'lib/game/entity/player/PowerupStateMap'
import MathUtil from 'lib/math/MathUtil'
import Vector from 'lib/math/Vector'
import { PlayerInputs } from 'lib/socket/SocketInterfaces'
import { PARTICLE_DRAWING_LAYER } from 'lib/types/Particle'
import { GameServices } from 'server/GameServices'

export default class Player extends Entity {
  static readonly TANK_TRAIL_INTERVAL = 15 // ms
  static readonly TANK_TRAIL_FADEOUT = 5000 // ms

  name: string // player display name, not unique
  // Also serves as the player UID. Required on the client side to distinguish
  // the 'self' player
  socketID: string

  tankAngle: number = 0
  turretAngle: number = 0
  @Exclude() turnRate: number = 0

  speed: number = PLAYER_CONSTANTS.SPEED
  health: number = PLAYER_CONSTANTS.MAX_HEALTH

  // This component cannot be initialized in the constructor since
  // class-transformer's deserialization process calls the constructor of
  // Player. They must be initialized in the factory method or they will be
  // included in the deserialized class even if they have the @Exclude
  // decorator.
  @Type(() => Ammo) ammo!: Ref<Ammo>
  @Type(() => PowerupStateMap) powerups: Ref<PowerupStateMap>

  // Whenever we move, leave a little tank trail behind the player.
  tankTrailCooldown: Cooldown = new Cooldown(Player.TANK_TRAIL_INTERVAL)

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
    this.powerups = new PowerupStateMap(this)
  }

  /**
   * Factory method for a new Player object.
   *
   * @param {string} name The display name of the player
   * @param {string} socketID The associated socket ID
   */
  static create(name: string, socketID: string): Player {
    const p = new Player(name, socketID).spawn()
    p.ammo = new Ammo(p)
    return p
  }

  override update(updateFrame: UpdateFrame, services: GameServices): void {
    this.physics.position.add(
      Vector.scale(this.physics.velocity, updateFrame.deltaTime),
    )
    this.boundToWorld()
    this.tankAngle = MathUtil.normalizeAngle(
      // prettier-ignore
      this.tankAngle + (this.turnRate * updateFrame.deltaTime),
    )

    this.ammo.update(updateFrame, services)
    this.powerups.update(updateFrame, services)

    if (
      this.physics.velocity.mag2 > 0 &&
      this.tankTrailCooldown.trigger(updateFrame)
    ) {
      services.addParticle(PARTICLES.TANK_TRAIL, this.physics.position, {
        layer: PARTICLE_DRAWING_LAYER.PRE_ENTITY,
        angle: this.tankAngle + Math.PI / 2,
        fadeOut: true,
        creationTime: updateFrame.currentTime,
        expirationTime: updateFrame.currentTime + Player.TANK_TRAIL_FADEOUT,
      })
    }
  }

  /**
   * Update this player using a client input packet.
   * @param {PlayerInputs} data The client input packet.
   * @param {UpdateFrame} updateFrame The frame information from the game loop,
   *   which contains the update time and delta time.
   * @param {GameServices} services Service locator for the player to access
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
    this.ammo.updateFromInput(data, updateFrame, services)
  }

  isDead(): boolean {
    return this.health <= 0
  }

  damage(amount: number, source: Player): void {
    const shield = this.powerups.get(POWERUPS.SHIELD)
    if (shield) {
      shield.damage(amount)
    } else {
      this.health -= amount
    }

    if (this.isDead()) {
      this.spawn()
      this.deaths++
      source.kills++
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
      random.int(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
      random.int(
        Constants.WORLD_MIN + Constants.WORLD_PADDING,
        Constants.WORLD_MAX - Constants.WORLD_PADDING,
      ),
    )
    this.health = PLAYER_CONSTANTS.MAX_HEALTH
    return this
  }

  getUid(extra: string): string {
    return `${this.socketID}:${extra}`
  }
}
