/**
 * Class encapsulating a drawable static image sprite.
 * @author omgimanerd
 */

import { DrawingOptions, Sprite } from 'client/graphics/Sprite'

type Context = CanvasRenderingContext2D

export default class StaticSprite extends Sprite {
  image: HTMLImageElement

  constructor(image: HTMLImageElement) {
    super()
    this.image = image
  }

  static create(src: string): StaticSprite {
    const img = new Image()
    img.src = src
    return new StaticSprite(img)
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height
  }

  getImage(frame: number | undefined): HTMLImageElement {
    if (frame !== undefined) {
      throw new Error('StaticSprite does not support a frame argument!')
    }
    return this.image
  }

  draw(context: Context, options: DrawingOptions) {
    let width = options.width ?? this.width
    let height = options.height ?? this.height
    let x = options.centered ? -width / 2 : 0
    let y = options.centered ? -height / 2 : 0
    let oldOpacity = context.globalAlpha
    if (options.opacity) {
      context.globalAlpha = options.opacity
    }
    this.newCanvasState(context, () => {
      if (options.x || options.y) {
        context.translate(options.x ?? 0, options.y ?? 0)
      }
      if (options.angle) {
        context.rotate(options.angle)
      }
      context.drawImage(this.getImage(options.frame), x, y, width, height)
    })
    if (options.opacity) {
      context.globalAlpha = oldOpacity
    }
  }
}
