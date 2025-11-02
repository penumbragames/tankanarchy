/**
 * Class encapsulating a drawable animated sprite.
 * @author omgimanerd
 */

import { loadImage, sliceImage } from 'client/graphics/ImageUtils'
import { Drawable, Sprite } from 'client/graphics/Sprite'

export default class AnimatedSprite extends Sprite {
  baseImage: HTMLImageElement
  frames: ImageBitmap[]

  constructor(baseImage: HTMLImageElement, frames: ImageBitmap[]) {
    super()
    this.baseImage = baseImage
    this.frames = frames
  }

  static async create(src: string): Promise<AnimatedSprite> {
    const img = await loadImage(src)
    return new AnimatedSprite(img, await sliceImage(img))
  }

  get numFrames() {
    return this.frames.length
  }

  get width() {
    return this.frames[0].width
  }

  get height() {
    return this.frames[0].height
  }

  getImage(frame: number | undefined): Drawable {
    return this.frames[frame ?? 0]
  }
}
