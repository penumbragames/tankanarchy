/**
 * Class encapsulating a drawable animated sprite asset. A single instance is
 * initialized globally for each animated sprite.
 * @author omgimanerd
 */

import { Drawable, Sprite } from 'client/graphics/Sprite'
import loadResource from 'client/lib/ResourceLoader'

export default class AnimatedSprite extends Sprite {
  baseImage: HTMLImageElement
  animationFrames: ImageBitmap[]

  constructor(baseImage: HTMLImageElement, animationFrames: ImageBitmap[]) {
    super()
    this.baseImage = baseImage
    this.animationFrames = animationFrames
  }

  /**
   * Slices an input image into an array of ImageBitmaps. The input image must
   * have a width divisible by its height, and will be sliced into (h/w) frames
   * ordered from left to right.
   *
   * @param image The input image to slice into an array of bitmaps.
   * @returns An array of frames sliced from the input image.
   */
  static async sliceImage(image: HTMLImageElement): Promise<ImageBitmap[]> {
    const width = image.width
    const height = image.height
    if (width % height !== 0) {
      throw new Error(`Cannot slice image ${image.src} into bitmaps.`)
    }
    const promises = []
    for (let offset = 0; offset < width; offset += height) {
      promises.push(createImageBitmap(image, offset, 0, height, height))
    }
    return Promise.all(promises)
  }

  static async create(src: string): Promise<AnimatedSprite> {
    const img = await loadResource(Image, src)
    return new AnimatedSprite(img, await AnimatedSprite.sliceImage(img))
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
