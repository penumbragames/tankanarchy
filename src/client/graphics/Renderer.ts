/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

import Canvas from 'client/graphics/Canvas'
import {
  ParticleSprites,
  PowerupSprites,
  SpriteLoader,
  SpriteMap,
} from 'client/graphics/SpriteLoader'
import Particle from 'client/particle/Particle'
import Viewport from 'client/Viewport'
import * as Constants from 'lib/Constants'
import SPRITES from 'lib/enums/Sprites'
import Bullet from 'lib/game/Bullet'
import Player from 'lib/game/Player'
import { Powerup, POWERUP_TYPES } from 'lib/game/Powerup'
import Vector from 'lib/math/Vector'

export default class Renderer {
  static readonly NAME_FONT = '14px Helvetica'
  static readonly NAME_COLOR = 'black'

  static readonly HP_COLOR = '#ce0a17ff'
  static readonly HP_MISSING_COLOR = 'grey'
  static readonly TILE_SIZE = 100

  static readonly DEFAULT_PADDING = 0
  static readonly POWERUP_FADE_CUTOFF = 3
  static readonly POWERUP_FADE_EXPONENTIAL = 50
  static readonly POWERUP_BUFF_SIZE = 55

  canvas: Canvas
  context: CanvasRenderingContext2D
  viewport: Viewport

  sprites: SpriteMap
  powerupSprites: PowerupSprites
  particleSprites: ParticleSprites

  constructor(canvas: Canvas, viewport: Viewport) {
    this.canvas = canvas
    this.context = canvas.context
    this.viewport = viewport
    this.sprites = SpriteLoader.sprites
    this.powerupSprites = SpriteLoader.powerupSprites
    this.particleSprites = SpriteLoader.particleSprites
  }

  static create(canvas: Canvas, viewport: Viewport): Renderer {
    return new Renderer(canvas, viewport)
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
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
    this.context.fillText(player.name as string, 0, -50)

    for (let i = 0; i < 10; ++i) {
      if (i < player.health) {
        this.context.fillStyle = Renderer.HP_COLOR
      } else {
        this.context.fillStyle = Renderer.HP_MISSING_COLOR
      }
      this.context.fillRect(-25 + (5 * i), -40, 5, 4) // prettier-ignore
    }

    const tankSprite = isSelf
      ? this.sprites[SPRITES.SELF_TANK]
      : this.sprites[SPRITES.OTHER_TANK]
    tankSprite.draw(this.context, { centered: true, angle: player.tankAngle })
    const turretSprite = isSelf
      ? this.sprites[SPRITES.SELF_TURRET]
      : this.sprites[SPRITES.OTHER_TURRET]
    turretSprite.draw(this.context, {
      centered: true,
      angle: player.turretAngle,
    })

    if (player.powerups.get(POWERUP_TYPES.SHIELD)) {
      this.sprites[SPRITES.SHIELD].draw(this.context, { centered: true })
    }

    this.context.restore()
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
    for (const powerupType of Object.values(POWERUP_TYPES)) {
      if (powerupType === POWERUP_TYPES.HEALTH_PACK) continue
      let powerup
      if ((powerup = self.powerups.get(powerupType))) {
        // Compute the alpha of the buff based on how close we are to expiring.
        // We only begin fading the buff close to actual expiration.
        const remainingSeconds = powerup.remainingSeconds
        this.powerupSprites[powerupType].draw(this.context, {
          x: offset,
          y: Renderer.DEFAULT_PADDING,
          width: Renderer.POWERUP_BUFF_SIZE,
          height: Renderer.POWERUP_BUFF_SIZE,
          opacity:
            remainingSeconds < Renderer.POWERUP_FADE_CUTOFF
              ? this.getBuffAlpha(remainingSeconds)
              : 1,
        })
        offset -= Renderer.POWERUP_BUFF_SIZE
      }
    }
  }

  /**
   * Draws a bullet (tank shell) to the canvas.
   * @param {Bullet} bullet The bullet to draw to the canvas
   */
  drawBullet(bullet: Bullet): void {
    const canvasCoords = this.viewport.toCanvas(bullet.position)
    this.sprites[SPRITES.BULLET].draw(this.context, {
      position: canvasCoords,
      centered: true,
      angle: bullet.angle,
    })
  }

  /**
   * Draws a powerup to the canvas.
   * @param {Powerup} powerup The powerup to draw
   */
  drawPowerup(powerup: Powerup): void {
    const canvasCoords = this.viewport.toCanvas(powerup.position)
    this.powerupSprites[powerup.type].draw(this.context, {
      position: canvasCoords,
      centered: true,
    })
  }

  drawParticle(particle: Particle): void {
    const canvasCoords = this.viewport.toCanvas(particle.position)
    this.particleSprites[particle.type].draw(this.context, {
      position: canvasCoords,
      centered: true,
      frame: particle.frame,
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
        this.sprites[SPRITES.TILE].draw(this.context, { x, y })
      }
    }
  }
}
