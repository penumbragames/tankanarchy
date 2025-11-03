/**
 * Class encapsulating a drawable static image sprite.
 * @author omgimanerd
 */

import { loadImage } from 'client/graphics/ImageUtils'
import { Drawable, Sprite } from 'client/graphics/Sprite'

export default class StaticSprite extends Sprite {
  image: HTMLImageElement

  constructor(image: HTMLImageElement) {
    super()
    this.image = image
  }

  static async create(src: string): Promise<StaticSprite> {
    return new StaticSprite(await loadImage(src))
  }

  get frames(): number {
    throw new Error('Invalid frames() for a static sprite')
  }

  get width() {
    return this.image.width
  }

  get height() {
    return this.image.height
  }

  getImage(frame: number | undefined): Drawable {
    if (frame !== undefined) {
      throw new Error('StaticSprite does not support a frame argument!')
    }
    return this.image
  }
}
