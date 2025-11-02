/**
 * Class encapsulating a drawable static image sprite.
 * @author omgimanerd
 */

import { Drawable, Sprite } from 'client/graphics/Sprite'

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

  getImage(frame: number | undefined): Drawable {
    if (frame !== undefined) {
      throw new Error('StaticSprite does not support a frame argument!')
    }
    return this.image
  }
}
