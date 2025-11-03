/**
 * Class encapsulating a drawable animated sprite.
 * @author omgimanerd
 */

import { loadImage, sliceImage } from 'client/graphics/ImageUtils'
import { Drawable, Sprite } from 'client/graphics/Sprite'

export default class AnimatedSprite extends Sprite {
  baseImage: HTMLImageElement
  animationFrames: ImageBitmap[]

  constructor(baseImage: HTMLImageElement, animationFrames: ImageBitmap[]) {
    super()
    this.baseImage = baseImage
    this.animationFrames = animationFrames
  }

  static async create(src: string): Promise<AnimatedSprite> {
    const img = await loadImage(src)
    return new AnimatedSprite(img, await sliceImage(img))
  }

  get frames() {
    return this.animationFrames.length
  }

  get width() {
    return this.animationFrames[0].width
  }

  get height() {
    return this.animationFrames[0].height
  }

  getImage(frame: number | undefined): Drawable {
    return this.animationFrames[frame ?? 0]
  }
}
