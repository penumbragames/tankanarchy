/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

import * as Constants from '../lib/Constants'
import Bullet from '../server/Bullet'
import Player from '../server/Player'
import Powerup from '../server/Powerup'
import Vector from '../lib/Vector'
import Viewport from './Viewport'

class Drawing {
  context: CanvasRenderingContext2D
  images: Map<
    Constants.DRAWING_IMG_KEYS | Constants.POWERUP_TYPES,
    HTMLImageElement
  >

  viewport: Viewport

  width: number
  height: number

  constructor(
    context: CanvasRenderingContext2D,
    images: Map<Constants.DRAWING_IMG_KEYS, HTMLImageElement>,
    viewport: Viewport,
  ) {
    this.context = context
    this.images = images
    this.viewport = viewport

    this.width = context.canvas.width
    this.height = context.canvas.height
  }

  static create(canvas: HTMLCanvasElement, viewport: Viewport): Drawing {
    const context = canvas.getContext('2d')!
    const images = new Map()
    for (const [key, filename] of Constants.DRAWING_IMG_KEY_TO_ASSET) {
      const img = new Image()
      img.src = `${Constants.DRAWING_IMG_BASE_PATH}/${filename}`
      images.set(key, img)
    }
    return new Drawing(context, images, viewport)
  }

  /**
   * Draws an image on the canvas at the centered at the origin.
   * @param {Image} image The image to draw on the canvas
   */
  drawCenteredImage(image: HTMLImageElement): void {
    this.context.drawImage(image, -image.width / 2, -image.height / 2)
  }

  clear(): void {
    this.context.clearRect(0, 0, this.width, this.height)
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
    this.context.font = Constants.DRAWING_NAME_FONT
    this.context.fillStyle = Constants.DRAWING_NAME_COLOR
    this.context.fillText(player.name as string, 0, -50)

    for (let i = 0; i < 10; ++i) {
      if (i < player.health) {
        this.context.fillStyle = Constants.DRAWING_HP_COLOR
      } else {
        this.context.fillStyle = Constants.DRAWING_HP_MISSING_COLOR
      }
      // prettier-ignore
      this.context.fillRect(-25 + (5 * i), -40, 5, 4)
    }

    this.context.rotate(player.tankAngle)
    this.drawCenteredImage(
      this.images.get(
        isSelf
          ? Constants.DRAWING_IMG_KEYS.SELF_TANK
          : Constants.DRAWING_IMG_KEYS.OTHER_TANK,
      )!,
    )
    this.context.rotate(-player.tankAngle)

    this.context.rotate(player.turretAngle)
    this.drawCenteredImage(
      this.images.get(
        isSelf
          ? Constants.DRAWING_IMG_KEYS.SELF_TURRET
          : Constants.DRAWING_IMG_KEYS.OTHER_TURRET,
      )!,
    )
    if (player.powerups.get(Constants.POWERUP_TYPES.SHIELD)) {
      this.context.rotate(-player.turretAngle)
      this.drawCenteredImage(
        this.images.get(Constants.DRAWING_IMG_KEYS.PLAYER_SHIELD)!,
      )
    }

    this.context.restore()
  }

  /**
   * Draws a bullet (tank shell) to the canvas.
   * @param {Bullet} bullet The bullet to draw to the canvas
   */
  drawBullet(bullet: Bullet): void {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(bullet.position)
    this.context.translate(canvasCoords.x, canvasCoords.y)
    this.context.rotate(bullet.angle)
    this.drawCenteredImage(this.images.get(Constants.DRAWING_IMG_KEYS.BULLET)!)
    this.context.restore()
  }

  /**
   * Draws a powerup to the canvas.
   * @param {Powerup} powerup The powerup to draw
   */
  drawPowerup(powerup: Powerup): void {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(powerup.position)
    this.context.translate(canvasCoords.x, canvasCoords.y)
    // Reverse lookup enum since it becomes the JSONified value in the request.
    const powerupType = Object.entries(Constants.POWERUP_TYPES).find(
      ([k]) => k === powerup.type,
    )![1]
    this.drawCenteredImage(this.images.get(powerupType)!)
    this.context.restore()
  }

  /**
   * Draws the background tiles to the canvas.
   */
  drawTiles(): void {
    const start = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MIN, Constants.WORLD_MIN),
    )
    const end = this.viewport.toCanvas(
      new Vector(Constants.WORLD_MAX, Constants.WORLD_MAX),
    )
    for (let x = start.x; x < end.x; x += Constants.DRAWING_TILE_SIZE) {
      for (let y = start.y; y < end.y; y += Constants.DRAWING_TILE_SIZE) {
        this.context.drawImage(
          this.images.get(Constants.DRAWING_IMG_KEYS.TILE)!,
          x,
          y,
        )
      }
    }
  }
}

export default Drawing
