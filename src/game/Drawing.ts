/**
 * Methods for drawing all the sprites onto the HTML5 canvas.
 * @author kennethli.3470@gmail.com (Kenneth Li)
 */

const Constants = require('../../../lib/Constants')
const Util = require('../../../lib/Util')

/**
 * Drawing class.
 */
class Drawing {
  /**
   * Constructor for the Drawing class.
   * @param {CanvasRenderingContext2D} context The canvas context to draw to
   * @param {Object<string, Image>} images The image assets for each entity
   * @param {Viewport} viewport The viewport class to translate from absolute
   *   world coordinates to relative cannon coordinates.
   */
  constructor(context, images, viewport) {
    this.context = context
    this.images = images
    this.viewport = viewport

    this.width = context.canvas.width
    this.height = context.canvas.height
  }

  /**
   * Factory method for creating a Drawing object.
   * @param {Element} canvas The canvas element to draw to
   * @param {Viewport} viewport The viewport object for coordinate translation
   * @return {Drawing}
   */
  static create(canvas, viewport) {
    const context = canvas.getContext('2d')
    const images = {}
    for (const key of Constants.DRAWING_IMG_KEYS) {
      images[key] = new Image()
      images[key].src = `${Constants.DRAWING_IMG_BASE_PATH}/${key}.png`
    }
    for (const type of Constants.POWERUP_KEYS) {
      images[type] = new Image()
      images[type].src =
        `${Constants.DRAWING_IMG_BASE_PATH}/${type}_powerup.png`
    }
    return new Drawing(context, images, viewport)
  }

  /**
   * Convert an angle from the real math system to funky canvas coordinates.
   * @param {number} angle The angle to translate
   * @return {number}
   */
  static translateAngle(angle) {
    return Util.normalizeAngle(angle + Math.PI / 2)
  }

  /**
   * Draws an image on the canvas at the centered at the origin.
   * @param {Image} image The image to draw on the canvas
   */
  drawCenteredImage(image) {
    this.context.drawImage(image, -image.width / 2, -image.height / 2)
  }

  /**
   * Clears the canvas.
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Draws a player to the canvas as a tank.
   * @param {boolean} isSelf If this is true, then a green tank will be draw
   *   to denote the player's tank. Otherwise a red tank will be drawn to
   *   denote an enemy tank.
   * @param {Player} player The player object to draw.
   */
  drawTank(isSelf, player) {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(player.position)
    this.context.translate(canvasCoords.x, canvasCoords.y)

    this.context.textAlign = 'center'
    this.context.font = Constants.DRAWING_NAME_FONT
    this.context.fillStyle = Constants.DRAWING_NAME_COLOR
    this.context.fillText(player.name, 0, -50)

    for (let i = 0; i < 10; ++i) {
      if (i < player.health) {
        this.context.fillStyle = Constants.DRAWING_HP_COLOR
      } else {
        this.context.fillStyle = Constants.DRAWING_HP_MISSING_COLOR
      }
      this.context.fillRect(-25 + 5 * i, -40, 5, 4)
    }

    this.context.rotate(Drawing.translateAngle(player.tankAngle))
    this.drawCenteredImage(this.images[
      // eslint-disable-next-line multiline-ternary
      isSelf ? Constants.DRAWING_IMG_SELF_TANK :
        Constants.DRAWING_IMG_OTHER_TANK
    ])
    this.context.rotate(-Drawing.translateAngle(player.tankAngle))

    this.context.rotate(Drawing.translateAngle(player.turretAngle))
    this.drawCenteredImage(this.images[
      // eslint-disable-next-line multiline-ternary
      isSelf ? Constants.DRAWING_IMG_SELF_TURRET :
        Constants.DRAWING_IMG_OTHER_TURRET
    ])

    if (player.powerups[Constants.POWERUP_SHIELD]) {
      this.context.rotate(-Drawing.translateAngle(-player.turretAngle))
      this.drawCenteredImage(this.images[Constants.DRAWING_IMG_SHIELD])
    }

    this.context.restore()
  }

  /**
   * Draws a bullet (tank shell) to the canvas.
   * @param {Bullet} bullet The bullet to draw to the canvas
   */
  drawBullet(bullet) {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(bullet.position)
    this.context.translate(canvasCoords.x, canvasCoords.y)
    this.context.rotate(Drawing.translateAngle(bullet.angle))
    this.drawCenteredImage(this.images[Constants.DRAWING_IMG_BULLET])
    this.context.restore()
  }

  /**
   * Draws a powerup to the canvas.
   * @param {Powerup} powerup The powerup to draw
   */
  drawPowerup(powerup) {
    this.context.save()
    const canvasCoords = this.viewport.toCanvas(powerup.position)
    this.context.translate(canvasCoords.x, canvasCoords.y)
    this.drawCenteredImage(this.images[powerup.type])
    this.context.restore()
  }

  /**
   * Draws the background tiles to the canvas.
   */
  drawTiles() {
    const start = this.viewport.toCanvas(
      { x: Constants.WORLD_MIN, y: Constants.WORLD_MIN })
    const end = this.viewport.toCanvas(
      { x: Constants.WORLD_MAX, y: Constants.WORLD_MAX })
    for (let x = start.x; x < end.x; x += Constants.DRAWING_TILE_SIZE) {
      for (let y = start.y; y < end.y; y += Constants.DRAWING_TILE_SIZE) {
        this.context.drawImage(this.images[Constants.DRAWING_IMG_TILE], x, y)
      }
    }
  }
}

module.exports = Drawing
