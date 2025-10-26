/**
 * Wrapper class for HTMLCanvasElement to expose some more useful things.
 * @author omgimanerd (alvin@omgimanerd.tech)
 */

export default class Canvas {
  canvas: HTMLCanvasElement

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  static getFromId(id: string): Canvas {
    return new Canvas(document.getElementById(id) as HTMLCanvasElement)
  }

  bindResizeListener() {
    window.addEventListener(
      'resize',
      () => {
        this.width = this.elementWidth
        this.height = this.elementHeight
      },
      true,
    )
  }

  get raw() {
    return this.canvas
  }

  get context() {
    return this.canvas.getContext('2d')
  }

  get width() {
    return this.canvas.width
  }

  set width(width: number) {
    this.canvas.width = width
  }

  get height() {
    return this.canvas.height
  }

  set height(height: number) {
    this.canvas.height = height
  }

  get aspectRatio() {
    return this.width / this.height
  }

  get elementWidth() {
    return this.canvas.offsetWidth
  }

  get elementHeight() {
    return this.canvas.offsetHeight
  }

  get elementAspectRatio() {
    return this.elementWidth / this.elementHeight
  }
}
