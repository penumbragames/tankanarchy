/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

import Canvas from 'client/graphics/Canvas'
import * as Sprites from 'client/graphics/Sprites'
import Viewport from 'client/Viewport'
import * as Constants from 'lib/Constants'
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

    const tankSprite = isSelf ? Sprites.SELF_TANK : Sprites.OTHER_TANK
    tankSprite.drawCenteredAt(this.context, 0, 0, player.tankAngle)
    const turretSprite = isSelf ? Sprites.SELF_TURRET : Sprites.OTHER_TURRET
    turretSprite.drawCenteredAt(this.context, 0, 0, player.turretAngle)

    if (player.powerups.get(POWERUP_TYPES.SHIELD)) {
      this.context.rotate(-player.turretAngle)
      Sprites.SHIELD.drawCentered(this.context)
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
        this.context.globalAlpha =
          remainingSeconds < Renderer.POWERUP_FADE_CUTOFF
            ? this.getBuffAlpha(remainingSeconds)
            : 1
        Sprites.POWERUP_SPRITE_MAP[powerupType].drawAt(
          this.context,
          offset,
          Renderer.DEFAULT_PADDING,
        )
        offset -= Renderer.POWERUP_BUFF_SIZE
      }
    }
    // Reset the global alpha.
    this.context.globalAlpha = 1
  }

  /**
   * Draws a bullet (tank shell) to the canvas.
   * @param {Bullet} bullet The bullet to draw to the canvas
   */
  drawBullet(bullet: Bullet): void {
    const canvasCoords = this.viewport.toCanvas(bullet.position)
    Sprites.BULLET.drawCenteredAt(
      this.context,
      canvasCoords.x,
      canvasCoords.y,
      bullet.angle,
    )
  }

  /**
   * Draws a powerup to the canvas.
   * @param {Powerup} powerup The powerup to draw
   */
  drawPowerup(powerup: Powerup): void {
    const canvasCoords = this.viewport.toCanvas(powerup.position)
    Sprites.POWERUP_SPRITE_MAP[powerup.type].drawCenteredAt(
      this.context,
      canvasCoords.x,
      canvasCoords.y,
    )
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
        Sprites.TILE.drawAt(this.context, x, y)
      }
    }
  }
}
