/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

import * as Constants from 'lib/Constants'
import POWERUPS from 'lib/enums/Powerups'
import SPRITES from 'lib/enums/Sprites'

import {
  PARTICLE_SPRITES,
  POWERUP_SPRITES,
  SPRITE_MAP,
} from 'client/graphics/Sprites'

import Canvas from 'client/graphics/Canvas'
import Particle from 'client/particle/Particle'
import Viewport from 'client/Viewport'
import Bullet from 'lib/game/Bullet'
import Entity from 'lib/game/Entity'
import Player from 'lib/game/Player'
import PLAYER_CONSTANTS from 'lib/game/PlayerConstants'
import Powerup from 'lib/game/Powerup'
import Vector from 'lib/math/Vector'

export default class Renderer {
  static readonly NAME_FONT = '14px Helvetica'
  static readonly NAME_COLOR = 'black'

  static readonly HP_COLOR = '#ce0a17ff'
  static readonly HP_MISSING_COLOR = 'grey'
  static readonly TILE_SIZE = 100

  static readonly DEFAULT_PADDING = 10
  static readonly POWERUP_FADE_CUTOFF = 3
  static readonly POWERUP_FADE_EXPONENTIAL = 50
  static readonly POWERUP_BUFF_SIZE = 40

  canvas: Canvas
  context: CanvasRenderingContext2D
  viewport: Viewport

  constructor(canvas: Canvas, viewport: Viewport) {
    this.canvas = canvas
    this.context = canvas.context
    this.viewport = viewport
  }

  static create(canvas: Canvas, viewport: Viewport): Renderer {
    return new Renderer(canvas, viewport)
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawDebugHitbox(e: Entity): void {
    if (DEBUG && false) {
      this.context.beginPath()
      const canvasCoords = this.viewport.toCanvas(e.position)
      this.context.arc(
        canvasCoords.x,
        canvasCoords.y,
        e.hitboxSize,
        0,
        2 * Math.PI,
        false,
      )
      this.context.strokeStyle = 'red'
      this.context.lineWidth = 3
      this.context.stroke()
    }
  }

  /**
   * Draws a player to the canvas as a tank.
   * @param {boolean} isSelf If this is true, then a green tank will be draw
   *   to denote the player's tank. Otherwise a red tank will be drawn to
   *   denote an enemy tank.
   * @param {Player} player The player object to draw.
   */
  drawTank(isSelf: boolean, player: Player): void {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(player.position)
    // The canvas is already translated to the center of the player coordinate,
    // so all further sprite rendering should be done with that in mind.
    this.context.translate(canvasCoords.x, canvasCoords.y)

    this.context.textAlign = 'center'
    this.context.font = Renderer.NAME_FONT
    this.context.fillStyle = Renderer.NAME_COLOR
    this.context.fillText(player.name, 0, -50)
    for (let i = 0; i < 10; ++i) {
      if (i < player.health) {
        this.context.fillStyle = Renderer.HP_COLOR
      } else {
        this.context.fillStyle = Renderer.HP_MISSING_COLOR
      }
      this.context.fillRect(-25 + (5 * i), -40, 5, 4) // prettier-ignore
    }

    const tankSprite = isSelf
      ? SPRITE_MAP[SPRITES.SELF_TANK]
      : SPRITE_MAP[SPRITES.OTHER_TANK]
    tankSprite.draw(this.context, { centered: true, angle: player.tankAngle })
    const turretSprite = isSelf
      ? SPRITE_MAP[SPRITES.SELF_TURRET]
      : SPRITE_MAP[SPRITES.OTHER_TURRET]
    turretSprite.draw(this.context, {
      centered: true,
      angle: player.turretAngle,
    })

    if (player.powerupStates.get(POWERUPS.SHIELD)) {
      SPRITE_MAP[SPRITES.SHIELD].draw(this.context, {
        width: PLAYER_CONSTANTS.SHIELD_HITBOX_SIZE * 2,
        height: PLAYER_CONSTANTS.SHIELD_HITBOX_SIZE * 2,
        centered: true,
      })
    }

    this.context.restore()
    this.drawDebugHitbox(player)
  }

  getBuffAlpha(remainingSeconds: number): number {
    return (
      Math.sin(Renderer.POWERUP_FADE_EXPONENTIAL / remainingSeconds) / 2 + 0.5
    )
  }

  /**
   * Draws the status of the current player's buffs to the top right.
   * @param {Player} self
   */
  drawBuffStatus(self: Player): void {
    // Iterate through the powerup types to render them in a deterministic
    // order.
    let offset =
      this.canvas.width - Renderer.DEFAULT_PADDING - Renderer.POWERUP_BUFF_SIZE
    for (const powerupType of Object.values(POWERUPS)) {
      if (powerupType === POWERUPS.HEALTH_PACK) continue
      let powerup
      if ((powerup = self.powerupStates.get(powerupType))) {
        // Compute the alpha of the buff based on how close we are to expiring.
        // We only begin fading the buff close to actual expiration.
        const remainingSeconds = powerup.remainingSeconds
        POWERUP_SPRITES[powerupType].draw(this.context, {
          x: offset,
          y: Renderer.DEFAULT_PADDING,
          width: Renderer.POWERUP_BUFF_SIZE,
          height: Renderer.POWERUP_BUFF_SIZE,
          opacity:
            remainingSeconds < Renderer.POWERUP_FADE_CUTOFF
              ? this.getBuffAlpha(remainingSeconds)
              : 1,
        })
        offset -= Renderer.POWERUP_BUFF_SIZE + Renderer.DEFAULT_PADDING
      }
    }
  }

  /**
   * Draws a bullet (tank shell) to the canvas.
   * @param {Bullet} bullet The bullet to draw to the canvas
   */
  drawBullet(bullet: Bullet): void {
    const canvasCoords = this.viewport.toCanvas(bullet.position)
    SPRITE_MAP[SPRITES.BULLET].draw(this.context, {
      position: canvasCoords,
      centered: true,
      angle: bullet.angle,
    })
    this.drawDebugHitbox(bullet)
  }

  /**
   * Draws a powerup to the canvas.
   * @param {Powerup} powerup The powerup to draw
   */
  drawPowerup(powerup: Powerup): void {
    const canvasCoords = this.viewport.toCanvas(powerup.position)
    POWERUP_SPRITES[powerup.type].draw(this.context, {
      position: canvasCoords,
      width: powerup.hitboxSize * 2,
      height: powerup.hitboxSize * 2,
      centered: true,
    })
    this.drawDebugHitbox(powerup)
  }

  drawParticle(particle: Particle): void {
    const canvasCoords = this.viewport.toCanvas(particle.position)
    PARTICLE_SPRITES[particle.type].draw(this.context, {
      position: canvasCoords,
      centered: true,
      frame: particle.animationManager.frame,
    })
  }

  drawTiles(): void {
    const start = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MIN, Constants.WORLD_MIN),
    )
    const end = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MAX, Constants.WORLD_MAX),
    )
    for (let x = start.x; x < end.x; x += Renderer.TILE_SIZE) {
      for (let y = start.y; y < end.y; y += Renderer.TILE_SIZE) {
        SPRITE_MAP[SPRITES.TILE].draw(this.context, { x, y })
      }
    }
  }
}
